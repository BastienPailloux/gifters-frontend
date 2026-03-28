// src/services/conversationService.ts
import api from './api';
import { Conversation, ConversationWithMessages, StreamCallbacks } from '../types/chat';

const API_BASE = '/conversations';

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000/api/v1';

async function _doStream(
  conversationId: number,
  content: string,
  callbacks: StreamCallbacks,
  signal: AbortSignal,
): Promise<void> {
  const token = localStorage.getItem('token');

  let response: Response;
  try {
    response = await fetch(`${API_URL}/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content }),
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

export const conversationService = {
  async list(): Promise<Conversation[]> {
    const res = await api.get<Conversation[]>(API_BASE);
    return res.data;
  },

  async create(): Promise<Conversation> {
    const res = await api.post<Conversation>(API_BASE);
    return res.data;
  },

  async get(id: number): Promise<ConversationWithMessages> {
    const res = await api.get<ConversationWithMessages>(`${API_BASE}/${id}`);
    return res.data;
  },

  stream(conversationId: number, content: string, callbacks: StreamCallbacks): () => void {
    const controller = new AbortController();
    void _doStream(conversationId, content, callbacks, controller.signal);
    return () => controller.abort();
  },
};
