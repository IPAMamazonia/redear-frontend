import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import { createAnimator } from './animation.js';

const SPIDERFY_DURATION = 300;
const UNSPIDERFY_DURATION = 200;
const SPIDER_PIXEL_RADIUS_BASE = 10;
const SPIDER_PIXEL_RADIUS_PER_FEATURE = 5;
const SPIDER_PIXEL_RADIUS_MIN = 50;

/**
 * Cria o controlador de spiderfy de um cluster.
 *
 * Encapsula as folhas, as pernas, o estado de animação e a visibilidade da
 * camada de cluster. O chamador continua responsável por decidir quando
 * abrir/fechar o spiderfy em reação aos eventos do mapa.
 *
 * @param {Object} dependencies
 * @param {import('ol/Map').default} dependencies.map - Instância do mapa.
 * @param {import('ol/layer/Vector').default} dependencies.clusterLayer - Camada de clusters.
 * @param {import('ol/source/Vector').default} dependencies.spiderSource - Fonte das folhas do spiderfy.
 * @returns {MapSpiderfyController} Controlador de spiderfy.
 */
export function createSpiderfyController({ map, clusterLayer, spiderSource }) {
  const { animate, cancel } = createAnimator();

  /** @type {import('ol/Feature').default[]} */
  let spiderfiedFeatures = [];
  let isSpiderfied = false;

  function clearSpiderfiedFeatures() {
    spiderSource.clear();
    spiderfiedFeatures = [];
    isSpiderfied = false;
  }

  /**
   * Expande um conjunto de features ao redor de uma coordenada central.
   *
   * @param {import('ol/Feature').default[]} features - Features agrupadas.
   * @param {MapCoordinate} centerCoord - Coordenada central do cluster.
   */
  function spiderfy(features, centerCoord) {
    cancel();

    if (spiderfiedFeatures.length > 0) {
      clearSpiderfiedFeatures();
    }

    // Oculta a camada de cluster para deixar apenas as folhas visíveis.
    clusterLayer.setVisible(false);

    const { PI, abs, max } = Math;
    const num = features.length;
    const pixelRadius = max(
      SPIDER_PIXEL_RADIUS_BASE + SPIDER_PIXEL_RADIUS_PER_FEATURE * num,
      SPIDER_PIXEL_RADIUS_MIN
    );
    const centerPixel = map.getPixelFromCoordinate(centerCoord);
    const rightCoord = map.getCoordinateFromPixel([centerPixel[0] + pixelRadius, centerPixel[1]]);
    const meterRadius = abs(rightCoord[0] - centerCoord[0]);

    const isSmallCluster = num <= 3;
    const spreadAngle = isSmallCluster ? (2 * PI) / 3 : (2 * PI) / num;
    const startAngle = isSmallCluster ? (5 * PI) / 6 : num % 2 === 0 ? PI : PI - spreadAngle / 2;

    /** @type {{ leg: import('ol/Feature').default, leaf: import('ol/Feature').default, targetCoord: MapCoordinate }[]} */
    const items = [];

    features.forEach((feature, index) => {
      const angle = startAngle - spreadAngle * (num - 1) * index;
      const targetCoord = /** @type {MapCoordinate} */ ([
        centerCoord[0] + meterRadius * Math.cos(angle),
        centerCoord[1] + meterRadius * Math.sin(angle),
      ]);

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
      SPIDERFY_DURATION,
      (eased) => {
        items.forEach(({ leg, leaf, targetCoord }) => {
          const current = /** @type {MapCoordinate} */ ([
            centerCoord[0] + (targetCoord[0] - centerCoord[0]) * eased,
            centerCoord[1] + (targetCoord[1] - centerCoord[1]) * eased,
          ]);
          leaf.getGeometry().setCoordinates(current);
          leg.setGeometry(new LineString([centerCoord, current]));
        });
      },
      () => {}
    );
  }

  /**
   * Recolhe as folhas de volta ao centro do cluster.
   */
  function unspiderfy() {
    if (!isSpiderfied) return;
    cancel();

    const centerCoord = spiderfiedFeatures[0].getGeometry().getCoordinates();
    const allFeatures = spiderSource.getFeatures();
    const leaves = allFeatures.filter((feature) => feature.get('spiderType') === 'leaf');

    const leafAnims = leaves.map((leaf) => ({
      leaf,
      startCoord: leaf.getGeometry().getCoordinates().slice(),
    }));

    animate(
      UNSPIDERFY_DURATION,
      (eased) => {
        leafAnims.forEach(({ leaf, startCoord }) => {
          const current = [
            startCoord[0] + (centerCoord[0] - startCoord[0]) * eased,
            startCoord[1] + (centerCoord[1] - startCoord[1]) * eased,
          ];
          leaf.getGeometry().setCoordinates(current);
        });

        allFeatures.forEach((feature) => {
          if (feature.get('spiderType') !== 'leg') return;
          const leafRef = feature.get('_leafRef');
          if (leafRef) {
            feature.setGeometry(new LineString([centerCoord, leafRef.getGeometry().getCoordinates()]));
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

  /**
   * Cancela animações pendentes (útil ao desmontar o componente).
   */
  function destroy() {
    cancel();
  }

  return {
    spiderfy,
    unspiderfy,
    destroy,
    get isSpiderfied() {
      return isSpiderfied;
    },
  };
}
