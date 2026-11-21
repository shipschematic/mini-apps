export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const queryParts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
};

export const parseQueryString = (queryString: string): Record<string, string> => {
  if (!queryString || queryString === '?') return {};

  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const pairs = cleanQuery.split('&');

  const result: Record<string, string> = {};
  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      result[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return result;
};
