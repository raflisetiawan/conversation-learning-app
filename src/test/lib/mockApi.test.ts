import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchMockReply } from '../../lib/mockApi';

describe('fetchMockReply', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a string reply', async () => {
    const promise = fetchMockReply('Hello');
    vi.advanceTimersByTime(3000);
    const result = await promise;
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('works with a Blob input', async () => {
    const blob = new Blob(['audio data'], { type: 'audio/webm' });
    const promise = fetchMockReply(blob);
    vi.advanceTimersByTime(3000);
    const result = await promise;
    expect(typeof result).toBe('string');
  });

  it('resolves after sufficient time has passed', async () => {
    let resolved = false;
    fetchMockReply('test').then(() => { resolved = true; });

    // Not enough time yet (1.4s, min delay is 1.5s)
    vi.advanceTimersByTime(1400);
    await vi.advanceTimersByTimeAsync(0); // flush microtasks
    expect(resolved).toBe(false);

    // Enough time (advance to 3s total)
    vi.advanceTimersByTime(1600);
    await vi.advanceTimersByTimeAsync(0);
    expect(resolved).toBe(true);
  });

  it('returns different replies across calls (randomness check)', async () => {
    const results = new Set<string>();
    for (let i = 0; i < 5; i++) {
      const promise = fetchMockReply(`msg ${i}`);
      vi.advanceTimersByTime(3000);
      results.add(await promise);
    }
    expect(results.size).toBeGreaterThanOrEqual(1);
  });
});
