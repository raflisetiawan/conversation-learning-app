import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  isSpeaking: boolean;
  cancel: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Load an English voice when available
  useEffect(() => {
    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();
      // Prefer a natural-sounding US/UK English voice
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft'))
      );
      const fallback = voices.find((v) => v.lang.startsWith('en'));
      voiceRef.current = preferred || fallback || null;
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
    }
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, isSpeaking, cancel };
}
