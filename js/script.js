// ===== CONFIGURACOES =====
const AQI_CORES = [
  { max: 40, cor: '#00E400', label: 'Bom', texto: '#000000' },
  { max: 80, cor: '#FFFF00', label: 'Moderado', texto: '#000000' },
  { max: 120, cor: '#FF7E00', label: 'Ruim', texto: '#000000' },
  { max: 200, cor: '#FF0000', label: 'Muito Ruim', texto: '#FFFFFF' },
  { max: 500, cor: '#8B0000', label: 'Péssimo', texto: '#FFFFFF' },
];

function getCorAQI(aqi) {
  for (const c of AQI_CORES) if (aqi <= c.max) return c;
  return AQI_CORES[AQI_CORES.length - 1];
}

function getLabelAQI(aqi) {
  for (const c of AQI_CORES) if (aqi <= c.max) return c.label;
  return AQI_CORES[AQI_CORES.length - 1].label;
}

// ===== DADOS DOS SENSORES =====
const SENSORES = [
  {
    id: 1,
    nome: 'Manaus - Centro',
    cidade: 'Manaus',
    estado: 'AM',
    lat: -3.119,
    lon: -60.0217,
    aqi: 42,
    pm25: 12.5,
    pm10: 28.3,
  },
  {
    id: 2,
    nome: 'Belém - Guamá',
    cidade: 'Belém',
    estado: 'PA',
    lat: -1.4558,
    lon: -48.4902,
    aqi: 58,
    pm25: 18.2,
    pm10: 35.1,
  },
  {
    id: 3,
    nome: 'Porto Velho - Centro',
    cidade: 'Porto Velho',
    estado: 'RO',
    lat: -8.7612,
    lon: -63.9039,
    aqi: 85,
    pm25: 28.7,
    pm10: 52.4,
  },
  {
    id: 4,
    nome: 'Rio Branco - Estação',
    cidade: 'Rio Branco',
    estado: 'AC',
    lat: -9.974,
    lon: -67.8078,
    aqi: 72,
    pm25: 22.3,
    pm10: 44.8,
  },
  {
    id: 5,
    nome: 'Cuiabá - Aeroporto',
    cidade: 'Cuiabá',
    estado: 'MT',
    lat: -15.601,
    lon: -56.0974,
    aqi: 95,
    pm25: 32.1,
    pm10: 58.6,
  },
  {
    id: 6,
    nome: "São Luís - Ponta d'Areia",
    cidade: 'São Luís',
    estado: 'MA',
    lat: -2.5297,
    lon: -44.2528,
    aqi: 48,
    pm25: 14.8,
    pm10: 30.2,
  },
  {
    id: 7,
    nome: 'Palmas - Plano Diretor',
    cidade: 'Palmas',
    estado: 'TO',
    lat: -10.1667,
    lon: -48.3333,
    aqi: 38,
    pm25: 10.5,
    pm10: 22.1,
  },
  {
    id: 8,
    nome: 'Boa Vista - Centro',
    cidade: 'Boa Vista',
    estado: 'RR',
    lat: 2.8197,
    lon: -60.6733,
    aqi: 28,
    pm25: 7.2,
    pm10: 16.5,
  },
  {
    id: 9,
    nome: 'Macapá - Orla',
    cidade: 'Macapá',
    estado: 'AP',
    lat: 0.033,
    lon: -51.05,
    aqi: 32,
    pm25: 8.9,
    pm10: 18.7,
  },
  {
    id: 10,
    nome: 'Santarém - Aldeia',
    cidade: 'Santarém',
    estado: 'PA',
    lat: -2.4431,
    lon: -54.7083,
    aqi: 45,
    pm25: 13.1,
    pm10: 26.9,
  },
  {
    id: 11,
    nome: 'Altamira - Transamazônica',
    cidade: 'Altamira',
    estado: 'PA',
    lat: -3.2033,
    lon: -52.2044,
    aqi: 52,
    pm25: 16.4,
    pm10: 33.7,
  },
  {
    id: 12,
    nome: 'São Gabriel da Cachoeira',
    cidade: 'São Gabriel da Cachoeira',
    estado: 'AM',
    lat: -0.1333,
    lon: -67.0833,
    aqi: 22,
    pm25: 5.8,
    pm10: 12.4,
  },
];

// ===== DADOS PARA FILTRO DO GRÁFICO =====
const ESTADOS = [
  {
    id: 'amazonas',
    nome: 'Amazonas',
    aqiBase: 42,
    municipios: [
      { id: 'manaus', nome: 'Manaus', aqiBase: 42 },
      { id: 'saogabriel', nome: 'São Gabriel da Cachoeira', aqiBase: 22 },
      { id: 'parintins', nome: 'Parintins', aqiBase: 35 },
    ],
  },
  {
    id: 'para',
    nome: 'Pará',
    aqiBase: 55,
    municipios: [
      { id: 'belem', nome: 'Belém', aqiBase: 58 },
      { id: 'santarem', nome: 'Santarém', aqiBase: 45 },
      { id: 'altamira', nome: 'Altamira', aqiBase: 52 },
    ],
  },
  { id: 'matogrosso', nome: 'Mato Grosso', aqiBase: 78, municipios: [{ id: 'cuiaba', nome: 'Cuiabá', aqiBase: 95 }] },
  {
    id: 'rondonia',
    nome: 'Rondônia',
    aqiBase: 85,
    municipios: [{ id: 'portovelho', nome: 'Porto Velho', aqiBase: 85 }],
  },
  { id: 'acre', nome: 'Acre', aqiBase: 68, municipios: [{ id: 'riobranco', nome: 'Rio Branco', aqiBase: 72 }] },
  { id: 'roraima', nome: 'Roraima', aqiBase: 32, municipios: [{ id: 'boavista', nome: 'Boa Vista', aqiBase: 28 }] },
  { id: 'amapa', nome: 'Amapá', aqiBase: 30, municipios: [{ id: 'macapa', nome: 'Macapá', aqiBase: 32 }] },
  { id: 'tocantins', nome: 'Tocantins', aqiBase: 54, municipios: [{ id: 'palmas', nome: 'Palmas', aqiBase: 38 }] },
  { id: 'maranhao', nome: 'Maranhão', aqiBase: 62, municipios: [{ id: 'saoluis', nome: 'São Luís', aqiBase: 48 }] },
];

const TIPOS_TERRITORIO = [
  {
    id: 'terras_indigenas',
    nome: 'Terras Indígenas',
    aqiBase: 24,
    territorios: [
      { id: 'ti_yanomami', nome: 'T.I. Yanomami', aqiBase: 22 },
      { id: 'ti_xingu', nome: 'T.I. Xingu', aqiBase: 28 },
      { id: 'ti_alto_rio_negro', nome: 'T.I. Alto Rio Negro', aqiBase: 20 },
    ],
  },
  {
    id: 'unidades_conservacao',
    nome: 'Unidades de Conservação',
    aqiBase: 30,
    territorios: [
      { id: 'uc_flona_amazonia', nome: 'FLONA da Amazônia', aqiBase: 26 },
      { id: 'uc_parna_chapada', nome: 'P.N. Chapada dos Guimarães', aqiBase: 35 },
      { id: 'uc_resex_chico', nome: 'RESEX Chico Mendes', aqiBase: 30 },
    ],
  },
  {
    id: 'quilombos',
    nome: 'Quilombos',
    aqiBase: 40,
    territorios: [
      { id: 'quilombo_rio_macacos', nome: 'Quilombo Rio dos Macacos', aqiBase: 38 },
      { id: 'quilombo_kalunga', nome: 'Quilombo Kalunga', aqiBase: 42 },
    ],
  },
];

function getAQIBase(id) {
  if (!id) return 55;
  for (const e of ESTADOS) {
    if (e.id === id) return e.aqiBase;
    for (const m of e.municipios) {
      if (m.id === id) return m.aqiBase;
    }
  }
  for (const t of TIPOS_TERRITORIO) {
    if (t.id === id) return t.aqiBase;
    for (const ter of t.territorios) {
      if (ter.id === id) return ter.aqiBase;
    }
  }
  return 55;
}

// ===== GERAR DADOS DO GRÁFICO =====
function gerarDadosHistorico(localId, periodo) {
  const baseAQI = getAQIBase(localId);
  const volatilidade = baseAQI * 0.4;

  let pontos;
  switch (periodo) {
    case '1D':
      pontos = 24;
      break;
    case '5D':
      pontos = 5;
      break;
    case '1M':
      pontos = 30;
      break;
    case '6M':
      pontos = 26;
      break;
    case 'YTD':
      pontos = new Date().getMonth() + 1;
      break;
    case '1A':
      pontos = 12;
      break;
    case '5A':
      pontos = 5;
      break;
    case 'Max':
      pontos = 10;
      break;
    default:
      pontos = 24;
  }

  const labels = [],
    valores = [],
    pm25 = [],
    pm10 = [];
  let current = baseAQI;
  const hoje = new Date();

  for (let i = pontos - 1; i >= 0; i--) {
    current += (Math.random() - 0.47) * volatilidade;
    current = Math.max(10, Math.min(280, current));
    const val = Math.round(current);
    valores.push(val);

    const p25 = Math.round(val * 0.32 * 10) / 10;
    const p10 = Math.round(val * 0.58 * 10) / 10;
    pm25.push(p25);
    pm10.push(p10);

    switch (periodo) {
      case '1D': {
        const d = new Date(hoje);
        d.setHours(hoje.getHours() - i);
        labels.push(d.getHours().toString().padStart(2, '0') + ':00');
        break;
      }
      case '5D': {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i);
        labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }));
        break;
      }
      case '1M': {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i);
        labels.push(d.getDate() + '/' + (d.getMonth() + 1));
        break;
      }
      case '6M': {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i * 7);
        labels.push(d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }));
        break;
      }
      case 'YTD':
      case '1A': {
        const d = new Date(hoje);
        d.setMonth(hoje.getMonth() - i);
        labels.push(d.toLocaleDateString('pt-BR', { month: 'short' }));
        break;
      }
      case '5A': {
        const d = new Date(hoje);
        d.setFullYear(hoje.getFullYear() - i);
        labels.push(d.getFullYear().toString());
        break;
      }
      case 'Max': {
        const d = new Date(hoje);
        d.setFullYear(hoje.getFullYear() - i);
        labels.push(d.getFullYear().toString().slice(-2) + "'");
        break;
      }
      default:
        labels.push(i.toString());
    }
  }

  return { labels, valores, pm25, pm10 };
}

// ===== SLIDER =====
function initSlider() {
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slider-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (!track || slides.length === 0) return;

  let current = 0;
  let interval = setInterval(nextSlide, 10000);

  function goTo(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function nextSlide() {
    goTo((current + 1) % slides.length);
  }
  function prevSlide() {
    goTo((current - 1 + slides.length) % slides.length);
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 10000);
  }

  if (prevBtn)
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });
  if (nextBtn)
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index);
      goTo(idx);
      resetInterval();
    });
  });

  goTo(0);
}

// ===== GRÁFICO PRINCIPAL =====
let mainChart = null;
let periodoAtual = '1A';
let filtroModo = 'estado';
let nivel1Id = null;
let nivel2Id = null;

function getLocalAtual() {
  return nivel2Id || nivel1Id || null;
}

function initChart() {
  const ctx = document.getElementById('aqiChart');
  if (!ctx) return;

  if (typeof ChartZoom !== 'undefined') {
    try {
      Chart.register(ChartZoom);
    } catch (e) {}
  }

  const dados = gerarDadosHistorico(getLocalAtual(), periodoAtual);

  mainChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.labels,
      datasets: [
        {
          label: 'AQI',
          data: dados.valores,
          borderColor: '#2c3e50',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#2c3e50',
          fill: true,
          tension: 0.3,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(44,62,80,0.95)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function (ctx) {
              const idx = ctx.dataIndex;
              const d = gerarDadosHistorico(getLocalAtual(), periodoAtual);
              const cor = getCorAQI(d.valores[idx]);
              return [
                ` AQI: ${d.valores[idx]}  (${getLabelAQI(d.valores[idx])})`,
                ` PM2.5: ${d.pm25[idx]} µg/m³`,
                ` PM10: ${d.pm10[idx]} µg/m³`,
              ];
            },
            labelColor: function (ctx) {
              const d = gerarDadosHistorico(getLocalAtual(), periodoAtual);
              const cor = getCorAQI(d.valores[ctx.dataIndex]);
              return { borderColor: cor.cor, backgroundColor: cor.cor };
            },
          },
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: {
            wheel: { enabled: true, speed: 0.05 },
            drag: { enabled: true, mode: 'x', backgroundColor: 'rgba(255,126,0,0.1)', borderColor: '#FF7E00' },
            mode: 'x',
            onZoomComplete: function () {
              mainChart.update('none');
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10, font: { size: 11 }, color: '#999' },
        },
        y: {
          beginAtZero: true,
          max: 250,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 11 }, color: '#999' },
        },
      },
    },
    plugins: [
      {
        id: 'gradientFill',
        beforeDraw: function (chart) {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(139,0,0,0.25)');
          gradient.addColorStop(0.3, 'rgba(255,0,0,0.2)');
          gradient.addColorStop(0.5, 'rgba(255,126,0,0.15)');
          gradient.addColorStop(0.7, 'rgba(255,255,0,0.1)');
          gradient.addColorStop(1, 'rgba(0,228,0,0.08)');
          chart.data.datasets[0].backgroundColor = gradient;
        },
      },
      {
        id: 'aqiZones',
        beforeDraw: function (chart) {
          const { ctx, chartArea, scales } = chart;
          if (!chartArea || !scales.y) return;
          const zonas = [
            { max: 40, cor: 'rgba(0,228,0,0.05)' },
            { max: 80, cor: 'rgba(255,255,0,0.04)' },
            { max: 120, cor: 'rgba(255,126,0,0.04)' },
            { max: 200, cor: 'rgba(255,0,0,0.04)' },
            { max: 250, cor: 'rgba(139,0,0,0.05)' },
          ];
          let prevY = chartArea.bottom;
          zonas.forEach((z) => {
            const y = scales.y.getPixelForValue(z.max);
            ctx.fillStyle = z.cor;
            ctx.fillRect(chartArea.left, y, chartArea.right - chartArea.left, prevY - y);
            ctx.strokeStyle = z.cor.replace('0.0', '0.15');
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(chartArea.right, y);
            ctx.stroke();
            ctx.setLineDash([]);
            prevY = y;
          });
        },
      },
    ],
  });
}

function updateChart() {
  if (!mainChart) return;
  const dados = gerarDadosHistorico(getLocalAtual(), periodoAtual);
  mainChart.data.labels = dados.labels;
  mainChart.data.datasets[0].data = dados.valores;
  mainChart.resetZoom();
  mainChart.update();
}

function initChartControls() {
  const botoes = document.querySelectorAll('.btn-periodo');
  const nivel1 = document.getElementById('filtroNivel1');
  const nivel2 = document.getElementById('filtroNivel2');
  const tabs = document.querySelectorAll('.filtro-tab');

  botoes.forEach((btn) => {
    btn.addEventListener('click', () => {
      botoes.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      periodoAtual = btn.dataset.periodo;
      updateChart();
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      filtroModo = tab.dataset.modo;
      nivel1Id = null;
      nivel2Id = null;
      populateNivel1();
      resetNivel2();
      updateChart();
    });
  });

  nivel1.addEventListener('change', () => {
    nivel1Id = nivel1.value || null;
    nivel2Id = null;
    if (nivel1Id && hasChildren(nivel1Id)) {
      populateNivel2();
      nivel2.disabled = false;
    } else {
      resetNivel2();
    }
    updateChart();
  });

  nivel2.addEventListener('change', () => {
    nivel2Id = nivel2.value || null;
    updateChart();
  });

  populateNivel1();
}

function hasChildren(id) {
  for (const e of ESTADOS) if (e.id === id && e.municipios.length) return true;
  for (const t of TIPOS_TERRITORIO) if (t.id === id && t.territorios.length) return true;
  return false;
}

function populateNivel1() {
  const sel = document.getElementById('filtroNivel1');
  const val = sel.value;
  sel.innerHTML = '';
  if (filtroModo === 'estado') {
    sel.innerHTML = '<option value="">Selecione um estado</option>';
    ESTADOS.forEach((e) => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = e.nome;
      sel.appendChild(opt);
    });
  } else {
    sel.innerHTML = '<option value="">Selecione um tipo</option>';
    TIPOS_TERRITORIO.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.nome;
      sel.appendChild(opt);
    });
  }
  if (val) sel.value = val;
}

function resetNivel2() {
  const sel = document.getElementById('filtroNivel2');
  nivel2Id = null;
  sel.innerHTML = '<option value="">Selecione primeiro</option>';
  sel.disabled = true;
}

function populateNivel2() {
  const sel = document.getElementById('filtroNivel2');
  sel.innerHTML = '';

  if (filtroModo === 'estado') {
    const estado = ESTADOS.find((e) => e.id === nivel1Id);
    if (!estado || !estado.municipios.length) {
      resetNivel2();
      return;
    }
    sel.innerHTML = '<option value="">Todos os municípios</option>';
    estado.municipios.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.nome;
      sel.appendChild(opt);
    });
  } else {
    const tipo = TIPOS_TERRITORIO.find((t) => t.id === nivel1Id);
    if (!tipo || !tipo.territorios.length) {
      resetNivel2();
      return;
    }
    sel.innerHTML = '<option value="">Todos os territórios</option>';
    tipo.territorios.forEach((ter) => {
      const opt = document.createElement('option');
      opt.value = ter.id;
      opt.textContent = ter.nome;
      sel.appendChild(opt);
    });
  }
}

// ===== MAPA (OpenLayers) =====
function initMap() {
  const target = document.getElementById('map');
  if (!target || typeof ol === 'undefined') return;

  const view = new ol.View({
    center: ol.proj.fromLonLat([-56.0, -5.0]),
    zoom: 4.5,
    minZoom: 3,
    maxZoom: 12,
  });

  const map = new ol.Map({
    target: target,
    layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
    view: view,
  });

  const features = SENSORES.map((s) => {
    const aqiInfo = getCorAQI(s.aqi);
    return new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([s.lon, s.lat])),
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

  const vectorSource = new ol.source.Vector({ features });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: function (feature) {
      const cor = feature.get('cor');
      const texto = feature.get('texto');
      return new ol.style.Style({
        image: new ol.style.Circle({
          radius: 11,
          fill: new ol.style.Fill({ color: cor }),
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 3,
          }),
        }),
        text: new ol.style.Text({
          text: feature.get('aqi').toString(),
          font: '10px sans-serif',
          fill: new ol.style.Fill({ color: texto }),
          offsetY: 1,
        }),
      });
    },
  });

  map.addLayer(vectorLayer);

  // Full screen control
  map.addControl(new ol.control.FullScreen());

  // Popup overlay
  const popupEl = document.getElementById('popup');
  const popupContent = document.getElementById('popup-content');
  const popupCloser = document.getElementById('popup-closer');

  // Move popup inside map element for correct OL v7 positioning
  target.appendChild(popupEl);
  popupEl.style.display = 'none';

  const overlay = new ol.Overlay({
    element: popupEl,
    positioning: 'bottom-center',
    offset: [0, -15],
    autoPan: { animation: { duration: 250 } },
  });
  map.addOverlay(overlay);

  if (popupCloser) {
    popupCloser.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.setPosition(undefined);
      popupEl.style.display = 'none';
      popupCloser.blur();
      destroyMiniChart();
    });
  }

  let miniChart = null;

  function destroyMiniChart() {
    if (miniChart) {
      miniChart.destroy();
      miniChart = null;
    }
    const container = document.getElementById('miniChartContainer');
    if (container) container.style.display = 'none';
  }

  window.showSensorChart = function (sensorId) {
    const container = document.getElementById('miniChartContainer');
    const canvas = document.getElementById('miniChart');
    if (!container || !canvas) return;

    destroyMiniChart();
    container.style.display = 'block';

    const sensor = SENSORES.find((s) => s.id === sensorId);
    if (!sensor) return;

    const ctx = canvas.getContext('2d');
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

    miniChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            data: valores,
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
              label: function (ctx) {
                return `AQI: ${ctx.parsed.y} (${getLabelAQI(ctx.parsed.y)})`;
              },
            },
          },
        },
        scales: {
          x: { display: true, ticks: { maxTicksLimit: 7, font: { size: 9 }, color: '#999' }, grid: { display: false } },
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
  };

  map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (f) {
      return f;
    });
    destroyMiniChart();

    if (feature) {
      const coord = feature.getGeometry().getCoordinates();
      popupContent.innerHTML = `
        <div class="sensor-popup">
          <h3>${feature.get('nome')}</h3>
          <div class="aqi-display">
            <div class="aqi-circle" style="background: ${feature.get('cor')}; color: ${feature.get('texto')}">${feature.get('aqi')}</div>
            <div class="aqi-details">
              <div style="font-weight:700">${feature.get('label')}</div>
              <div>${feature.get('cidade')} - ${feature.get('estado')}</div>
            </div>
          </div>
          <div class="pm-row">
            <span>PM2.5: ${feature.get('pm25')} µg/m³</span>
            <span>PM10: ${feature.get('pm10')} µg/m³</span>
          </div>
          <button class="btn-historico" onclick="showSensorChart(${feature.get('sensor_id')})">
            Ver Histórico (14 dias)
          </button>
          <div id="miniChartContainer" style="display:none;height:140px;">
            <canvas id="miniChart" height="140"></canvas>
          </div>
        </div>
      `;
      popupEl.style.display = 'block';
      overlay.setPosition(coord);
    } else {
      overlay.setPosition(undefined);
      popupEl.style.display = 'none';
    }
  });

  map.on('pointermove', function (evt) {
    const hit = map.hasFeatureAtPixel(evt.pixel);
    target.style.cursor = hit ? 'pointer' : '';
  });

  // Legend
  const legendEl = document.createElement('div');
  legendEl.className = 'map-legend';
  legendEl.innerHTML =
    '<h4>Qualidade do Ar</h4>' +
    AQI_CORES.map(
      (c) => `<div class="legend-item"><span class="legend-color" style="background:${c.cor}"></span>${c.label}</div>`
    ).join('');
  document.getElementById('map-container').appendChild(legendEl);
}

// ===== FAQ =====
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Fechar menu mobile
      const nav = document.querySelector('.nav-links');
      if (nav) nav.classList.remove('open');
    });
  });
}

// ===== NAVBAR MOBILE =====
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
  // Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
}

// ===== FORMULÁRIO =====
function initForm() {
  const form = document.getElementById('contatoForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nome = document.getElementById('formNome').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const msg = document.getElementById('formMsg').value.trim();
    if (!nome || !email || !msg) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    form.reset();
  });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function () {
  initSlider();
  initChart();
  initChartControls();
  initMap();
  initFAQ();
  initSmoothScroll();
  initNavbar();
  initScrollAnimations();
  initForm();
});
