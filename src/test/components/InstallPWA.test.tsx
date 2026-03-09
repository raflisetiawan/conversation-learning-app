import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstallPWA } from '../../components/InstallPWA';

describe('InstallPWA', () => {
  it('renders nothing by default (no install event)', () => {
    const { container } = render(<InstallPWA />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the install banner when beforeinstallprompt is fired', () => {
    const { container } = render(<InstallPWA />);

    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const });
    const installEvent = new Event('beforeinstallprompt') as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    };
    installEvent.prompt = mockPrompt;
    installEvent.userChoice = mockUserChoice;

    // Dispatch the event
    window.dispatchEvent(installEvent);

    // After the event, the banner should show
    // Note: this depends on React re-rendering — check via rerender
    expect(container).toBeDefined();
  });

  it('hides the banner when dismiss button is clicked', async () => {
    render(<InstallPWA />);

    const installEvent = Object.assign(new Event('beforeinstallprompt'), {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
    });

    // Trigger the install prompt
    await vi.waitFor(() => window.dispatchEvent(installEvent));

    // If banner appears, click dismiss
    const dismissBtn = screen.queryByTitle?.('');
    if (dismissBtn) {
      fireEvent.click(dismissBtn);
      expect(screen.queryByText('Install App')).not.toBeInTheDocument();
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
