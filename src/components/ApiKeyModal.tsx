import { useState } from 'react';
import { Key, ExternalLink, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
  initialKey?: string;
}

export function ApiKeyModal({ onSubmit, initialKey = '' }: ApiKeyModalProps) {
  const [key, setKey] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Connect to Gemini</h2>
            <p className="text-xs text-surface-400">Enter your API key to start</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-5 rounded-xl bg-surface-800/50 p-4 text-sm leading-relaxed text-surface-300">
          <p className="mb-2">Untuk mendapatkan API key gratis:</p>
          <ol className="list-inside list-decimal space-y-1 text-xs text-surface-400">
            <li>
              Buka{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 underline"
              >
                Google AI Studio <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Login dengan akun Google kamu</li>
            <li>Klik <strong className="text-surface-200">"Create API Key"</strong></li>
            <li>Copy API key dan paste di bawah</li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="h-12 w-full rounded-xl border border-surface-700/50 bg-surface-800/50 px-4 pr-12 text-sm text-white placeholder:text-surface-500 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30 transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!key.trim()}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 font-medium text-white shadow-lg shadow-primary-600/20 transition-all hover:from-primary-500 hover:to-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Practicing English 🚀
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-4 text-center text-[11px] text-surface-500">
          API key disimpan di browser kamu saja (localStorage) dan tidak dikirim ke server manapun.
        </p>
      </div>
    </div>
  );
}
