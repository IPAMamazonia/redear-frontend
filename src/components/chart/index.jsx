//Componentes locais, globais e úteis
import { montarLocalId, resolverIds, SELECAO_INICIAL, criarConfigChart } from './utils';
import { GlassCard, GradientText, Section, SectionHeading } from '@/components';
import { PeriodSelector, SensorChips, ChartFilters } from './components';

// Redux
import { fetchSensors, selectSensors } from '@/store/slices/sensorsSlice';

// React
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChartZoom from 'chartjs-plugin-zoom';
import Chart from 'chart.js/auto';

Chart.register(ChartZoom);

/**
 * Gráfico AQI com seleção de período e filtro por sensores, município ou estado.
 */
export function AQIChart() {
  const dispatch = useDispatch();
  const sensors = useSelector(selectSensors);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [periodo, setPeriodo] = useState('1A');
  const [selecao, setSelecao] = useState(SELECAO_INICIAL);

  const sensorMap = useMemo(() => new Map(sensors.map((s) => [s.id, s])), [sensors]);

  const ids = useMemo(() => resolverIds(sensors, selecao), [sensors, selecao]);
  const hasOptionSelection = ids.length > 0;
  const localId = useMemo(() => (hasOptionSelection ? montarLocalId(selecao) : null), [hasOptionSelection, selecao]);
  const sensoresSelecionados = useMemo(
    () => (selecao.modo === 'sensores' ? selecao.sensores.map((id) => sensorMap.get(id)).filter(Boolean) : []),
    [selecao, sensorMap]
  );

  // Effects and Callbacks
  useEffect(() => {
    if (!sensors.length) dispatch(fetchSensors());
  }, [dispatch, sensors.length]);

  const criarChart = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, criarConfigChart(localId, periodo));
  }, [localId, periodo]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
    if (!hasOptionSelection) return;
    criarChart();

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [criarChart, hasOptionSelection]);

  const removerSensor = useCallback((id) => {
    setSelecao((prev) => ({
      ...prev,
      sensores: prev.sensores.filter((x) => x !== id),
    }));
  }, []);

  return (
    <Section id="grafico" alt className="AQIChartComponent">
      <SectionHeading subtitle="Acompanhe a evolução dos índices com filtros de período e localização">
        <GradientText>Qualidade do Ar</GradientText> ao Longo do Tempo
      </SectionHeading>

      <div className="flex flex-wrap gap-4 max-w-[1280px] mx-auto mb-8 justify-between items-center max-md:flex-col max-md:items-stretch">
        <PeriodSelector value={periodo} onChange={setPeriodo} />
        <ChartFilters selecao={selecao} onChange={setSelecao} />
      </div>

      <SensorChips sensors={sensoresSelecionados} onRemove={removerSensor} />

      <div className="max-w-[1280px] mx-auto">
        <GlassCard className="p-6">
          {hasOptionSelection ? (
            <div className="h-[420px]">
              <canvas ref={canvasRef} id="aqiChart"></canvas>
            </div>
          ) : (
            <div className="h-[420px] flex flex-col items-center justify-center gap-3 text-center px-4">
              <i className="fas fa-chart-line text-4xl text-text-light/40" />
              <p className="text-text-light max-w-md">
                Selecione <strong>sensores</strong>, um <strong>município</strong> ou um <strong>estado</strong> acima
                para visualizar a série do AQI.
              </p>
            </div>
          )}
          <p className="text-center mt-3 text-sm text-text-light">
            <i className="fas fa-info-circle"></i> Arraste para zoom, role para ampliar. Passe o mouse sobre os pontos
            para detalhes.
          </p>
        </GlassCard>
      </div>
    </Section>
  );
}
