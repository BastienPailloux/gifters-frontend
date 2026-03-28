import { StreamCallbacks } from '../types/chat';

const AGENT_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AGENT_URL) ||
  'http://localhost:8000';

async function _doStream(
  messages: Array<{ role: string; content: string }>,
  callbacks: StreamCallbacks,
  signal: AbortSignal,
): Promise<void> {
  const token = localStorage.getItem('token');

  let response: Response;
  try {
    response = await fetch(`${AGENT_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      callbacks.onError('Erreur de connexion');
    }
    return;
  }

  if (!response.ok) {
    callbacks.onError(`Erreur serveur : ${response.status}`);
    return;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        const dataStr = line.slice(6).trim();
        try {
          const data = JSON.parse(dataStr) as Record<string, unknown>;
          if (currentEvent === 'step') {
            callbacks.onStep(data.label as string, data.status as 'running' | 'done');
          } else if (currentEvent === 'final') {
            callbacks.onFinal(data.content as string);
          } else if (currentEvent === 'error') {
            callbacks.onError(data.message as string);
          }
        } catch {
          // ignore malformed JSON
        }
        currentEvent = '';
      }
    }
  }
}

export const agentService = {
  streamChat(
    messages: Array<{ role: string; content: string }>,
    callbacks: StreamCallbacks,
  ): () => void {
    const controller = new AbortController();
    void _doStream(messages, callbacks, controller.signal);
    return () => controller.abort();
  },
};
