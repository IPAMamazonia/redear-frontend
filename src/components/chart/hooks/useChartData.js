import { useMemo } from 'react';

import { getVariableByKey } from '@/helpers/get-variable-by-key';
import {
  faixasVisiveis as calcularFaixasVisiveis,
  montarFiltro,
  montarSeries,
  periodoParaIntervalo,
  resolverIds,
} from '../utils';

/**
 * Deriva os dados do gráfico a partir dos filtros e do período selecionados.
 *
 * @param {object} params
 * @param {Array<object>} params.sensors - Sensores carregados no redux.
 * @param {Array<object>} params.readings - Leituras carregadas no redux.
 * @param {object} params.selecao - Seleção de sensores/município/estado.
 * @param {string} params.periodo - Período pré-definido ativo.
 * @param {'preset'|'manual'} params.modoPeriodo - Modo de escolha do período.
 * @param {{ startDate: string, endDate: string }|null} params.intervaloManual - Intervalo manual válido.
 * @param {string} params.selectedVariableKey - Chave da variável selecionada no redux.
 */
export function useChartData({
  sensors,
  readings,
  selecao,
  periodo,
  modoPeriodo,
  intervaloManual,
  selectedVariableKey,
}) {
  const sensorMap = useMemo(() => new Map(sensors.map((s) => [s.id, s])), [sensors]);

  const ids = useMemo(() => resolverIds(sensors, selecao), [sensors, selecao]);
  const hasOptionSelection = ids.length > 0;

  const sensoresSelecionados = useMemo(
    () => (selecao.modo === 'sensores' ? selecao.sensores.map((id) => sensorMap.get(id)).filter(Boolean) : []),
    [selecao, sensorMap],
  );

  const variable = useMemo(
    () => getVariableByKey(selectedVariableKey) ?? getVariableByKey('aqi'),
    [selectedVariableKey],
  );

  const intervalo = useMemo(() => {
    if (modoPeriodo === 'manual') return intervaloManual;

    return periodoParaIntervalo(periodo);
  }, [modoPeriodo, periodo, intervaloManual]);

  const filtro = useMemo(() => montarFiltro(sensors, selecao), [sensors, selecao]);

  const spanMs = useMemo(() => {
    if (!intervalo?.startDate || !intervalo?.endDate) return 0;
    return new Date(intervalo.endDate).getTime() - new Date(intervalo.startDate).getTime();
  }, [intervalo]);

  const series = useMemo(() => montarSeries(readings, sensors, variable), [readings, sensors, variable]);

  const totalPontos = useMemo(() => series.datasets.reduce((n, d) => n + d.data.length, 0), [series]);

  const dadosContinuos = useMemo(
    () => series.datasets.every((d) => d.data.every((p) => Number.isFinite(p.y))),
    [series],
  );

  // Só variáveis com topo de escala reservado desenham faixas: em pressão e contagem de partículas a escala completa achataria a série na borda do eixo.
  // As faixas são ainda cortadas pelo yMax real, para que o gráfico não anuncie uma faixa que ficou sem altura.
  const faixasVisiveis = useMemo(
    () => calcularFaixasVisiveis(variable.faixas, series.yMax, variable.faixasYMax),
    [variable, series.yMax],
  );

  return {
    ids,
    hasOptionSelection,
    sensoresSelecionados,
    variable,
    intervalo,
    filtro,
    spanMs,
    series,
    totalPontos,
    dadosContinuos,
    faixasVisiveis,
  };
}
