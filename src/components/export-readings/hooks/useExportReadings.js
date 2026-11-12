import { APIService } from '@/API/APIService';
import { useInterval } from '@/hooks/useInterval';
import { useCallback, useEffect, useRef, useState } from 'react';

import { assertMetadataMatches } from '../utils/metadata';
import { triggerDownload } from '../utils/download';
import { toExportError } from '../utils/errors';

const api = new APIService();

/**
 * Orquestra uma exportação: fetch em stream, validação do metadata, download,
 * progresso, cancelamento e tentativa novamente.
 */
export function useExportReadings() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const controllerRef = useRef(null);
  const bytesRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastPayloadRef = useRef(null);
  const runIdRef = useRef(0);
  const busyRef = useRef(false);

  useInterval(
    () => {
      setDownloadedBytes(bytesRef.current);
      setElapsedMs(Date.now() - startedAtRef.current);
    },
    status === 'exporting' ? 250 : null
  );

  const exportNow = useCallback(async (payload) => {
    if (busyRef.current) return;

    const runId = ++runIdRef.current;
    const controller = new AbortController();

    busyRef.current = true;
    controllerRef.current = controller;
    lastPayloadRef.current = payload;
    startedAtRef.current = Date.now();
    bytesRef.current = 0;

    setDownloadedBytes(0);
    setElapsedMs(0);
    setError(null);
    setResult(null);
    setStatus('exporting');

    try {
      const response = await api.exportSensorReadings(payload, {
        signal: controller.signal,
        onProgress: (bytes) => {
          bytesRef.current = bytes;
        },
      });

      if (runId !== runIdRef.current) return;

      assertMetadataMatches(payload, response.metadata);
      triggerDownload(response.blob, response.filename);

      const elapsed = Date.now() - startedAtRef.current;
      setDownloadedBytes(response.bytes);
      setElapsedMs(elapsed);
      setResult({ ...response, elapsedMs: elapsed });
      setStatus('success');
    } catch (caught) {
      if (runId !== runIdRef.current) return;

      setDownloadedBytes(bytesRef.current);
      setElapsedMs(Date.now() - startedAtRef.current);
      setStatus(caught?.name === 'AbortError' ? 'cancelled' : 'error');
      setError(toExportError(caught));
    } finally {
      if (runId === runIdRef.current) {
        busyRef.current = false;
        controllerRef.current = null;
      }
    }
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    runIdRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    busyRef.current = false;
    lastPayloadRef.current = null;

    setStatus('idle');
    setError(null);
    setResult(null);
    setDownloadedBytes(0);
    setElapsedMs(0);
    bytesRef.current = 0;
  }, []);

  const retry = useCallback(() => {
    if (lastPayloadRef.current) exportNow(lastPayloadRef.current);
  }, [exportNow]);

  const downloadAgain = useCallback(() => {
    if (result?.blob && result?.filename) triggerDownload(result.blob, result.filename);
  }, [result]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      controllerRef.current?.abort();
    };
  }, []);

  return {
    status,
    error,
    result,
    downloadedBytes,
    elapsedMs,
    exportNow,
    cancel,
    reset,
    retry,
    downloadAgain,
  };
}
