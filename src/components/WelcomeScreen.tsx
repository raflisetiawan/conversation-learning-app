import { MessageCircle, Mic, BookOpen } from 'lucide-react';

export function WelcomeScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 animate-fade-in">
      {/* Floating Logo */}
      <div className="animate-float mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30">
          <span className="text-3xl font-bold text-white">E</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
        Welcome to EngliSpeak
      </h2>
      <p className="mb-10 max-w-md text-center text-sm text-surface-400 sm:text-base">
        Practice your English conversation skills with an AI-powered tutor.
        Type or speak — your personal coach is ready!
      </p>

      {/* Feature Cards */}
      <div className="grid w-full max-w-lg gap-3 sm:grid-cols-3">
        <FeatureCard
          icon={<MessageCircle className="h-5 w-5" />}
          title="Text Chat"
          description="Type messages and get instant feedback"
        />
        <FeatureCard
          icon={<Mic className="h-5 w-5" />}
          title="Voice Input"
          description="Speak and practice pronunciation"
        />
        <FeatureCard
          icon={<BookOpen className="h-5 w-5" />}
          title="AI Feedback"
          description="Get corrections and tips in real-time"
        />
      </div>

      {/* CTA hint */}
      <p className="mt-10 text-xs text-surface-500">
        Start by typing a message or pressing the mic button below ↓
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-light rounded-xl px-4 py-4 text-center transition-all hover:border-primary-500/20 hover:bg-primary-500/5">
      <div className="mb-2 flex justify-center text-primary-400">{icon}</div>
      <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-surface-400">{description}</p>
    </div>
  );
}
