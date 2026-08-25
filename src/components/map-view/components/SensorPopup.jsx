import { getVariableByKey, getSensorValue } from '@/rules/variables';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { SensorMiniChart } from './SensorMiniChart';

export function SensorPopup({ sensor, onClose }) {
  const [showChart, setShowChart] = useState(false);
  const selectedVariableKey = useSelector((state) => state.ui.selectedVariable);

  const variable = getVariableByKey(selectedVariableKey);
  const value = getSensorValue(sensor, variable);
  const online = sensor.is_online ?? false;
  const faixa = online ? variable.getColor(value) : { color: '#9e9e9e', textColor: '#ffffff', label: 'Offline' };

  return (
    <div className="SensorPopupComponent relative">
      <a
        href="#"
        className="absolute top-0 right-0 no-underline text-lg text-text-light leading-none hover:text-text-dark"
        onClick={(e) => {
          e.preventDefault();
          onClose?.();
        }}
      >
        &times;
      </a>
      <h3 className="text-base mb-2 pr-5 text-text-dark">{sensor.name}</h3>
      <span className="text-[10px] uppercase tracking-wider text-text-light mb-2 block">
        {sensor.source === 'purpleAir' ? 'PurpleAir' : 'RedeAr'}
      </span>

      <div className="flex items-center gap-3 mb-2">
        {value != null && online ? (
          <>
            <div
              className="w-[80px] h-[50px] rounded-[8px] flex items-center justify-center text-lg font-extrabold shrink-0 overflow-clip"
              style={{ background: faixa.color, color: faixa.textColor }}
            >
              {value}
            </div>
            <div className="text-sm text-text-light">
              <div className="font-bold">{faixa.label}</div>
              <div>{variable.label}: {value} {variable.unit}</div>
            </div>
          </>
        ) : (
          <div className="text-sm text-text-light">{online ? 'Aguardando dados' : 'Sensor offline'}</div>
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

      {sensor.is_trustworthy === false && (
        <div className="flex items-start gap-2 mb-2 p-2 rounded-sm bg-amber-50 text-amber-700 text-xs border border-amber-200">
          <span className="text-sm shrink-0 mt-px">⚠</span>
          <span> Leituras divergentes entre os sensores, os dados podem não ser confiáveis. </span>
        </div>
      )}

      {online && value != null && (
        <button
          className="px-4 py-[0.4rem] bg-text-dark text-white border-none rounded-md cursor-pointer text-sm font-semibold transition-opacity duration-[0.35s] hover:opacity-85"
          onClick={() => setShowChart((v) => !v)}
        >
          {showChart ? 'Ocultar gráfico' : 'Ver Histórico (gráfico)'}
        </button>
      )}

      {showChart && (
        <div className="mt-3 pt-3 border-t border-black/10">
          <SensorMiniChart readings={sensor.readings} variable={variable} />
        </div>
      )}
    </div>
  );
}
