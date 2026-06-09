import { fromLonLat } from 'ol/proj';

export const CENTRO = fromLonLat([-55.0, -15.0]);
export const VIEW_CONFIG = { center: CENTRO, zoom: 4.5, minZoom: 3, maxZoom: 12 };
