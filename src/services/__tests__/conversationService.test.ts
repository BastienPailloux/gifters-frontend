// src/services/__tests__/conversationService.test.ts
import { conversationService } from '../conversationService';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock api module
jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import api from '../api';
const mockedApi = api as jest.Mocked<typeof api>;

describe('conversationService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('list', () => {
    it('calls GET /conversations and returns data', async () => {
      mockedApi.get.mockResolvedValue({ data: [{ id: 1, title: 'Test' }] });
      const result = await conversationService.list();
      expect(mockedApi.get).toHaveBeenCalledWith('/conversations');
      expect(result).toEqual([{ id: 1, title: 'Test' }]);
    });
  });

  describe('create', () => {
    it('calls POST /conversations and returns data', async () => {
      mockedApi.post.mockResolvedValue({ data: { id: 2, title: 'Nouvelle conversation' } });
      const result = await conversationService.create();
      expect(mockedApi.post).toHaveBeenCalledWith('/conversations');
      expect(result.id).toBe(2);
    });
  });

  describe('stream', () => {
    it('returns a cleanup function', () => {
      const mockBody = {
        getReader: () => ({
          read: jest.fn().mockResolvedValue({ done: true, value: undefined }),
        }),
      };
      mockFetch.mockResolvedValue({ ok: true, body: mockBody });
      const cleanup = conversationService.stream(1, 'test', {
        onStep: jest.fn(),
        onFinal: jest.fn(),
        onError: jest.fn(),
      });
      expect(typeof cleanup).toBe('function');
    });

    it('parses final SSE event and calls onFinal', async () => {
      const onFinal = jest.fn();
      const sseData = 'event: final\ndata: {"content":"Bonjour"}\n\n';
      const encoder = new TextEncoder();
      let callCount = 0;
      const mockBody = {
        getReader: () => ({
          read: jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount === 1) return Promise.resolve({ done: false, value: encoder.encode(sseData) });
            return Promise.resolve({ done: true, value: undefined });
          }),
        }),
      };
      mockFetch.mockResolvedValue({ ok: true, body: mockBody });
      conversationService.stream(1, 'test', { onStep: jest.fn(), onFinal, onError: jest.fn() });
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(onFinal).toHaveBeenCalledWith('Bonjour');
    });

    it('calls onError on non-ok response', async () => {
      const onError = jest.fn();
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      conversationService.stream(1, 'test', { onStep: jest.fn(), onFinal: jest.fn(), onError });
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(onError).toHaveBeenCalledWith(expect.stringContaining('500'));
    });
  });
});
