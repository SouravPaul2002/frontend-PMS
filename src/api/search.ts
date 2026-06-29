import client, { createCancelToken, isCancel } from './client';
import { SearchRequest, SearchResponse, ApiError } from './types';

let cancelSearch: (() => void) | null = null;

export const searchFiles = async (
  params: SearchRequest
): Promise<SearchResponse> => {
  // Cancel any in-flight search request
  if (cancelSearch) {
    cancelSearch();
    cancelSearch = null;
  }

  const { token, cancel } = createCancelToken();
  cancelSearch = cancel;

  try {
    const res = await client.get<SearchResponse>('/search', {
      params: {
        q: params.query,
        type: params.file_type ?? 'all',
      },
      cancelToken: token,
    });
    cancelSearch = null;
    return res.data;
  } catch (err) {
    if (isCancel(err)) {
      throw { message: 'cancelled', status: 0 } as ApiError;
    }
    throw err;
  }
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await client.get('/status', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};
