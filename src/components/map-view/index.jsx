import { fetchSensors, selectSensors, selectSensorsError, selectSensorsLoading } from '@/store/slices/sensorsSlice';
import { ErrorBanner, LoadingOverlay, MapLegend, SensorPopup } from './components';
import { Section, SectionHeading, GradientText } from '@/components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPM25Color } from '@/rules/qualidadeAr';
import { RecenterControl } from './classes';
import { VIEW_CONFIG } from './rules';

// OpenLayers imports
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import VectorSource from 'ol/source/Vector';
import { Point, LineString } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import Cluster from 'ol/source/Cluster';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Map from 'ol/Map';
import 'ol/ol.css';

function get_pm25(sensor) {
  const sensor_reading_1 = sensor.last_readings?.[0]?.pms1_pm2_5_env;
  const sensor_reading_2 = sensor.last_readings?.[0]?.pms2_pm2_5_env;
  return Number(((sensor_reading_1 || 0) + (sensor_reading_2 || 0)) / 2);
}

function styleSensor(feature) {
  const cor = feature.get('cor');
  const texto = feature.get('texto');
  const pm25 = feature.get('pm25');
  const online = feature.get('isOnline');

  return new Style({
    zIndex: online ? 2 : 1,
    image: new CircleStyle({
      radius: 15,
      fill: new Fill({ color: cor }),
      stroke: new Stroke({ color: 'white', width: 3 }),
    }),
    text: new Text({
      text: online ? (pm25 ?? '').toString() : '-',
      fill: new Fill({ color: texto }),
      font: 'bold 9px Arial',
      offsetY: 0,
    }),
  });
}

function styleSpider(feature) {
  const type = feature.get('spiderType');
  if (type === 'leg') {
    return new Style({
      stroke: new Stroke({ color: 'rgba(0,0,0,0.5)', width: 1.5, lineDash: [4, 4] }),
    });
  }

  const cor = feature.get('cor');
  const texto = feature.get('texto');
  const pm25 = feature.get('pm25');
  const online = feature.get('isOnline');

  return new Style({
    image: new CircleStyle({
      radius: 15,
      fill: new Fill({ color: cor }),
      stroke: new Stroke({ color: 'white', width: 3 }),
    }),
    text: new Text({
      text: online ? (pm25 ?? '').toString() : '-',
      fill: new Fill({ color: texto }),
      font: 'bold 8px Arial',
    }),
  });
}

function styleCluster(feature) {
  const features = feature.get('features');
  const size = features.length;

  if (size === 1) {
    const f = features[0];
    const cor = f.get('cor');
    const texto = f.get('texto');
    const pm25 = f.get('pm25');
    const online = f.get('isOnline');
    return new Style({
      zIndex: online ? 2 : 1,
      image: new CircleStyle({
        radius: 15,
        fill: new Fill({ color: cor }),
        stroke: new Stroke({ color: 'white', width: 3 }),
      }),
      text: new Text({
        text: online ? (pm25 ?? '').toString() : '-',
        fill: new Fill({ color: texto }),
        font: 'bold 9px Arial',
        offsetY: 0,
      }),
    });
  }

  const worst = features.reduce(
    (worst, f) => {
      const pm25 = f.get('pm25');
      return pm25 > (worst.pm25 || 0) ? { pm25, feature: f } : worst;
    },
    { pm25: 0, feature: null }
  );
  const cor = worst.feature?.get('cor') || '#9e9e9e';

  return new Style({
    image: new CircleStyle({
      radius: Math.min(17 + size * 1.5, 28),
      fill: new Fill({ color: cor }),
      stroke: new Stroke({ color: 'white', width: 3 }),
    }),
    text: new Text({
      text: `${size}`,
      fill: new Fill({ color: '#fff' }),
      font: 'bold 11px Arial',
      stroke: new Stroke({ color: '#000', width: 2 }),
    }),
  });
}

/**
 * Mapa interativo com sensores, popup de detalhes e controles de zoom/recenter.
 */
export function MapView() {
  const dispatch = useDispatch();
  const sensors = useSelector(selectSensors);
  const loading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vectorSourceRef = useRef(null);
  const popupRef = useRef(null);
  const overlayRef = useRef(null);
  const sensorsRef = useRef(sensors);
  sensorsRef.current = sensors;

  const [popupId, setPopupId] = useState(null);
  const [chartKey, setChartKey] = useState(0);

  const popupSensor = popupId ? sensors.find((s) => s.id === popupId) : null;

  const unspiderfyRef = useRef(() => {});

  function closePopup() {
    setPopupId(null);
    overlayRef.current?.setPosition(undefined);
    unspiderfyRef.current();
  }

  const buildFeatures = useCallback((sensors) => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.clear();

    const features = sensors
      .filter((s) => s.gps?.coordinates?.[0] != null && s.gps?.coordinates?.[1] != null)
      .map((s) => {
        const pm25 = get_pm25(s);
        const online = s.is_online ?? false;
        const faixa = online ? getPM25Color(pm25) : { cor: '#9e9e9e', texto: '#ffffff', label: 'Offline' };
        return new Feature({
          geometry: new Point(fromLonLat([s.gps.coordinates[0], s.gps.coordinates[1]])),
          sensor_id: s.id,
          nome: s.name,
          isOnline: online,
          pm25,
          latestReading: s.latest_reading,
          oldestReading: s.oldest_reading,
          cor: faixa.cor,
          texto: faixa.texto,
          label: faixa.label,
        });
      });

    vectorSourceRef.current.addFeatures(features);
  }, []);

  useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls().extend([new FullScreen(), new RecenterControl()]),
      layers: [new TileLayer({ source: new OSM() })],
      view: new View(VIEW_CONFIG),
    });

    const vectorSource = new VectorSource();
    const clusterSource = new Cluster({
      source: vectorSource,
      distance: 50,
    });
    const clusterLayer = new VectorLayer({ source: clusterSource, style: styleCluster });
    map.addLayer(clusterLayer);
    vectorSourceRef.current = vectorSource;

    const spiderSource = new VectorSource();
    const spiderLayer = new VectorLayer({ source: spiderSource, style: styleSpider, zIndex: 100 });
    map.addLayer(spiderLayer);

    let spiderfiedFeatures = [];
    let isSpiderfied = false;
    let animFrameId = null;

    function cancelAnim() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }

    function animate(duration, onFrame, onDone) {
      const start = performance.now();
      function step(time) {
        const t = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        onFrame(eased);
        if (t < 1) {
          animFrameId = requestAnimationFrame(step);
        } else {
          animFrameId = null;
          onDone();
        }
      }
      animFrameId = requestAnimationFrame(step);
    }

    function spiderfy(features, centerCoord) {
      cancelAnim();

      // Restore any previously spiderfied features
      if (spiderfiedFeatures.length > 0) {
        spiderSource.clear();
        spiderfiedFeatures = [];
        isSpiderfied = false;
      }

      // Hide cluster layer so only spider leaves are visible
      clusterLayer.setVisible(false);

      const { PI, abs, min, max } = Math;
      const num = features.length;
      const pixelRadius = min(15 + 15 * num, 60);
      const centerPixel = map.getPixelFromCoordinate(centerCoord);
      const rightCoord = map.getCoordinateFromPixel([centerPixel[0] + pixelRadius, centerPixel[1]]);
      const meterRadius = abs(rightCoord[0] - centerCoord[0]);

      // Só alguns cálculos de angulo para distribuir os sensores em volta do ponto central de forma agradável
      const isSmallCluster = num <= 3;
      const isP0OnAxis = num % 2 === 0;

      // Marque isP0OnAxis com "!" para a distribuição começar ou não exatamente no eixo horizontal
      const spreadAngle = isSmallCluster ? (2 * PI) / 3 : (2 * PI) / num;
      const startAngle = isSmallCluster ? (5 * PI) / 6 : !isP0OnAxis ? PI - spreadAngle / 2 : PI;

      const items = [];

      features.forEach((feature, i) => {
        const angle = startAngle - spreadAngle * (num - 1) * i;
        const targetCoord = [
          centerCoord[0] + meterRadius * Math.cos(angle),
          centerCoord[1] + meterRadius * Math.sin(angle),
        ];

        const leaf = feature.clone();
        leaf.getGeometry().setCoordinates(centerCoord);
        leaf.set('spiderType', 'leaf');

        const leg = new Feature({
          geometry: new LineString([centerCoord, centerCoord]),
          spiderType: 'leg',
        });
        leg.set('_leafRef', leaf);

        spiderSource.addFeatures([leg, leaf]);
        items.push({ leg, leaf, targetCoord });
      });

      spiderfiedFeatures = features;
      isSpiderfied = true;

      animate(
        300,
        (eased) => {
          items.forEach(({ leg, leaf, targetCoord }) => {
            const current = [
              centerCoord[0] + (targetCoord[0] - centerCoord[0]) * eased,
              centerCoord[1] + (targetCoord[1] - centerCoord[1]) * eased,
            ];
            leaf.getGeometry().setCoordinates(current);
            leg.setGeometry(new LineString([centerCoord, current]));
          });
        },
        () => {}
      );
    }

    function unspiderfy() {
      if (!isSpiderfied) return;
      cancelAnim();

      const centerCoord = spiderfiedFeatures[0].getGeometry().getCoordinates();
      const allFeatures = spiderSource.getFeatures();
      const leaves = allFeatures.filter((f) => f.get('spiderType') === 'leaf');

      const leafAnims = leaves.map((leaf) => ({
        leaf,
        startCoord: leaf.getGeometry().getCoordinates().slice(),
      }));

      animate(
        200,
        (eased) => {
          leafAnims.forEach(({ leaf, startCoord }) => {
            const current = [
              startCoord[0] + (centerCoord[0] - startCoord[0]) * eased,
              startCoord[1] + (centerCoord[1] - startCoord[1]) * eased,
            ];
            leaf.getGeometry().setCoordinates(current);
          });
          allFeatures.forEach((f) => {
            if (f.get('spiderType') !== 'leg') return;
            const ref = f.get('_leafRef');
            if (ref) {
              f.setGeometry(new LineString([centerCoord, ref.getGeometry().getCoordinates()]));
            }
          });
        },
        () => {
          spiderSource.clear();
          clusterLayer.setVisible(true);
          spiderfiedFeatures = [];
          isSpiderfied = false;
        }
      );
    }

    unspiderfyRef.current = unspiderfy;

    const overlay = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      offset: [-190, -200],
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;

    map.on('click', (evt) => {
      if (isSpiderfied) {
        const leafHit = map.forEachFeatureAtPixel(evt.pixel, (f) => f, {
          layerFilter: (l) => l === spiderLayer,
        });
        if (leafHit && leafHit.get('spiderType') === 'leaf') {
          const id = leafHit.get('sensor_id');
          const coord = leafHit.getGeometry().getCoordinates();
          setPopupId(id);
          setChartKey((k) => k + 1);
          overlay.setPosition(coord);
          map.getView().animate({ center: coord, duration: 350 });
          return;
        }
        unspiderfy();
        setPopupId(null);
        overlay.setPosition(undefined);
        return;
      }

      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => {
        const inner = f.get('features');
        return inner && inner.length > 0 ? f : null;
      });
      if (feature) {
        const inner = feature.get('features');
        const first = inner[0];
        const coord = first.getGeometry()?.getCoordinates() || feature.getGeometry().getCoordinates();

        if (inner.length > 1) {
          spiderfy(inner, coord);
        } else {
          setPopupId(first.get('sensor_id'));
          setChartKey((k) => k + 1);
          overlay.setPosition(coord);
          map.getView().animate({ center: coord, duration: 350 });
        }
      } else {
        setPopupId(null);
        overlay.setPosition(undefined);
      }
    });

    map.on('pointermove', (evt) => {
      mapRef.current.style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    buildFeatures(sensors);
  }, [sensors, buildFeatures]);

  return (
    <Section id="mapa" className="MapViewComponent">
      <SectionHeading subtitle="Clique nos sensores para ver detalhes da qualidade do ar em todo o Brasil">
        Mapa de <GradientText>Sensores</GradientText>
      </SectionHeading>

      <div className="max-w-[1400px] mx-auto bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass relative">
        <LoadingOverlay loading={loading} />
        <ErrorBanner error={error} />

        <div ref={mapRef} className="w-full h-[700px] max-md:h-[380px] rounded relative" />

        <MapLegend />

        <div
          ref={popupRef}
          className="absolute bg-card backdrop-blur-xl border border-white/35 p-5 rounded shadow-hover min-w-[300px] max-w-[420px]"
        >
          {popupSensor && <SensorPopup key={chartKey} sensor={popupSensor} onClose={closePopup} />}
        </div>
      </div>
    </Section>
  );
}
