import {
  buildLocationOptions,
  buildSensorOptions,
  createInitialSelection,
  hasExportSelection,
  prepareExportRequest,
  resolveSelectedSensors,
} from './utils/build-export-payload';
import { fetchSensors, selectSensors, selectSensorsError, selectSensorsLoading } from '@/store/slices/sensorsSlice';
import { ExportFeedback, ExportFilters, ExportHelp, ExportProgress, ExportSummary } from './components';
import { GlassCard, GradientText, Section, SectionHeading } from '@/components';
import { defaultDateRange, todayInSaoPaulo } from './utils/date-range';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useExportReadings } from './hooks/useExportReadings';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/i18n';

/**
 * Seção de exportação das leituras dos sensores em CSV.
 *
 * Consome `POST /v1/sensor-readings/export`. No modo por sensores o body leva
 * os IDs; nos modos por localidade leva apenas o geocode de município/estado.
 */
export function ReadingsExport() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const sensors = useSelector(selectSensors);
  const sensorsLoading = useSelector(selectSensorsLoading);
  const sensorsError = useSelector(selectSensorsError);

  const {
    status,
    error: exportError,
    result,
    downloadedBytes,
    elapsedMs,
    exportNow,
    cancel,
    reset,
    retry,
    downloadAgain,
  } = useExportReadings();

  const [range, setRange] = useState(defaultDateRange);
  const [selecao, setSelecao] = useState(createInitialSelection);
  const [precision, setPrecision] = useState(2);
  const [formError, setFormError] = useState(null);

  const today = useMemo(() => todayInSaoPaulo(), []);
  const exporting = status === 'exporting';

  useEffect(() => {
    if (!sensors.length) dispatch(fetchSensors());
  }, [dispatch, sensors.length]);

  const sensorOptions = useMemo(() => buildSensorOptions(sensors), [sensors]);
  const locationOptions = useMemo(
    () => ({
      municipio: buildLocationOptions(sensors, 'municipio'),
      estado: buildLocationOptions(sensors, 'estado'),
    }),
    [sensors]
  );

  const selectedSensors = useMemo(() => resolveSelectedSensors(sensors, selecao), [sensors, selecao]);
  const redeArCount = selectedSensors.filter((sensor) => sensor.source === 'RedeAr').length;
  const purpleAirCount = selectedSensors.filter((sensor) => sensor.source === 'purpleAir').length;

  const handleSelectionChange = useCallback(
    (nextSelection) => {
      if (exporting) return;
      setFormError(null);
      reset();
      setSelecao(nextSelection);
    },
    [exporting, reset]
  );

  const handleRangeChange = useCallback(
    (nextRange) => {
      if (exporting) return;
      setFormError(null);
      reset();
      setRange(nextRange);
    },
    [exporting, reset]
  );

  const handlePrecisionChange = useCallback(
    (nextPrecision) => {
      if (exporting) return;
      setFormError(null);
      reset();
      setPrecision(nextPrecision);
    },
    [exporting, reset]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (exporting) return;

    const prepared = prepareExportRequest({
      sensors,
      selecao,
      startDate: range.startDate,
      endDate: range.endDate,
      precision,
      today,
    });

    if (prepared.errors.length > 0) {
      setFormError(prepared.errors[0]);
      return;
    }

    setFormError(null);
    exportNow(prepared.payload);
  };

  const hasSelection = hasExportSelection(selecao);

  return (
    <Section id="dados" alt className="ReadingsExportComponent">
      <SectionHeading subtitle={t('exportData.subtitle')}>
        <GradientText>{t('exportData.title1')}</GradientText> {t('exportData.title2')}
      </SectionHeading>

      <div className="max-w-[1280px] mx-auto">
        <GlassCard className="p-6 max-md:p-4">
          {sensorsError && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center gap-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <i className="fas fa-triangle-exclamation" />
              <span className="flex-1">{t(sensorsError)}</span>
              <button
                type="button"
                onClick={() => dispatch(fetchSensors())}
                className="cursor-pointer rounded-[10px] border border-red-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-white transition-colors"
              >
                <i className="fas fa-rotate-right mr-1" />
                {t('common.retry')}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} aria-busy={exporting}>
            <ExportFilters
              selecao={selecao}
              onSelectionChange={handleSelectionChange}
              range={range}
              onRangeChange={handleRangeChange}
              precision={precision}
              onPrecisionChange={handlePrecisionChange}
              sensorOptions={sensorOptions}
              locationOptions={locationOptions}
              today={today}
              disabled={exporting || sensorsLoading}
            />

            <ExportSummary
              redeArCount={redeArCount}
              purpleAirCount={purpleAirCount}
              startDate={range.startDate}
              endDate={range.endDate}
              precision={precision}
            />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={exporting || sensorsLoading}
                className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#FF6D00] px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-[#FF7F33] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <i className={`fas ${exporting ? 'fa-spinner fa-spin' : 'fa-download'}`} />
                {exporting ? t('exportData.downloadingButton') : t('exportData.download')}
              </button>
              {!hasSelection && !formError && (
                <span className="text-xs text-text-light">{t('exportData.emptySelection')}</span>
              )}
            </div>
          </form>

          {exporting && <ExportProgress downloadedBytes={downloadedBytes} elapsedMs={elapsedMs} onCancel={cancel} />}

          {!exporting && (
            <ExportFeedback
              formError={formError}
              error={exportError}
              result={result}
              onRetry={retry}
              onDownloadAgain={downloadAgain}
            />
          )}

          <ExportHelp />
        </GlassCard>
      </div>
    </Section>
  );
}
