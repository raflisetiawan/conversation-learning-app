import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

// Mock the Web Speech API
const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn().mockReturnValue([]);

const mockSpeechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  getVoices: mockGetVoices,
  onvoiceschanged: null as unknown,
  speaking: false,
  pending: false,
  paused: false,
};

Object.defineProperty(globalThis, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

// Mock SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  rate = 1;
  pitch = 1;
  volume = 1;
  voice = null;
  lang = '';
  text: string;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) { this.text = text; }
}

Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
  writable: true,
});

describe('useSpeechSynthesis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSpeechSynthesis.onvoiceschanged = null;
  });

  it('initializes with isSpeaking = false', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    expect(result.current.isSpeaking).toBe(false);
  });

  it('calls speechSynthesis.speak when speak() is called', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    act(() => { result.current.speak('Hello World'); });
    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockCancel).toHaveBeenCalled(); // pre-cancel before speaking
  });

  it('calls speechSynthesis.cancel when cancel() is called', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    act(() => { result.current.cancel(); });
    expect(mockCancel).toHaveBeenCalled();
  });

  it('sets isSpeaking to false after cancel()', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    act(() => { result.current.cancel(); });
    expect(result.current.isSpeaking).toBe(false);
  });

  it('creates an utterance with English lang and correct rate', () => {
    const { result } = renderHook(() => useSpeechSynthesis());
    act(() => { result.current.speak('Test message'); });

    const utterance = mockSpeak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toBe('Test message');
    expect(utterance.lang).toBe('en-US');
    expect(utterance.rate).toBe(0.95);
  });
});
