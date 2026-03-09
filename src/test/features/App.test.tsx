/**
 * Feature / Integration Tests for the App component.
 *
 * Strategy:
 * - Mock all external dependencies (Gemini API, voice recorder, speech synthesis, SW)
 * - Test user-facing flows end to end through the UI
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// ── Mock virtual:pwa-register ─────────────────────────────────────────────
vi.mock('virtual:pwa-register', () => ({ registerSW: vi.fn() }));

// ── Mock Gemini API ───────────────────────────────────────────────────────
vi.mock('../../lib/geminiApi', () => ({
  sendMessageToGemini: vi.fn().mockResolvedValue("Great question! Let's practice English together."),
  sendAudioToGemini: vi.fn().mockResolvedValue("I heard your voice message!"),
  getSavedApiKey: vi.fn().mockReturnValue('AIzaSy_test_key'),
  saveApiKey: vi.fn(),
  clearApiKey: vi.fn(),
  resetChat: vi.fn(),
  getSavedMode: vi.fn().mockReturnValue('tutor'),
  saveMode: vi.fn(),
}));

// ── Mock useVoiceRecorder ─────────────────────────────────────────────────
vi.mock('../../hooks/useVoiceRecorder', () => ({
  useVoiceRecorder: vi.fn().mockReturnValue({
    isRecording: false,
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    audioBlob: null,
    error: null,
    duration: 0,
  }),
}));

// ── Mock useSpeechSynthesis ───────────────────────────────────────────────
vi.mock('../../hooks/useSpeechSynthesis', () => ({
  useSpeechSynthesis: vi.fn().mockReturnValue({
    speak: vi.fn(),
    isSpeaking: false,
    cancel: vi.fn(),
  }),
}));

import { sendMessageToGemini, getSavedApiKey, getSavedMode, resetChat, saveMode } from '../../lib/geminiApi';

describe('App — Feature Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getSavedApiKey as ReturnType<typeof vi.fn>).mockReturnValue('AIzaSy_test_key');
    (getSavedMode as ReturnType<typeof vi.fn>).mockReturnValue('tutor');
    (sendMessageToGemini as ReturnType<typeof vi.fn>).mockResolvedValue("Great question! Let's practice English together.");
  });

  // ── Initial Render ───────────────────────────────────────────────────────
  describe('Initial render', () => {
    it('shows the Header with app name', () => {
      render(<App />);
      expect(screen.getByText('EngliSpeak')).toBeInTheDocument();
    });

    it('shows WelcomeScreen when there are no messages', () => {
      render(<App />);
      expect(screen.getByRole('heading', { name: /welcome to englispeak/i })).toBeInTheDocument();
    });

    it('shows the API key modal when no API key is saved', () => {
      (getSavedApiKey as ReturnType<typeof vi.fn>).mockReturnValue(null);
      render(<App />);
      expect(screen.getByText('Connect to Gemini')).toBeInTheDocument();
    });

    it('does NOT show API key modal when key is already saved', () => {
      render(<App />);
      expect(screen.queryByText('Connect to Gemini')).not.toBeInTheDocument();
    });

    it('shows "English Tutor" in header when API key present and mode is tutor', () => {
      render(<App />);
      expect(screen.getByText('English Tutor')).toBeInTheDocument();
    });
  });

  // ── Text Chat Flow ───────────────────────────────────────────────────────
  describe('Text chat flow', () => {
    it('sends a text message and displays it in the chat', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Hello AI!');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText('Hello AI!')).toBeInTheDocument();
      });
    });

    it('calls sendMessageToGemini after submitting a message', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Hello?');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(sendMessageToGemini).toHaveBeenCalledWith('AIzaSy_test_key', 'Hello?', 'tutor');
      });
    });

    it('shows the bot reply after the API responds', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Hi!');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText("Great question! Let's practice English together.")).toBeInTheDocument();
      });
    });

    it('clears the input field after sending', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
      await userEvent.type(input, 'Hello!');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  // ── Mode Toggle ──────────────────────────────────────────────────────────
  describe('Mode toggle', () => {
    it('starts in tutor mode showing "English Tutor" status', () => {
      render(<App />);
      expect(screen.getByText('English Tutor')).toBeInTheDocument();
    });

    it('switches to conversation mode when toggle is clicked', async () => {
      render(<App />);
      const toggleBtn = screen.getByTitle('Switch to Conversation mode');
      fireEvent.click(toggleBtn);
      await waitFor(() => expect(saveMode).toHaveBeenCalledWith('conversation'));
    });

    it('calls resetChat when mode is toggled', () => {
      render(<App />);
      fireEvent.click(screen.getByTitle('Switch to Conversation mode'));
      expect(resetChat).toHaveBeenCalled();
    });

    it('clears messages when mode is toggled', async () => {
      render(<App />);
      // Send a message first
      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Hello');
      fireEvent.submit(input.closest('form')!);
      await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument());

      // Toggle mode
      fireEvent.click(screen.getByTitle('Switch to Conversation mode'));
      await waitFor(() => {
        expect(screen.queryByText('Hello')).not.toBeInTheDocument();
      });
    });
  });

  // ── Clear Chat ───────────────────────────────────────────────────────────
  describe('Clear chat', () => {
    it('shows Clear button only after messages exist', async () => {
      render(<App />);
      expect(screen.queryByTitle('Clear chat')).not.toBeInTheDocument();

      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Hello');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => expect(screen.getByTitle('Clear chat')).toBeInTheDocument());
    });

    it('clears all messages after clicking Clear', async () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Test message');
      fireEvent.submit(input.closest('form')!);
      await waitFor(() => expect(screen.getByText('Test message')).toBeInTheDocument());

      fireEvent.click(screen.getByTitle('Clear chat'));
      await waitFor(() => {
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /welcome to englispeak/i })).toBeInTheDocument();
      });
    });
  });

  // ── API Key Modal ─────────────────────────────────────────────────────────
  describe('API Key modal', () => {
    it('opens the API key modal when "API Key" button is clicked', () => {
      render(<App />);
      fireEvent.click(screen.getByTitle('Change API Key'));
      expect(screen.getByText('Connect to Gemini')).toBeInTheDocument();
    });
  });

  // ── Error Handling ────────────────────────────────────────────────────────
  describe('Error handling', () => {
    it('shows an error message when the Gemini API call fails', async () => {
      (sendMessageToGemini as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));
      render(<App />);
      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Test');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/couldn't process that/i)).toBeInTheDocument();
      });
    });

    it('shows invalid API key message when API_KEY error is returned', async () => {
      (sendMessageToGemini as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('API_KEY invalid'));
      render(<App />);
      const input = screen.getByPlaceholderText(/type your message/i);
      await userEvent.type(input, 'Test');
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/invalid api key/i)).toBeInTheDocument();
      });
    });
  });
});
