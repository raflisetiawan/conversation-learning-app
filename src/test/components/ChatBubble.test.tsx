import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatBubble, TypingIndicator } from '../../components/ChatBubble';
import type { Message } from '../../types';

const userMessage: Message = {
  id: '1',
  role: 'user',
  text: 'Hello, how are you?',
  timestamp: new Date('2026-01-01T12:00:00'),
};

const botMessage: Message = {
  id: '2',
  role: 'bot',
  text: 'I am doing great, thanks!',
  timestamp: new Date('2026-01-01T12:01:00'),
};

const audioMessage: Message = {
  id: '3',
  role: 'user',
  text: '🎤 Voice message sent',
  timestamp: new Date('2026-01-01T12:02:00'),
  isAudio: true,
};

describe('ChatBubble', () => {
  it('renders user message text', () => {
    render(<ChatBubble message={userMessage} />);
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
  });

  it('renders bot message text', () => {
    render(<ChatBubble message={botMessage} />);
    expect(screen.getByText('I am doing great, thanks!')).toBeInTheDocument();
  });

  it('shows "Voice message" badge for audio messages', () => {
    render(<ChatBubble message={audioMessage} />);
    expect(screen.getByText('Voice message')).toBeInTheDocument();
  });

  it('does not show voice badge for text messages', () => {
    render(<ChatBubble message={userMessage} />);
    expect(screen.queryByText('Voice message')).not.toBeInTheDocument();
  });

  it('renders the message timestamp', () => {
    render(<ChatBubble message={userMessage} />);
    // Time format is locale-dependent (12:00, 12.00, etc.) — match digits separated by any char
    const timeEl = screen.getByText(/\d{1,2}.\d{2}/);
    expect(timeEl).toBeInTheDocument();
  });

  it('applies user bubble styling (right-aligned)', () => {
    const { container } = render(<ChatBubble message={userMessage} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex-row-reverse');
  });

  it('applies bot bubble styling (left-aligned)', () => {
    const { container } = render(<ChatBubble message={botMessage} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('flex-row');
    expect(wrapper.className).not.toContain('flex-row-reverse');
  });
});

describe('TypingIndicator', () => {
  it('renders three typing dots', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('.typing-dot');
    expect(dots).toHaveLength(3);
  });

  it('renders in the DOM without crashing', () => {
    expect(() => render(<TypingIndicator />)).not.toThrow();
  });
});
