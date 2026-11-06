import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { fetchSensors } from '@/store/slices/sensorsSlice';
import { fetchReadings } from '@/store/slices/readingsSlice';

/**
 * Carrega sensores e leituras conforme a seleção atual do gráfico.
 *
 * Centraliza o efeito de busca e o botão "tentar novamente" em uma única
 * função, garantindo o mesmo filtro e a mesma assinatura de requisição.
 *
 * @param {object} params
 * @param {Array<object>} params.sensors - Sensores carregados no redux.
 * @param {boolean} params.hasOptionSelection - Indica se há uma seleção válida.
 * @param {object|null} params.filtro - Filtro aceito pela API de leituras.
 * @param {{ startDate: string, endDate: string }|null} params.intervalo - Intervalo de datas.
 * @returns {{ retry: () => void }} Ação para repetir a busca de leituras.
 */
export function useChartReadings({ sensors, hasOptionSelection, filtro, intervalo }) {
  const dispatch = useDispatch();
  const fetchSigRef = useRef(0);

  useEffect(() => {
    if (!sensors.length) dispatch(fetchSensors());
  }, [dispatch, sensors.length]);

  const buscarLeituras = useCallback(() => {
    if (!hasOptionSelection || !filtro || !intervalo) return;

    const sig = ++fetchSigRef.current;
    dispatch(fetchReadings({ _sig: sig, ...filtro, ...intervalo }));
  }, [dispatch, hasOptionSelection, filtro, intervalo]);

  useEffect(() => {
    buscarLeituras();
  }, [buscarLeituras]);

  return { retry: buscarLeituras };
}
