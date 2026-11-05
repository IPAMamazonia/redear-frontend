import { fromLonLat } from 'ol/proj';

export const CENTRO = fromLonLat([-55.0, -15.0]);
export const VIEW_CONFIG = { center: CENTRO, zoom: 4.5, minZoom: 3, maxZoom: 12 };

/** Distância (em pixels) usada para agrupar sensores no cluster. */
export const CLUSTER_DISTANCE = 50;

/** Raio do marcador quando o cluster está ativo. */
export const NODE_RADIUS = 18;

/** Raio do marcador quando o cluster está desativado. */
export const NODE_RADIUS_CLUSTER_OFF = 18;

/** z-index da camada temporária usada durante o spiderfy. */
export const SPIDER_LAYER_Z_INDEX = 100;

/** Offset do popup em relação à coordenada do sensor. */
export const POPUP_OVERLAY_OFFSET = [-190, -200];
