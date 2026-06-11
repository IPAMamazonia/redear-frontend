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
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Point } from 'ol/geom';
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

  function closePopup() {
    setPopupId(null);
    overlayRef.current?.setPosition(undefined);
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
    map.addLayer(new VectorLayer({ source: vectorSource, style: styleSensor }));
    vectorSourceRef.current = vectorSource;

    const overlay = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      offset: [-100, -200],
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;

    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const id = feature.get('sensor_id');
        const coord = feature.getGeometry().getCoordinates();
        setPopupId(id);
        setChartKey((k) => k + 1);
        overlay.setPosition(coord);
        map.getView().animate({ center: coord, duration: 350 });
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
          className="absolute bg-card backdrop-blur-xl border border-white/35 p-5 rounded shadow-hover min-w-[260px] max-w-[340px]"
        >
          {popupSensor && <SensorPopup key={chartKey} sensor={popupSensor} onClose={closePopup} />}
        </div>
      </div>
    </Section>
  );
}
