import { useState } from 'react';
import { getPM25Color } from '@/rules/qualidadeAr';
import { SensorMiniChart } from './SensorMiniChart';

/**
 * Popup de detalhes do sensor com indicador PM2.5, datas e gráfico opcional.
 *
 * @param {object}   props.sensor  - Dados do sensor selecionado.
 * @param {function} props.onClose - Callback para fechar o popup.
 */
export function SensorPopup({ sensor, onClose }) {
  const [showChart, setShowChart] = useState(false);

  const pm25 = sensor.readings?.[0]?.pms1_pm2_5_env
    ?? sensor.readings?.[0]?.pms2_pm2_5_env
    ?? null;
  const online = sensor.is_online ?? false;
  const faixa = online ? getPM25Color(pm25) : { color: '#9e9e9e', textColor: '#ffffff', label: 'Offline' };

  return (
    <div className="SensorPopupComponent relative">
      <a
        href="#"
        className="absolute top-0 right-0 no-underline text-lg text-text-light leading-none hover:text-text-dark"
        onClick={(e) => { e.preventDefault(); onClose?.(); }}
      >
        &times;
      </a>
      <h3 className="text-base mb-2 pr-5 text-text-dark">{sensor.name}</h3>
      <span className="text-[10px] uppercase tracking-wider text-text-light mb-2 block">
        {sensor.source === 'purpleAir' ? 'PurpleAir' : 'RedeAr'}
      </span>

      <div className="flex items-center gap-3 mb-2">
        {pm25 != null && online ? (
          <>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-extrabold shrink-0"
              style={{ background: faixa.color, color: faixa.textColor }}
            >
              {pm25}
            </div>
            <div className="text-sm text-text-light">
              <div className="font-bold">{faixa.label}</div>
              <div>PM2.5: {pm25} µg/m³</div>
            </div>
          </>
        ) : (
          <div className="text-sm text-text-light">
            {online ? 'Aguardando dados' : 'Sensor offline'}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 text-xs text-text-light mb-3">
        {sensor.latest_reading && (
          <span>Última leitura: {new Date(sensor.latest_reading).toLocaleString('pt-BR')}</span>
        )}
        {sensor.oldest_reading && sensor.oldest_reading !== sensor.latest_reading && (
          <span>Primeira leitura: {new Date(sensor.oldest_reading).toLocaleString('pt-BR')}</span>
        )}
      </div>

      {online && pm25 != null && (
        <button
          className="px-4 py-[0.4rem] bg-text-dark text-white border-none rounded-md cursor-pointer text-sm font-semibold transition-opacity duration-[0.35s] hover:opacity-85"
          onClick={() => setShowChart((v) => !v)}
        >
          {showChart ? 'Ocultar gráfico' : 'Ver Histórico (gráfico)'}
        </button>
      )}

      {showChart && (
        <div className="mt-3 pt-3 border-t border-black/10">
          <SensorMiniChart readings={sensor.readings} />
        </div>
      )}
    </div>
  );
}
