import {
  ClusterToggleButton,
  ErrorBanner,
  LegendContainer,
  LoadingOverlay,
  MapLegend,
  RecenterButton,
  SensorPopup,
  SensorTypeLegend,
  VariableSelector,
} from './components';
import { fetchSensors, selectSensors, selectSensorsError, selectSensorsLoading } from '@/store/slices/sensorsSlice';
import { createMapInstance, createSensorFeatures, createSpiderfyController } from './helpers';
import { CLUSTER_DISTANCE, NODE_RADIUS, NODE_RADIUS_CLUSTER_OFF } from './rules';
import { GradientText, Section, SectionHeading } from '@/components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVariableByKey } from '@/helpers';
import { useTranslation } from '@/i18n';

/**
 * Mapa interativo com sensores, popup de detalhes e controles de zoom/recenter.
 */
export function MapView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const sensors = useSelector(selectSensors);
  const loading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);
  const selectedVariableKey = useSelector((state) => state.ui.selectedVariable);

  const mapRef = useRef(null);
  const wrapperRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vectorSourceRef = useRef(null);
  const popupRef = useRef(null);
  const overlayRef = useRef(null);

  const [popupId, setPopupId] = useState(null);
  const [chartKey, setChartKey] = useState(0);
  const [clusterEnabled, setClusterEnabled] = useState(true);
  const clusterSourceRef = useRef(null);
  const setNodeRadiusRef = useRef(null);

  const popupSensor = popupId ? sensors.find((s) => s.id === popupId) : null;

  const unspiderfyRef = useRef(() => {});

  function closePopup() {
    setPopupId(null);
    overlayRef.current?.setPosition(undefined);
    unspiderfyRef.current();
  }

  /**
   * Reconstrói as features do mapa a partir da lista de sensores.
   *
   * @param {MapSensor[]} sensorsList - Sensores normalizados.
   */
  const buildFeatures = useCallback(
    (sensorsList) => {
      if (!vectorSourceRef.current) return;

      vectorSourceRef.current.clear();

      const variable = getVariableByKey(selectedVariableKey);
      vectorSourceRef.current.addFeatures(createSensorFeatures(sensorsList, variable));
    },
    [selectedVariableKey]
  );

  useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const { map, vectorSource, clusterSource, clusterLayer, spiderSource, spiderLayer, overlay, setNodeRadius } =
      createMapInstance({
        target: mapRef.current,
        fullscreenTarget: wrapperRef.current,
        popupElement: popupRef.current,
        nodeRadius: NODE_RADIUS,
      });

    clusterSourceRef.current = clusterSource;
    vectorSourceRef.current = vectorSource;
    overlayRef.current = overlay;
    setNodeRadiusRef.current = setNodeRadius;

    const spiderfyController = createSpiderfyController({ map, clusterLayer, spiderSource });
    unspiderfyRef.current = spiderfyController.unspiderfy;

    map.on('click', (evt) => {
      if (spiderfyController.isSpiderfied) {
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

        spiderfyController.unspiderfy();
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
          spiderfyController.spiderfy(inner, coord);
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

    map.getView().on('change:resolution', () => {
      if (spiderfyController.isSpiderfied) {
        spiderfyController.unspiderfy();
        setPopupId(null);
        overlay.setPosition(undefined);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      spiderfyController.destroy();
      map.setTarget(undefined);
      mapInstanceRef.current = null;
      clusterSourceRef.current = null;
      vectorSourceRef.current = null;
      overlayRef.current = null;
      setNodeRadiusRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (clusterSourceRef.current) {
      clusterSourceRef.current.setDistance(clusterEnabled ? CLUSTER_DISTANCE : 0);
    }

    setNodeRadiusRef.current?.(clusterEnabled ? NODE_RADIUS : NODE_RADIUS_CLUSTER_OFF);

    buildFeatures(sensors);
  }, [clusterEnabled, buildFeatures, sensors]);

  return (
    <Section id="mapa" className="MapViewComponent">
      <SectionHeading subtitle={t('map.subtitle')}>
        {t('map.title1')} <GradientText>{t('map.title2')}</GradientText>
      </SectionHeading>

      <div
        ref={wrapperRef}
        className="map-fullscreen-target max-w-[1400px] mx-auto bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass relative"
      >
        <LoadingOverlay loading={loading} />
        <ErrorBanner error={error} />

        <div ref={mapRef} className="map-fullscreen-canvas w-full h-[700px] max-md:h-[380px] rounded relative" />

        <MapLegend />
        <LegendContainer>
          <RecenterButton mapRef={mapInstanceRef} />
          <ClusterToggleButton enabled={clusterEnabled} onToggle={setClusterEnabled} />
          <SensorTypeLegend />
          <VariableSelector />
        </LegendContainer>

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
