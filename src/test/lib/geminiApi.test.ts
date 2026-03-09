import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getSavedApiKey,
  saveApiKey,
  clearApiKey,
  getSavedMode,
  saveMode,
  resetChat,
} from '../../lib/geminiApi';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

describe('Gemini API — localStorage helpers', () => {
  beforeEach(() => localStorageMock.clear());
  afterEach(() => localStorageMock.clear());

  describe('getSavedApiKey / saveApiKey / clearApiKey', () => {
    it('returns null when no key is saved', () => {
      expect(getSavedApiKey()).toBeNull();
    });

    it('saves and retrieves an API key', () => {
      saveApiKey('AIzaSy_test_key_123');
      expect(getSavedApiKey()).toBe('AIzaSy_test_key_123');
    });

    it('clears the API key from storage', () => {
      saveApiKey('AIzaSy_test_key_123');
      clearApiKey();
      expect(getSavedApiKey()).toBeNull();
    });
  });

  describe('getSavedMode / saveMode', () => {
    it('defaults to "tutor" mode when nothing is saved', () => {
      expect(getSavedMode()).toBe('tutor');
    });

    it('saves and retrieves "tutor" mode', () => {
      saveMode('tutor');
      expect(getSavedMode()).toBe('tutor');
    });

    it('saves and retrieves "conversation" mode', () => {
      saveMode('conversation');
      expect(getSavedMode()).toBe('conversation');
    });

    it('overrides mode when changed', () => {
      saveMode('tutor');
      saveMode('conversation');
      expect(getSavedMode()).toBe('conversation');
    });
  });

  describe('resetChat', () => {
    it('can be called without throwing', () => {
      expect(() => resetChat()).not.toThrow();
    });

    it('can be called multiple times safely', () => {
      expect(() => { resetChat(); resetChat(); }).not.toThrow();
    });
  });
});
