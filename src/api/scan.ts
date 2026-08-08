import client from './client';

export const getStatus = async () => {
  const response = await client.get('/status');
  return response.data;
};

export const startFullScan = async () => {
  const response = await client.post('/scan/full');
  return response.data;
};

export const startIncrementalScan = async () => {
  const response = await client.post('/scan/incremental');
  return response.data;
};

export const fetchScanStatus = getStatus;

export const startScan = async (mode: 'full' | 'incremental') => {
  if (mode === 'full') {
    return startFullScan();
  } else {
    return startIncrementalScan();
  }
};