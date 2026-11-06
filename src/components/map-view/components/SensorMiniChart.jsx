import { useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTranslation } from '@/i18n';
import { buildMiniChartConfig } from '../helpers/sensor-mini-chart';

export function SensorMiniChart({ readings, variable }) {
  const { t, language } = useTranslation();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const config = useMemo(
    () => buildMiniChartConfig(readings, variable, t, language),
    [readings, variable, t, language],
  );

  useEffect(() => {
    if (!canvasRef.current || !config) return undefined;

    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (!chartRef.current) return;
      chartRef.current.destroy();
      chartRef.current = null;
    };
  }, [config]);

  if (!config) {
    return (
      <div className="SensorMiniChartComponent h-[240px] flex items-center justify-center text-xs text-text-light">
        {t('common.noDataShort')}
      </div>
    );
  }

  return (
    <div className="SensorMiniChartComponent h-[240px]">
      <canvas ref={canvasRef} />
    </div>
  );
}
