import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square } from 'lucide-react';

interface ChatInputProps {
  onSendText: (text: string) => void;
  onSendAudio: () => void;
  isRecording: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled: boolean;
  recordingError: string | null;
}

export function ChatInput({
  onSendText,
  isRecording,
  recordingDuration,
  onStartRecording,
  onStopRecording,
  disabled,
  recordingError,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && !isRecording) {
      inputRef.current?.focus();
    }
  }, [disabled, isRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSendText(trimmed);
    setText('');
  };

  const handleMicClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass sticky bottom-0 px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Error display */}
        {recordingError && (
          <div className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 border border-red-500/20">
            {recordingError}
          </div>
        )}

        {/* Recording state */}
        {isRecording && (
          <div className="mb-3 flex items-center justify-center gap-3 animate-fade-in">
            <div className="relative flex items-center justify-center">
              <span className="animate-pulse-ring absolute h-4 w-4 rounded-full bg-red-500"></span>
              <span className="relative h-3 w-3 rounded-full bg-red-500"></span>
            </div>
            <span className="text-sm font-medium text-red-400">
              Recording {formatDuration(recordingDuration)}
            </span>
          </div>
        )}

        {/* Input row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Mic button */}
          <button
            type="button"
            onClick={handleMicClick}
            disabled={disabled && !isRecording}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
                : 'bg-surface-800 text-surface-400 hover:bg-surface-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <Square className="h-4 w-4" fill="currentColor" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled || isRecording}
            placeholder={
              isRecording
                ? 'Recording in progress...'
                : disabled
                ? 'AI is thinking...'
                : 'Type your message in English...'
            }
            className="h-11 flex-1 rounded-xl border border-surface-700/50 bg-surface-800/50 px-4 text-sm text-white placeholder:text-surface-500 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!text.trim() || disabled || isRecording}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-500 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
