import { User, Bot, Mic } from 'lucide-react';
import type { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`animate-slide-up flex gap-2.5 px-4 sm:px-0 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-primary-600 shadow-lg shadow-primary-600/20'
            : 'bg-surface-700 shadow-lg shadow-surface-900/30'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-primary-300" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`group relative max-w-[80%] rounded-2xl px-4 py-2.5 sm:max-w-[70%] ${
          isUser
            ? 'rounded-tr-md bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-700/20'
            : 'glass-light rounded-tl-md text-surface-100'
        }`}
      >
        {/* Audio badge */}
        {message.isAudio && isUser && (
          <div className="mb-1 flex items-center gap-1 text-primary-200/70">
            <Mic className="h-3 w-3" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Voice message</span>
          </div>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

        {/* Timestamp */}
        <div
          className={`mt-1 text-[10px] ${
            isUser ? 'text-primary-200/50 text-right' : 'text-surface-500'
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

/* Typing indicator bubble */
export function TypingIndicator() {
  return (
    <div className="animate-slide-up flex gap-2.5 px-4 sm:px-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-700 shadow-lg shadow-surface-900/30">
        <Bot className="h-4 w-4 text-primary-300" />
      </div>
      <div className="glass-light flex items-center gap-1.5 rounded-2xl rounded-tl-md px-5 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-primary-400"></span>
        <span className="typing-dot h-2 w-2 rounded-full bg-primary-400"></span>
        <span className="typing-dot h-2 w-2 rounded-full bg-primary-400"></span>
      </div>
    </div>
  );
}
