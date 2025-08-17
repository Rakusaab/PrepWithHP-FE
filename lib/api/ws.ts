// WebSocket/SSE client for real-time updates
export function createSSE(url: string, onMessage: (data: any) => void, onError?: (e: any) => void) {
  const eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      onMessage(event.data);
    }
  };
  eventSource.onerror = (e) => {
    if (onError) onError(e);
    eventSource.close();
  };
  return eventSource;
}
