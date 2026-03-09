import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!installEvent || dismissed) return null;

  const handleInstall = async () => {
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallEvent(null);
    }
  };

  return (
    <div className="glass animate-slide-up fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl px-4 py-3 shadow-2xl shadow-black/40 sm:left-auto sm:right-6 sm:w-80">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
          <span className="text-base font-bold text-white">E</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Install EngliSpeak</p>
          <p className="text-xs text-surface-400">Add to home screen for quick access</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-surface-500 hover:text-surface-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={handleInstall}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2 text-sm font-medium text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500 transition-colors"
      >
        <Download className="h-4 w-4" />
        Install App
      </button>
    </div>
  );
}
