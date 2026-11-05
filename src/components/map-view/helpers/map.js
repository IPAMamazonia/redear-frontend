import { defaults as defaultControls, FullScreen } from 'ol/control';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Cluster from 'ol/source/Cluster';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import Map from 'ol/Map';
import 'ol/ol.css';

import { CLUSTER_DISTANCE, POPUP_OVERLAY_OFFSET, SPIDER_LAYER_Z_INDEX, VIEW_CONFIG } from '../rules';
import { createClusterPointStyle, createSpiderStyle } from './styles.js';

/**
 * Cria o mapa, as camadas de cluster/spiderfy e o overlay do popup.
 *
 * @param {Object} options
 * @param {HTMLElement} options.target - Elemento onde o mapa será renderizado.
 * @param {HTMLElement} options.fullscreenTarget - Elemento alvo do controle de tela cheia.
 * @param {HTMLElement} options.popupElement - Elemento do popup.
 * @param {number} options.nodeRadius - Raio inicial dos marcadores.
 * @returns {MapInstance} Instâncias criadas.
 */
export function createMapInstance({ target, fullscreenTarget, popupElement, nodeRadius }) {
  const map = new Map({
    target,
    controls: defaultControls().extend([new FullScreen({ source: fullscreenTarget })]),
    layers: [new TileLayer({ source: new OSM() })],
    view: new View(VIEW_CONFIG),
  });

  const vectorSource = new VectorSource();
  const clusterSource = new Cluster({
    source: vectorSource,
    distance: CLUSTER_DISTANCE,
  });

  const clusterLayer = new VectorLayer({
    style: createClusterPointStyle(nodeRadius),
    source: clusterSource,
    declutter: true,
  });
  map.addLayer(clusterLayer);

  const spiderSource = new VectorSource();
  const spiderLayer = new VectorLayer({
    source: spiderSource,
    style: createSpiderStyle(nodeRadius),
    zIndex: SPIDER_LAYER_Z_INDEX,
  });
  map.addLayer(spiderLayer);

  const overlay = new Overlay({
    element: popupElement,
    positioning: 'bottom-center',
    offset: POPUP_OVERLAY_OFFSET,
  });
  map.addOverlay(overlay);

  /**
   * Atualiza o raio dos marcadores nas duas camadas.
   *
   * @param {number} radius - Novo raio em pixels.
   */
  function setNodeRadius(radius) {
    clusterLayer.setStyle(createClusterPointStyle(radius));
    spiderLayer.setStyle(createSpiderStyle(radius));
  }

  return {
    map,
    vectorSource,
    clusterSource,
    clusterLayer,
    spiderSource,
    spiderLayer,
    overlay,
    setNodeRadius,
  };
}
