/**
 * Tipos compartilhados (apenas JSDoc) entre o `MapView` e seus helpers.
 *
 * Este arquivo não tem código em tempo de execução e **não é um módulo** (sem
 * `import`/`export`): assim os `@typedef` ficam globais e podem ser usados
 * diretamente como `MapSensor`, `MapVariable`, etc. em qualquer arquivo do
 * projeto. Os nomes têm o prefixo `Map` para não colidirem com tipos nativos
 * do DOM (por exemplo, `Sensor`).
 */

/**
 * Faixa de qualidade retornada por `variable.getColor`.
 *
 * @typedef {Object} MapBand
 * @property {string} color - Cor de fundo do marcador.
 * @property {string} textColor - Cor do texto do marcador.
 * @property {string} label - Rótulo em pt-BR.
 * @property {string} labelKey - Chave i18n do rótulo.
 */

/**
 * Leitura bruta de um sensor (campos variam conforme a fonte).
 *
 * @typedef {Record<string, number|string|null|undefined>} MapSensorReading
 */

/**
 * Sensor normalizado pelo `sensorsSlice`.
 *
 * @typedef {Object} MapSensor
 * @property {string|number} id
 * @property {string} source
 * @property {string} name
 * @property {{ coordinates: [number, number] }|null} gps
 * @property {MapSensorReading[]} readings
 * @property {boolean} is_online
 * @property {boolean} is_trustworthy
 * @property {string|null} latest_reading
 * @property {string|null} oldest_reading
 */

/**
 * Variável de mapa criada por `buildVariable`.
 *
 * @typedef {Object} MapVariable
 * @property {string} key
 * @property {string} label
 * @property {string} labelKey
 * @property {string} unit
 * @property {(reading: MapSensorReading) => number|null} extract
 * @property {MapBand[]} faixas
 * @property {number|null} faixasYMax
 * @property {(value: number|null) => MapBand} getColor
 */

/**
 * Propriedades armazenadas em cada `Feature` de sensor.
 *
 * @typedef {Object} MapSensorFeatureProperties
 * @property {string|number} sensor_id
 * @property {string} source
 * @property {string} nome
 * @property {boolean} isOnline
 * @property {boolean} isTrustworthy
 * @property {number|null} value
 * @property {string|null} latestReading
 * @property {string|null} oldestReading
 * @property {string} color
 * @property {string} textColor
 * @property {string} label
 */

/**
 * Coordenada projetada do OpenLayers (`[x, y]`).
 *
 * @typedef {[number, number]} MapCoordinate
 */

/**
 * Função de estilo aceita por uma `VectorLayer` do OpenLayers.
 *
 * @typedef {(feature: import('ol/Feature').default) => import('ol/style/Style').default} MapStyleFunction
 */

/**
 * Recursos criados por `createMapInstance`.
 *
 * @typedef {Object} MapInstance
 * @property {import('ol/Map').default} map
 * @property {import('ol/source/Vector').default} vectorSource
 * @property {import('ol/source/Cluster').default} clusterSource
 * @property {import('ol/layer/Vector').default} clusterLayer
 * @property {import('ol/source/Vector').default} spiderSource
 * @property {import('ol/layer/Vector').default} spiderLayer
 * @property {import('ol/Overlay').default} overlay
 * @property {(radius: number) => void} setNodeRadius
 */

/**
 * Controlador de animação baseado em `requestAnimationFrame`.
 *
 * @typedef {Object} MapAnimator
 * @property {(duration: number, onFrame: (eased: number) => void, onDone?: () => void) => void} animate
 * @property {() => void} cancel
 */

/**
 * Controlador dos estados de spiderfy de um cluster.
 *
 * @typedef {Object} MapSpiderfyController
 * @property {(features: import('ol/Feature').default[], center: MapCoordinate) => void} spiderfy
 * @property {() => void} unspiderfy
 * @property {() => void} destroy
 * @property {boolean} isSpiderfied
 */
