import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style';
import Chart from 'chart.js/auto';
import { SENSORES, AQI_CORES } from '@/mocks/sensors';
import { getCorAQI, getLabelAQI } from '@/helpers/format';

function gerarMiniChartData(sensor) {
  const dias = 14;
  const labels = [];
  const valores = [];
  let current = sensor.aqi;

  for (let i = dias - 1; i >= 0; i--) {
    current += (Math.random() - 0.48) * 15;
    current = Math.max(10, Math.min(250, current));
    valores.push(Math.round(current));
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
  }

  return { labels, valores };
}

export function MapView() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const popupRef = useRef(null);
  const popupContentRef = useRef(null);
  const overlayRef = useRef(null);
  const miniChartRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const view = new View({
      center: fromLonLat([-56.0, -5.0]),
      zoom: 4.5,
      minZoom: 3,
      maxZoom: 12,
    });

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls().extend([new FullScreen()]),
      layers: [new TileLayer({ source: new OSM() })],
      view,
    });

    const features = SENSORES.map((s) => {
      const aqiInfo = getCorAQI(s.aqi);
      return new Feature({
        geometry: new Point(fromLonLat([s.lon, s.lat])),
        sensor_id: s.id,
        nome: s.nome,
        cidade: s.cidade,
        estado: s.estado,
        aqi: s.aqi,
        pm25: s.pm25,
        pm10: s.pm10,
        cor: aqiInfo.cor,
        texto: aqiInfo.texto,
        label: aqiInfo.label,
      });
    });

    const vectorSource = new VectorSource({ features });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const cor = feature.get('cor');
        const texto = feature.get('texto');
        return new Style({
          image: new CircleStyle({
            radius: 11,
            fill: new Fill({ color: cor }),
            stroke: new Stroke({ color: 'white', width: 3 }),
          }),
          text: new Text({
            text: feature.get('aqi').toString(),
            font: '10px sans-serif',
            fill: new Fill({ color: texto }),
            offsetY: 1,
          }),
        });
      },
    });

    map.addLayer(vectorLayer);

    const popupEl = popupRef.current;
    const popupContent = popupContentRef.current;

    const overlay = new Overlay({
      element: popupEl,
      positioning: 'bottom-center',
      offset: [0, -15],
      autoPan: { animation: { duration: 250 } },
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;

    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      destroyMiniChart();

      if (feature) {
        const coord = feature.getGeometry().getCoordinates();
        const cor = feature.get('cor');
        const texto = feature.get('texto');

        popupContent.innerHTML = `
          <div class="sensor-popup">
            <h3 class="text-base mb-2 pr-5">${feature.get('nome')}</h3>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0" style="background:${cor};color:${texto}">${feature.get('aqi')}</div>
              <div class="text-sm text-[#5a6d7a]">
                <div style="font-weight:700">${feature.get('label')}</div>
                <div>${feature.get('cidade')} - ${feature.get('estado')}</div>
              </div>
            </div>
            <div class="flex gap-4 text-sm text-[#5a6d7a] mb-3">
              <span>PM2.5: ${feature.get('pm25')} µg/m³</span>
              <span>PM10: ${feature.get('pm10')} µg/m³</span>
            </div>
            <button class="px-4 py-[0.4rem] bg-[#1a2e3c] text-white border-none rounded-md cursor-pointer text-sm font-semibold transition-opacity duration-[0.35s] hover:opacity-85" data-sensor-id="${feature.get('sensor_id')}">
              Ver Histórico (14 dias)
            </button>
            <div id="miniChartContainer" class="mt-3 pt-3 border-t border-black/10" style="display:none;height:140px;">
              <canvas id="miniChart" height="140"></canvas>
            </div>
          </div>
        `;

        popupEl.style.display = 'block';
        overlay.setPosition(coord);

        const btn = popupContent.querySelector('[data-sensor-id]');
        if (btn) {
          btn.addEventListener('click', () => {
            const sensor = SENSORES.find((s) => s.id === feature.get('sensor_id'));
            if (sensor) showMiniChart(sensor);
          });
        }
      } else {
        overlay.setPosition(undefined);
        popupEl.style.display = 'none';
      }
    });

    map.on('pointermove', (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      mapRef.current.style.cursor = hit ? 'pointer' : '';
    });

    const legend = document.createElement('div');
    legend.className =
      'absolute bottom-5 right-5 z-10 bg-[rgba(255,255,255,0.75)] backdrop-blur-xl p-4 rounded-[10px] border border-[rgba(255,255,255,0.35)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] text-sm max-md:hidden';
    legend.innerHTML =
      '<h4 class="mb-2 text-sm">Qualidade do Ar</h4>' +
      AQI_CORES.map(
        (c) =>
          `<div class="flex items-center gap-2 mb-1"><span class="w-[14px] h-[14px] rounded-full shrink-0" style="background:${c.cor}"></span>${c.label}</div>`
      ).join('');
    mapRef.current.parentElement.appendChild(legend);

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function destroyMiniChart() {
    if (miniChartRef.current) {
      miniChartRef.current.destroy();
      miniChartRef.current = null;
    }
    const container = document.getElementById('miniChartContainer');
    if (container) container.style.display = 'none';
  }

  function showMiniChart(sensor) {
    const container = document.getElementById('miniChartContainer');
    const canvas = document.getElementById('miniChart');
    if (!container || !canvas) return;

    destroyMiniChart();
    container.style.display = 'block';

    const ctx = canvas.getContext('2d');
    const data = gerarMiniChartData(sensor);

    miniChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.valores,
            borderColor: '#2c3e50',
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: true,
            backgroundColor: 'rgba(0,228,0,0.1)',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `AQI: ${ctx.parsed.y} (${getLabelAQI(ctx.parsed.y)})`,
            },
          },
        },
        scales: {
          x: {
            display: true,
            ticks: { maxTicksLimit: 7, font: { size: 9 }, color: '#999' },
            grid: { display: false },
          },
          y: {
            display: true,
            beginAtZero: true,
            max: 250,
            ticks: { font: { size: 9 }, color: '#999' },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
        },
      },
    });
  }

  return (
    <section id="mapa" className="MapViewComponent px-[5%] py-[100px] max-[480px]:py-[60px] max-[480px]:px-[4%]">
      <h2 className="text-center text-[2.2rem] max-md:text-[1.8rem] max-[480px]:text-[1.5rem] font-extrabold mb-[0.6rem] text-[#1a2e3c] tracking-tight">
        Mapa de{' '}
        <span className="bg-gradient-to-r from-[#00E676] to-[#FF6D00] bg-clip-text text-transparent">Sensores</span>
      </h2>
      <p className="text-center text-[#5a6d7a] mb-[3.5rem] text-lg max-w-[600px] mx-auto">
        Clique nos sensores para ver detalhes da qualidade do ar em todo o Brasil
      </p>

      <div className="max-w-[1400px] mx-auto bg-[rgba(255,255,255,0.75)] backdrop-blur-xl border border-[rgba(255,255,255,0.35)] rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative">
        <div ref={mapRef} className="w-full h-[700px] max-md:h-[380px] rounded-[16px] relative" />
        <div
          ref={popupRef}
          className="absolute bg-[rgba(255,255,255,0.75)] backdrop-blur-xl border border-[rgba(255,255,255,0.35)] p-5 rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.14)] min-w-[260px] max-w-[340px]"
          style={{ display: 'none' }}
        >
          <a
            href="#"
            className="absolute top-2 right-3 no-underline text-lg text-[#5a6d7a] leading-none hover:text-[#1a2e3c]"
            onClick={(e) => {
              e.preventDefault();
              if (overlayRef.current) {
                overlayRef.current.setPosition(undefined);
              }
              if (popupRef.current) popupRef.current.style.display = 'none';
              destroyMiniChart();
              if (popupRef.current) popupRef.current.blur();
            }}
          >
            &times;
          </a>
          <div ref={popupContentRef}></div>
        </div>
      </div>
    </section>
  );
}
