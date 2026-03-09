import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from './types';
import type { ChatMode } from './lib/geminiApi';
import { sendMessageToGemini, sendAudioToGemini, getSavedApiKey, saveApiKey, clearApiKey, resetChat, getSavedMode, saveMode } from './lib/geminiApi';
import { useVoiceRecorder } from './hooks/useVoiceRecorder';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatBubble, TypingIndicator } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { ApiKeyModal } from './components/ApiKeyModal';
import { InstallPWA } from './components/InstallPWA';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(getSavedApiKey());
  const [showApiKeyModal, setShowApiKeyModal] = useState(!getSavedApiKey());
  const [chatMode, setChatMode] = useState<ChatMode>(getSavedMode());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { isRecording, startRecording, stopRecording, audioBlob, error: recordingError, duration } =
    useVoiceRecorder();
  const { speak, isSpeaking, cancel: cancelSpeech } = useSpeechSynthesis();

  // Auto-scroll to bottom on new messages or loading state
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle API key submit
  const handleApiKeySubmit = useCallback((key: string) => {
    saveApiKey(key);
    setApiKey(key);
    setShowApiKeyModal(false);
  }, []);

  // Toggle chat mode
  const handleToggleMode = useCallback(() => {
    const newMode: ChatMode = chatMode === 'tutor' ? 'conversation' : 'tutor';
    setChatMode(newMode);
    saveMode(newMode);
    resetChat(); // Reset chat session so new system prompt takes effect
    cancelSpeech();
    setMessages([]);
  }, [chatMode, cancelSpeech]);

  // Handle text send
  const handleSendText = useCallback(
    async (text: string) => {
      if (!apiKey) return;

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const reply = await sendMessageToGemini(apiKey, text, chatMode);
        const botMsg: Message = {
          id: generateId(),
          role: 'bot',
          text: reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        speak(reply);
      } catch (err) {
        const errorText = err instanceof Error && err.message.includes('API_KEY')
          ? 'Invalid API key. Please check your key and try again.'
          : "Sorry, I couldn't process that. Please try again!";
        const errorMsg: Message = {
          id: generateId(),
          role: 'bot',
          text: errorText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, chatMode, speak]
  );

  // Handle audio blob ready (after stop recording)
  useEffect(() => {
    if (audioBlob && !isRecording && apiKey) {
      const sendAudio = async () => {
        const userMsg: Message = {
          id: generateId(),
          role: 'user',
          text: '🎤 Voice message sent',
          timestamp: new Date(),
          isAudio: true,
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
          const reply = await sendAudioToGemini(apiKey, audioBlob, chatMode);
          const botMsg: Message = {
            id: generateId(),
            role: 'bot',
            text: reply,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMsg]);
          speak(reply);
        } catch {
          const errorMsg: Message = {
            id: generateId(),
            role: 'bot',
            text: "Sorry, I couldn't understand the audio. Please try again or type your message.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        } finally {
          setIsLoading(false);
        }
      };
      sendAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);

  // Clear chat
  const handleClearChat = useCallback(() => {
    cancelSpeech();
    resetChat();
    setMessages([]);
  }, [cancelSpeech]);

  // Logout / change API key
  const handleChangeApiKey = useCallback(() => {
    cancelSpeech();
    clearApiKey();
    resetChat();
    setApiKey(null);
    setMessages([]);
    setShowApiKeyModal(true);
  }, [cancelSpeech]);

  return (
    <div className="flex h-full flex-col">
      {showApiKeyModal && (
        <ApiKeyModal onSubmit={handleApiKeySubmit} initialKey={apiKey || ''} />
      )}

      <Header
        onClearChat={handleClearChat}
        onChangeApiKey={handleChangeApiKey}
        isSpeaking={isSpeaking}
        onCancelSpeech={cancelSpeech}
        messageCount={messages.length}
        hasApiKey={!!apiKey}
        chatMode={chatMode}
        onToggleMode={handleToggleMode}
      />

      {/* Chat area */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 py-4 sm:py-6">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        )}
      </main>

      <ChatInput
        onSendText={handleSendText}
        onSendAudio={() => {}}
        isRecording={isRecording}
        recordingDuration={duration}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        disabled={isLoading || !apiKey}
        recordingError={recordingError}
      />

      <InstallPWA />
    </div>
  );
}
