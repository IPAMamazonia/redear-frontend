import { getVariableByKey, getSensorValue } from '@/helpers';
import { OFFLINE } from '@/rules/faixas';
import { SensorMiniChart } from './SensorMiniChart';
import { useTranslation, getLocale } from '@/i18n';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export function SensorPopup({ sensor, onClose }) {
  const { t, language } = useTranslation();
  const [showChart, setShowChart] = useState(false);
  const selectedVariableKey = useSelector((state) => state.ui.selectedVariable);

  const variable = getVariableByKey(selectedVariableKey);
  const value = getSensorValue(sensor, variable);
  const online = sensor.is_online ?? false;
  const faixa = online ? variable.getColor(value) : OFFLINE;

  return (
    <div className="SensorPopupComponent relative flex flex-col gap-[10px]">
      <a
        href="#"
        className="absolute top-0 right-0 no-underline text-3xl text-text-light leading-none hover:text-text-dark"
        onClick={(e) => {
          e.preventDefault();
          onClose?.();
        }}
      >
        &times;
      </a>

      <span
        title={t('map.dataSource')}
        className="w-max px-[10px] py-[5px] rounded-[8px] text-2xl font-bold tracking-wider text-text-light border-[2px] border-text-light bg-[#ffffff95]"
      >
        {sensor.source === 'purpleAir' ? 'PurpleAir' : 'RedeAr'}
      </span>

      <h3 className="text-base pr-5 text-text-dark">{sensor.name}</h3>

      <div className="flex items-center gap-3">
        {value != null && online ? (
          <>
            <div
              className="w-[80px] h-[50px] rounded-[8px] flex items-center justify-center text-lg font-extrabold shrink-0 overflow-clip"
              style={{ background: faixa.color, color: faixa.textColor }}
            >
              {value}
            </div>
            <div className="text-sm text-text-light">
              <div className="font-bold">{t(faixa.labelKey)}</div>
              <div>
                {t(variable.labelKey)}: {value} {variable.unit}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-text-light">
            {online ? t('map.awaitingData') : t('map.sensorOffline')}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 text-xs text-text-light">
        {sensor.latest_reading && (
          <span>
            {t('map.latestReading')}: {new Date(sensor.latest_reading).toLocaleString(getLocale(language))}
          </span>
        )}
        {sensor.oldest_reading && sensor.oldest_reading !== sensor.latest_reading && (
          <span>
            {t('map.firstReading')}: {new Date(sensor.oldest_reading).toLocaleString(getLocale(language))}
          </span>
        )}
      </div>

      {sensor.is_trustworthy === false && (
        <div className="flex items-start gap-2 p-2 rounded-sm bg-amber-50 text-amber-700 text-xs border border-amber-200">
          <span className="text-sm shrink-0 mt-px">⚠</span>
          <span>{t('map.untrustworthySensors')}</span>
        </div>
      )}

      {online && value != null && (
        <button
          className="px-4 py-[0.4rem] bg-text-dark text-white border-none rounded-md cursor-pointer text-sm font-semibold transition-opacity duration-[0.35s] hover:opacity-85"
          onClick={() => setShowChart((v) => !v)}
        >
          {showChart ? t('map.hideChart') : t('map.viewHistory')}
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
