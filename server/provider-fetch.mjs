// Workers does not support redirect: 'error'. Manual mode returns redirects
// without following them; createAssistant rejects every non-2xx response.
// Never log credentials, questions, response bodies, URLs or raw error messages.
export function providerFetch(fetchImpl = fetch, warn = console.warn) {
  return async (url, options) => {
    try {
      const response = await fetchImpl(url, {...options, redirect: 'manual'});
      if (!response.ok) warn(JSON.stringify({event: 'gemini_upstream_failure', status: response.status}));
      return response;
    } catch (error) {
      warn(JSON.stringify({event: 'gemini_transport_failure', timeout: error instanceof Error && error.name === 'AbortError'}));
      throw error;
    }
  };
}
