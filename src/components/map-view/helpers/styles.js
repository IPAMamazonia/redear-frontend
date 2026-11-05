import { Circle as CircleStyle, Fill, Stroke, Style, Text, RegularShape } from 'ol/style';
import { COR_SEM_DADOS } from '@/rules/faixas';
import { formatNumberString } from '@/helpers/format.js';

const FONT_FAMILY = 'Arial';
const MIN_FONT_SIZE = 7;
const DEFAULT_SPIDER_STROKE_WIDTH = 1.5;
const UNTRUSTWORTHY_STROKE_WIDTH = 3;

const CLUSTER_RADIUS_BASE = 12;
const CLUSTER_RADIUS_BASE_ONLINE = 17;
const CLUSTER_RADIUS_PER_FEATURE = 1.5;
const CLUSTER_RADIUS_MAX = 28;
const CLUSTER_TEXT_FONT = 'bold 12px Arial';
const CLUSTER_TEXT_COLOR = '#000';

/**
 * Ajusta o tamanho da fonte ao diâmetro disponível para o texto.
 *
 * @param {string|number|null|undefined} text - Texto exibido no marcador.
 * @param {number} maxFontSize - Tamanho máximo permitido.
 * @param {number} diameter - Diâmetro disponível para o texto.
 * @returns {number} Tamanho de fonte entre 7 e `maxFontSize`.
 */
export function fitFontSize(text, maxFontSize, diameter) {
  const len = text == null ? 1 : String(text).length;
  const fitted = Math.floor((diameter * 0.82) / (len * 0.58));
  return Math.max(Math.min(fitted, maxFontSize), MIN_FONT_SIZE);
}

/**
 * Cria o estilo de um marcador de sensor.
 *
 * @param {Object} options
 * @param {string} options.color - Cor de fundo do marcador.
 * @param {string} options.textColor - Cor do texto.
 * @param {number|null} options.value - Valor exibido no marcador.
 * @param {boolean} options.online - Se o sensor está online.
 * @param {boolean} options.isPurpleAir - Se o marcador deve ser um losango.
 * @param {boolean} [options.isTrustworthy] - Se o sensor é confiável.
 * @param {number} [options.strokeWidth] - Largura da borda do marcador.
 * @param {number} [options.fontSize] - Tamanho máximo da fonte.
 * @param {number} [options.zIndex] - z-index do estilo.
 * @param {number} options.radius - Raio do marcador.
 * @returns {import('ol/style/Style').default} Estilo do marcador.
 */
export function createSensorStyle({
  color,
  textColor,
  value,
  online,
  isPurpleAir,
  isTrustworthy,
  strokeWidth,
  fontSize,
  zIndex,
  radius,
}) {
  const text = online ? (formatNumberString(value, 1) ?? '') : '-';
  const strokeColor = isTrustworthy === false ? 'black' : 'white';
  const appliedStrokeWidth = isTrustworthy === false ? UNTRUSTWORTHY_STROKE_WIDTH : strokeWidth;

  const image = isPurpleAir
    ? new RegularShape({
        radius,
        points: 4,
        angle: Math.PI / 4,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: strokeColor, width: appliedStrokeWidth }),
      })
    : new CircleStyle({
        radius,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: strokeColor, width: appliedStrokeWidth }),
        declutterMode: 'none',
      });

  return new Style({
    ...(zIndex != null ? { zIndex } : {}),
    image,
    text: new Text({
      text,
      fill: new Fill({ color: textColor }),
      font: `bold ${fitFontSize(text, fontSize, radius * 2)}px ${FONT_FAMILY}`,
      overflow: false,
      declutterMode: 'none',
    }),
  });
}

/**
 * Cria a função de estilo das folhas e pernas do spiderfy.
 *
 * @param {number} radius - Raio dos marcadores das folhas.
 * @returns {MapStyleFunction} Função de estilo.
 */
export function createSpiderStyle(radius) {
  return function styleSpider(feature) {
    const type = feature.get('spiderType');

    if (type === 'leg') {
      return new Style({
        stroke: new Stroke({ color: 'rgba(0,0,0,0.5)', width: DEFAULT_SPIDER_STROKE_WIDTH, lineDash: [4, 4] }),
      });
    }

    return createSensorStyle({
      radius,
      color: feature.get('color'),
      textColor: feature.get('textColor'),
      value: feature.get('value'),
      online: feature.get('isOnline'),
      isTrustworthy: feature.get('isTrustworthy'),
      isPurpleAir: feature.get('source') === 'purpleAir',
      strokeWidth: DEFAULT_SPIDER_STROKE_WIDTH,
      fontSize: 10,
    });
  };
}

/**
 * Cria a função de estilo dos clusters de sensores.
 *
 * @param {number} radius - Raio usado quando o cluster contém um único sensor.
 * @returns {MapStyleFunction} Função de estilo.
 */
export function createClusterPointStyle(radius) {
  return function styleClusterPoint(feature) {
    const features = feature.get('features');
    const size = features.length;

    if (size === 1) {
      const singleFeature = features[0];

      return createSensorStyle({
        radius,
        color: singleFeature.get('color'),
        textColor: singleFeature.get('textColor'),
        value: singleFeature.get('value'),
        online: singleFeature.get('isOnline'),
        isTrustworthy: singleFeature.get('isTrustworthy'),
        isPurpleAir: singleFeature.get('source') === 'purpleAir',
        strokeWidth: DEFAULT_SPIDER_STROKE_WIDTH,
        fontSize: 12,
        zIndex: singleFeature.get('isOnline') ? 2 : 1,
      });
    }

    const onlineFeatures = features.filter((f) => f.get('isOnline'));

    if (onlineFeatures.length === 0) {
      return new Style({
        image: new CircleStyle({
          radius: Math.min(CLUSTER_RADIUS_BASE + size * CLUSTER_RADIUS_PER_FEATURE, CLUSTER_RADIUS_MAX),
          fill: new Fill({ color: COR_SEM_DADOS }),
          stroke: new Stroke({ color: 'white', width: DEFAULT_SPIDER_STROKE_WIDTH }),
        }),
        text: new Text({
          text: `${size}`,
          fill: new Fill({ color: CLUSTER_TEXT_COLOR }),
          font: CLUSTER_TEXT_FONT,
        }),
      });
    }

    const trustworthyOnlineFeatures = onlineFeatures.filter((f) => f.get('isTrustworthy') !== false);

    const evaluatedFeatures = trustworthyOnlineFeatures.length > 0 ? trustworthyOnlineFeatures : onlineFeatures;

    const worst = evaluatedFeatures.reduce(
      (currentWorst, f) => {
        const val = f.get('value');
        if (val == null) return currentWorst;
        if (currentWorst.feature == null || val > currentWorst.value) {
          return { value: val, feature: f };
        }
        return currentWorst;
      },
      { value: 0, feature: null }
    );
    const color = worst.feature?.get('color') || COR_SEM_DADOS;

    return new Style({
      image: new CircleStyle({
        radius: Math.min(CLUSTER_RADIUS_BASE_ONLINE + size * CLUSTER_RADIUS_PER_FEATURE, CLUSTER_RADIUS_MAX),
        fill: new Fill({ color }),
        stroke: new Stroke({ color: 'white', width: DEFAULT_SPIDER_STROKE_WIDTH }),
      }),
      text: new Text({
        text: `${size}`,
        fill: new Fill({ color: CLUSTER_TEXT_COLOR }),
        font: CLUSTER_TEXT_FONT,
        textDecoration: 'underline',
      }),
    });
  };
}
