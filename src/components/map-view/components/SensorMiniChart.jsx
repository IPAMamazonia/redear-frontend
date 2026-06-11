import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Mini gráfico de linha exibindo as leituras PMS1 e PMS2 de um sensor.
 *
 * @param {Array} props.readings - Array de leituras do sensor.
 */
export function SensorMiniChart({ readings }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const data = (readings || [])
      .filter((r) => r.datetime)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    if (data.length < 2) return;

    const labels = data.map((r) => {
      const d = new Date(r.datetime);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    });

    const pms1 = data.map((r) => r.pms1_pm2_5_env ?? null);
    const pms2 = data.map((r) => r.pms2_pm2_5_env ?? null);

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'PMS1',
            data: pms1,
            borderColor: '#00E400',
            backgroundColor: 'rgba(0,228,0,0.08)',
            borderWidth: 1.5,
            pointRadius: 1,
            pointHoverRadius: 4,
            tension: 0.3,
            spanGaps: true,
          },
          {
            label: 'PMS2',
            data: pms2,
            borderColor: '#FF7E00',
            backgroundColor: 'rgba(255,126,0,0.08)',
            borderWidth: 1.5,
            pointRadius: 1,
            pointHoverRadius: 4,
            tension: 0.3,
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { font: { size: 10 }, boxWidth: 12, padding: 8 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} µg/m³`,
            },
          },
        },
        scales: {
          x: {
            display: true,
            ticks: { maxTicksLimit: 8, font: { size: 8 }, color: '#999' },
            grid: { display: false },
          },
          y: {
            display: true,
            beginAtZero: true,
            ticks: { font: { size: 9 }, color: '#999' },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [readings]);

  if (!readings || readings.length < 2) {
    return (
      <div className="SensorMiniChartComponent h-[160px] flex items-center justify-center text-xs text-text-light">
        Dados insuficientes para o gráfico
      </div>
    );
  }

  return (
    <div className="SensorMiniChartComponent h-[160px]">
      <canvas ref={canvasRef} />
    </div>
  );
}
