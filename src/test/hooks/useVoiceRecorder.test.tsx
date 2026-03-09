import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

// ── MediaRecorder mock ─────────────────────────────────────────────────────
class MockMediaRecorder {
  state = 'inactive';
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  private _stream: MediaStream;

  constructor(stream: MediaStream) { this._stream = stream; }

  start() {
    this.state = 'recording';
    // Fire a data event with a fake blob
    setTimeout(() => this.ondataavailable?.({ data: new Blob(['audio'], { type: 'audio/webm' }) }), 50);
  }

  stop() {
    this.state = 'inactive';
    setTimeout(() => this.onstop?.(), 10);
  }

  static isTypeSupported() { return true; }
}

// ── getUserMedia mock ──────────────────────────────────────────────────────
const mockStream = {
  getTracks: () => [{ stop: vi.fn() }],
} as unknown as MediaStream;

Object.defineProperty(globalThis.navigator, 'mediaDevices', {
  value: { getUserMedia: vi.fn().mockResolvedValue(mockStream) },
  writable: true,
});

Object.defineProperty(globalThis, 'MediaRecorder', {
  value: MockMediaRecorder,
  writable: true,
});

describe('useVoiceRecorder', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.clearAllMocks();
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockResolvedValue(mockStream);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useVoiceRecorder());
    expect(result.current.isRecording).toBe(false);
    expect(result.current.audioBlob).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.duration).toBe(0);
  });

  it('starts recording and sets isRecording to true', async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => { await result.current.startRecording(); });
    expect(result.current.isRecording).toBe(true);
  });

  it('stops recording and sets isRecording to false', async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => { await result.current.startRecording(); });
    await act(async () => { result.current.stopRecording(); });

    await waitFor(() => expect(result.current.isRecording).toBe(false));
  });

  it('produces an audioBlob after stopping', async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => { await result.current.startRecording(); });
    await act(async () => { result.current.stopRecording(); });

    await waitFor(() => expect(result.current.audioBlob).not.toBeNull());
    expect(result.current.audioBlob).toBeInstanceOf(Blob);
  });

  it('sets error when microphone permission is denied', async () => {
    const domError = new DOMException('Permission denied', 'NotAllowedError');
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(domError);

    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => { await result.current.startRecording(); });

    expect(result.current.error).toContain('denied');
    expect(result.current.isRecording).toBe(false);
  });

  it('sets error when no microphone is found', async () => {
    const domError = new DOMException('No device', 'NotFoundError');
    (navigator.mediaDevices.getUserMedia as ReturnType<typeof vi.fn>).mockRejectedValueOnce(domError);

    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => { await result.current.startRecording(); });

    expect(result.current.error).toContain('microphone');
  });

  it('increments duration while recording', async () => {
    const { result } = renderHook(() => useVoiceRecorder());
    await act(async () => { await result.current.startRecording(); });

    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current.duration).toBeGreaterThanOrEqual(2);
  });
});
