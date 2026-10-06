/**
 * Constantes das faixas de qualidade.
 *
 * Apenas dados e decisões — nenhuma função. A forma canônica das faixas
 * (normalização, classificação, interpolação) vive em `@/helpers/faixas` e
 * `@/helpers/get-band`.
 */

/** Cor usada quando não há dado ou quando o sensor está offline. */
export const COR_SEM_DADOS = '#9e9e9e';

/** Estilo de valor ausente (sem leitura). */
export const SEM_DADOS = { color: COR_SEM_DADOS, textColor: '#ffffff', label: 'Sem dados', labelKey: 'bands.noData' };

/** Estilo de sensor sem conexão. */
export const OFFLINE = { color: COR_SEM_DADOS, textColor: '#ffffff', label: 'Offline', labelKey: 'bands.offline' };

/**
 * Limite superior do eixo Y reservado para as faixas, por variável.
 *
 * Só é definido para variáveis em que a escala completa das faixas é curta o
 * bastante para caber sem espremer a série. Pressão (990–1025 hPa) e contagem
 * de partículas (até 6000 p/0.1L) ficam de fora: forçar o eixo até o topo da
 * última faixa transformaria o gráfico numa linha reta colada na borda.
 * Variável ausente ou `null` significa "desenhar sem reservar topo".
 */
export const FAIXAS_Y_MAX = {
  aqi: 500,
  pm25: 50,
  pm1: 25,
  pm10: 100,
  temperature: 42,
  humidity: 100,
};
