import { agentService } from '../agentService';

const encode = (s: string) => new TextEncoder().encode(s);

function mockFetch(chunks: string[], ok = true) {
  let callIndex = 0;
  const reads = [
    ...chunks.map(chunk => ({ done: false, value: encode(chunk) })),
    { done: true, value: undefined },
  ];
  const reader = { read: jest.fn(() => Promise.resolve(reads[callIndex++])) };
  (global.fetch as jest.Mock).mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    body: { getReader: () => reader },
  });
}

describe('agentService.streamChat', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.setItem('token', 'test-jwt');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('envoie le JWT dans le header Authorization', async () => {
    mockFetch(['event: final\ndata: {"content":"ok"}\n\n']);
    const onFinal = jest.fn();
    agentService.streamChat([{ role: 'user', content: 'test' }], {
      onStep: jest.fn(), onFinal, onError: jest.fn(),
    });
    await new Promise(r => setTimeout(r, 10));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/chat/stream'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-jwt' }),
      })
    );
  });

  it('appelle onStep pour les événements step', async () => {
    const sse = 'event: step\ndata: {"label":"Connexion","status":"running"}\n\n' +
                'event: final\ndata: {"content":"ok"}\n\n';
    mockFetch([sse]);
    const onStep = jest.fn();
    agentService.streamChat([{ role: 'user', content: 'test' }], {
      onStep, onFinal: jest.fn(), onError: jest.fn(),
    });
    await new Promise(r => setTimeout(r, 10));
    expect(onStep).toHaveBeenCalledWith('Connexion', 'running');
  });

  it('appelle onFinal pour l\'événement final', async () => {
    mockFetch(['event: final\ndata: {"content":"Réponse finale"}\n\n']);
    const onFinal = jest.fn();
    agentService.streamChat([{ role: 'user', content: 'test' }], {
      onStep: jest.fn(), onFinal, onError: jest.fn(),
    });
    await new Promise(r => setTimeout(r, 10));
    expect(onFinal).toHaveBeenCalledWith('Réponse finale');
  });

  it('appelle onError si le serveur répond non-ok', async () => {
    mockFetch([], false);
    const onError = jest.fn();
    agentService.streamChat([{ role: 'user', content: 'test' }], {
      onStep: jest.fn(), onFinal: jest.fn(), onError,
    });
    await new Promise(r => setTimeout(r, 10));
    expect(onError).toHaveBeenCalledWith(expect.stringContaining('500'));
  });

  it('retourne une fonction cleanup qui annule le fetch', () => {
    mockFetch(['event: final\ndata: {"content":"ok"}\n\n']);
    const cleanup = agentService.streamChat([], {
      onStep: jest.fn(), onFinal: jest.fn(), onError: jest.fn(),
    });
    expect(typeof cleanup).toBe('function');
    expect(() => cleanup()).not.toThrow();
  });
});
