// Componentes locais
import { criarConfigChart } from './utils/chartConfig';
import { montarFiltro, montarLocalId, resolverIds, SELECAO_INICIAL } from './utils/selection';
import { montarSeries } from './utils/series';
import { periodoParaIntervalo } from './utils/intervalo';

// Componentes globais
import { GlassCard, GradientText, Section, SectionHeading } from '@/components';
import { VariableSelector } from '@/components/map-view/components/VariableSelector';

// Componentes do chart
import { ChartFilters, DateRangeInput, PeriodSelector, SensorChips } from './components';

// Redux
import { fetchSensors, selectSensors } from '@/store/slices/sensorsSlice';
import { fetchReadings, selectReadings, selectReadingsLoading, selectReadingsError } from '@/store/slices/readingsSlice';
import { getVariableByKey } from '@/helpers/get-variable-by-key';

// React
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChartZoom from 'chartjs-plugin-zoom';
import { Decimation } from 'chart.js';
import Chart from 'chart.js/auto';

Chart.register(ChartZoom, Decimation);

/**
 * Gráfico AQI com seleção de período e filtro por sensores, município ou estado.
 * Integra com o endpoint real de leituras (GET /v1/sensor-readings).
 */
export function AQIChart() {
  const dispatch = useDispatch();
  const sensors = useSelector(selectSensors);
  const readings = useSelector(selectReadings);
  const readingsLoading = useSelector(selectReadingsLoading);
  const readingsError = useSelector(selectReadingsError);

  const selectedVariableKey = useSelector((state) => state.ui.selectedVariable);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const fetchSigRef = useRef(0);

  const [periodo, setPeriodo] = useState('1D');
  const [modoPeriodo, setModoPeriodo] = useState('preset'); // 'preset' | 'manual'
  const [intervaloManual, setIntervaloManual] = useState(null);
  const [selecao, setSelecao] = useState(SELECAO_INICIAL);

  const sensorMap = useMemo(() => new Map(sensors.map((s) => [s.id, s])), [sensors]);

  const ids = useMemo(() => resolverIds(sensors, selecao), [sensors, selecao]);
  const hasOptionSelection = ids.length > 0;
  useMemo(() => (hasOptionSelection ? montarLocalId(selecao) : null), [hasOptionSelection, selecao]);

  const sensoresSelecionados = useMemo(
    () => (selecao.modo === 'sensores' ? selecao.sensores.map((id) => sensorMap.get(id)).filter(Boolean) : []),
    [selecao, sensorMap]
  );

  const variable = useMemo(() => getVariableByKey(selectedVariableKey) ?? getVariableByKey('aqi'), [selectedVariableKey]);

  const intervalo = useMemo(() => {
    if (modoPeriodo === 'manual') return intervaloManual;

    return periodoParaIntervalo(periodo);
  }, [modoPeriodo, periodo, intervaloManual]);

  const filtro = useMemo(() => montarFiltro(sensors, selecao), [sensors, selecao]);

  useEffect(() => {
    if (!sensors.length) dispatch(fetchSensors());
  }, [dispatch, sensors.length]);

  useEffect(() => {
    if (!hasOptionSelection || !filtro || !intervalo) return;

    const sig = ++fetchSigRef.current;
    dispatch(fetchReadings({ _sig: sig, ...filtro, ...intervalo }));
  }, [dispatch, hasOptionSelection, filtro, intervalo]);

  const spanMs = useMemo(() => {
    if (!intervalo?.startDate || !intervalo?.endDate) return 0;
    return new Date(intervalo.endDate).getTime() - new Date(intervalo.startDate).getTime();
  }, [intervalo]);

  const series = useMemo(
    () => montarSeries(readings, sensors, variable),
    [readings, sensors, variable]
  );

  const totalPontos = useMemo(
    () => series.datasets.reduce((n, d) => n + d.data.length, 0),
    [series]
  );

  const dadosContinuos = useMemo(
    () => series.datasets.every((d) => d.data.every((p) => Number.isFinite(p.y))),
    [series]
  );

  const criarChart = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(
      ctx,
      criarConfigChart({
        datasets: series.datasets,
        yMax: series.yMax,
        unit: variable.unit,
        mostrarZonas: variable.key === 'aqi',
        spanMs,
        totalPontos,
        dadosContinuos,
      })
    );
  }, [series, variable, spanMs, totalPontos, dadosContinuos]);

  useEffect(() => {
    if (!hasOptionSelection) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    criarChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [criarChart, hasOptionSelection]);

  const removerSensor = useCallback((id) => {
    setSelecao((prev) => ({
      ...prev,
      sensores: prev.sensores.filter((x) => x !== id),
    }));
  }, []);

  const entrarModoManual = useCallback(() => {
    setModoPeriodo('manual');
  }, []);

  const voltarPreset = useCallback(() => {
    setModoPeriodo('preset');
    setIntervaloManual(null);
  }, []);

  const handlePeriodoChange = useCallback(
    (p) => {
      setPeriodo(p);
      setModoPeriodo('preset');
      setIntervaloManual(null);
    },
    []
  );

  const handleRetry = useCallback(() => {
    if (!hasOptionSelection || !filtro || !intervalo) return;
    const sig = ++fetchSigRef.current;
    dispatch(fetchReadings({ _sig: sig, ...filtro, ...intervalo }));
  }, [dispatch, hasOptionSelection, filtro, intervalo]);

  const mostrarGrafico = hasOptionSelection && !readingsLoading && !readingsError && series.datasets.length > 0;
  const mostrarVazio = hasOptionSelection && !readingsLoading && !readingsError && series.datasets.length === 0;
  const mostrarLoading = hasOptionSelection && readingsLoading;
  const mostrarErro = hasOptionSelection && !readingsLoading && readingsError;

  return (
    <Section id="grafico" alt className="AQIChartComponent">
      <SectionHeading subtitle="Acompanhe a evolução dos índices com filtros de período e localização">
        <GradientText>Qualidade do Ar</GradientText> ao Longo do Tempo
      </SectionHeading>

      <div className="flex flex-wrap gap-4 max-w-[1280px] mx-auto mb-2 justify-between items-center max-md:flex-col max-md:items-stretch">
        <div className="flex flex-wrap items-center gap-3">
          {modoPeriodo === 'preset' ? (
            <PeriodSelector value={periodo} onChange={handlePeriodoChange} />
          ) : (
            <DateRangeInput onChange={setIntervaloManual} onReset={voltarPreset} />
          )}
          {modoPeriodo === 'preset' && (
            <button
              type="button"
              onClick={entrarModoManual}
              className="cursor-pointer border-none bg-transparent text-sm font-semibold text-[#FF6D00] hover:underline"
            >
              <i className="fas fa-calendar-alt mr-1" />
              Datas manuais
            </button>
          )}
        </div>
        <ChartFilters selecao={selecao} onChange={setSelecao} />
      </div>

      <div className="max-w-[1280px] mx-auto mb-4 flex justify-end items-center gap-3">
        {mostrarGrafico && (
          <button
            type="button"
            onClick={() => chartRef.current?.resetZoom()}
            className="cursor-pointer px-3 py-1.5 rounded-[10px] bg-white/60 backdrop-blur border border-white/50 text-xs font-semibold text-text-light hover:text-[#FF6D00] transition-all"
            title="Voltar ao zoom padrão"
          >
            <i className="fas fa-crosshairs mr-1" />
            Recentralizar
          </button>
        )}
        <VariableSelector openDown />
      </div>

      <SensorChips sensors={sensoresSelecionados} onRemove={removerSensor} />

      <div className="max-w-[1280px] mx-auto">
        <GlassCard className="p-6">
          {!hasOptionSelection && (
            <div className="h-[420px] flex flex-col items-center justify-center gap-3 text-center px-4">
              <i className="fas fa-chart-line text-4xl text-text-light/40" />
              <p className="text-text-light max-w-md">
                Selecione <strong>sensores</strong>, um <strong>município</strong> ou um <strong>estado</strong> acima
                para visualizar a série do AQI.
              </p>
            </div>
          )}

          {mostrarLoading && (
            <div className="h-[420px] flex flex-col items-center justify-center gap-3 text-center px-4">
              <i className="fas fa-spinner fa-spin text-3xl text-[#FF6D00]" />
              <p className="text-text-light">Carregando leituras...</p>
            </div>
          )}

          {mostrarErro && (
            <div className="h-[420px] flex flex-col items-center justify-center gap-3 text-center px-4">
              <i className="fas fa-exclamation-triangle text-3xl text-red-600" />
              <p className="text-text-light max-w-md">{readingsError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="cursor-pointer px-4 py-2 rounded-[10px] bg-[#FF6D00] text-white font-semibold shadow hover:bg-[#FF7F33] transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {mostrarVazio && (
            <div className="h-[420px] flex flex-col items-center justify-center gap-3 text-center px-4">
              <i className="fas fa-inbox text-3xl text-text-light/40" />
              <p className="text-text-light max-w-md">
                Nenhuma leitura encontrada no período selecionado para os filtros aplicados.
              </p>
            </div>
          )}

          {mostrarGrafico && (
            <div className="h-[420px]">
              <canvas ref={canvasRef} id="aqiChart"></canvas>
            </div>
          )}

          {mostrarGrafico && (
            <p className="text-center mt-3 text-sm text-text-light">
              <i className="fas fa-info-circle"></i> Arraste para zoom, role para ampliar. Passe o mouse sobre os
              pontos para detalhes.
            </p>
          )}
        </GlassCard>
      </div>
    </Section>
  );
}