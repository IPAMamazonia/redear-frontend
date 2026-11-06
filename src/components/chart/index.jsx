import { ChartFilters, ChartState, DateRangeInput, FaixasLegend, PeriodSelector, SensorChips } from './components';
import { selectReadings, selectReadingsLoading, selectReadingsError } from '@/store/slices/readingsSlice';
import { VariableSelector } from '@/components/map-view/components/VariableSelector';
import { GlassCard, GradientText, Section, SectionHeading } from '@/components';
import { useChartInstance } from './hooks/useChartInstance';
import { useChartReadings } from './hooks/useChartReadings';
import { selectSensors } from '@/store/slices/sensorsSlice';
import { useChartData } from './hooks/useChartData';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { SELECAO_INICIAL } from './utils';
import { useTranslation } from '@/i18n';

/**
 * Gráfico AQI com seleção de período e filtro por sensores, município ou estado.
 * Integra com o endpoint real de leituras (GET /v1/sensor-readings).
 */
export function AQIChart() {
  const { t, language } = useTranslation();
  const sensors = useSelector(selectSensors);
  const readings = useSelector(selectReadings);
  const readingsLoading = useSelector(selectReadingsLoading);
  const readingsError = useSelector(selectReadingsError);

  const selectedVariableKey = useSelector((state) => state.ui.selectedVariable);

  const [periodo, setPeriodo] = useState('1D');
  const [modoPeriodo, setModoPeriodo] = useState('preset'); // 'preset' | 'manual'
  const [intervaloManual, setIntervaloManual] = useState(null);
  const [selecao, setSelecao] = useState(SELECAO_INICIAL);

  const {
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
  } = useChartData({
    sensors,
    readings,
    selecao,
    periodo,
    modoPeriodo,
    intervaloManual,
    selectedVariableKey,
  });

  const { retry } = useChartReadings({ sensors, hasOptionSelection, filtro, intervalo });

  const mostrarGrafico = hasOptionSelection && !readingsLoading && !readingsError && series.datasets.length > 0;

  const { canvasRef, resetZoom } = useChartInstance({
    visible: mostrarGrafico,
    series,
    variable,
    spanMs,
    totalPontos,
    dadosContinuos,
    faixasVisiveis,
    language,
  });

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

  const handlePeriodoChange = useCallback((novoPeriodo) => {
    setPeriodo(novoPeriodo);
    setModoPeriodo('preset');
    setIntervaloManual(null);
  }, []);

  return (
    <Section id="grafico" alt className="AQIChartComponent">
      <SectionHeading subtitle={t('chart.subtitle')}>
        <GradientText>{t('chart.title1')}</GradientText> {t('chart.title2')}
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
              {t('chart.manualDates')}
            </button>
          )}
        </div>
        <ChartFilters selecao={selecao} onChange={setSelecao} />
      </div>

      <div className="max-w-[1280px] mx-auto mb-4 flex justify-end items-center gap-3">
        {mostrarGrafico && (
          <button
            type="button"
            onClick={resetZoom}
            className="cursor-pointer px-3 py-1.5 rounded-[10px] bg-white/60 backdrop-blur border border-white/50 text-xs font-semibold text-text-light hover:text-[#FF6D00] transition-all"
            title={t('chart.resetZoom')}
          >
            <i className="fas fa-crosshairs mr-1" />
            {t('chart.recenter')}
          </button>
        )}
        <VariableSelector openDown />
      </div>

      <SensorChips sensors={sensoresSelecionados} onRemove={removerSensor} />

      {mostrarGrafico && faixasVisiveis && <FaixasLegend faixas={faixasVisiveis} unit={variable.unit} />}

      <div className="max-w-[1280px] mx-auto">
        <GlassCard className="p-6">
          <ChartState
            hasSelection={hasOptionSelection}
            loading={readingsLoading}
            error={readingsError}
            empty={series.datasets.length === 0}
            onRetry={retry}
          />

          {mostrarGrafico && (
            <div className="h-[420px]">
              <canvas ref={canvasRef} id="aqiChart"></canvas>
            </div>
          )}

          {mostrarGrafico && (
            <p className="text-center mt-3 text-sm text-text-light">
              <i className="fas fa-info-circle"></i> {t('chart.zoomHint')}
            </p>
          )}
        </GlassCard>
      </div>
    </Section>
  );
}
