import { Trash2, Volume2, VolumeX, KeyRound, GraduationCap, MessageCircle } from 'lucide-react';
import type { ChatMode } from '../lib/geminiApi';

interface HeaderProps {
  onClearChat: () => void;
  onChangeApiKey: () => void;
  isSpeaking: boolean;
  onCancelSpeech: () => void;
  messageCount: number;
  hasApiKey: boolean;
  chatMode: ChatMode;
  onToggleMode: () => void;
}

export function Header({ onClearChat, onChangeApiKey, isSpeaking, onCancelSpeech, messageCount, hasApiKey, chatMode, onToggleMode }: HeaderProps) {
  const isTutor = chatMode === 'tutor';

  return (
    <header className="glass sticky top-0 z-10 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
            <span className="text-lg font-bold text-white">E</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              EngliSpeak
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${hasApiKey ? 'animate-ping bg-emerald-400' : 'bg-surface-500'} opacity-75`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-surface-500'}`}></span>
              </span>
              <span className="text-xs text-surface-400">
                {hasApiKey ? (isTutor ? 'English Tutor' : 'Chat Partner') : 'No API key'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Mode Toggle */}
          {hasApiKey && (
            <button
              onClick={onToggleMode}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isTutor
                  ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-primary-500/15 text-primary-300 hover:bg-primary-500/25'
              }`}
              title={isTutor ? 'Switch to Conversation mode' : 'Switch to Tutor mode'}
            >
              {isTutor ? (
                <>
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Tutor</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Chat</span>
                </>
              )}
            </button>
          )}

          {isSpeaking && (
            <button
              onClick={onCancelSpeech}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600/20 px-3 py-1.5 text-xs font-medium text-primary-300 transition-all hover:bg-primary-600/30"
              title="Stop speaking"
            >
              <VolumeX className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}
          {!isSpeaking && messageCount > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-surface-800/50 px-2.5 py-1.5 text-xs text-surface-400">
              <Volume2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Auto TTS</span>
            </div>
          )}
          {hasApiKey && (
            <button
              onClick={onChangeApiKey}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-surface-400 transition-all hover:bg-surface-700/50 hover:text-surface-200"
              title="Change API Key"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Key</span>
            </button>
          )}
          {messageCount > 0 && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-surface-400 transition-all hover:bg-red-500/10 hover:text-red-400"
              title="Clear chat"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
