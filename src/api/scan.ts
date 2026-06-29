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