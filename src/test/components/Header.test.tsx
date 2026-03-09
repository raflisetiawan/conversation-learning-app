import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../components/Header';

const defaultProps = {
  onClearChat: vi.fn(),
  onChangeApiKey: vi.fn(),
  isSpeaking: false,
  onCancelSpeech: vi.fn(),
  messageCount: 0,
  hasApiKey: true,
  chatMode: 'tutor' as const,
  onToggleMode: vi.fn(),
};

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('EngliSpeak')).toBeInTheDocument();
  });

  it('shows "English Tutor" status when hasApiKey and chatMode is tutor', () => {
    render(<Header {...defaultProps} hasApiKey={true} chatMode="tutor" />);
    expect(screen.getByText('English Tutor')).toBeInTheDocument();
  });

  it('shows "Chat Partner" status when hasApiKey and chatMode is conversation', () => {
    render(<Header {...defaultProps} hasApiKey={true} chatMode="conversation" />);
    expect(screen.getByText('Chat Partner')).toBeInTheDocument();
  });

  it('shows "No API key" when hasApiKey is false', () => {
    render(<Header {...defaultProps} hasApiKey={false} />);
    expect(screen.getByText('No API key')).toBeInTheDocument();
  });

  it('shows Tutor mode button when chatMode is "tutor"', () => {
    render(<Header {...defaultProps} chatMode="tutor" />);
    expect(screen.getByTitle('Switch to Conversation mode')).toBeInTheDocument();
  });

  it('shows Chat mode button when chatMode is "conversation"', () => {
    render(<Header {...defaultProps} chatMode="conversation" />);
    expect(screen.getByTitle('Switch to Tutor mode')).toBeInTheDocument();
  });

  it('calls onToggleMode when mode button is clicked', () => {
    const onToggleMode = vi.fn();
    render(<Header {...defaultProps} onToggleMode={onToggleMode} />);
    fireEvent.click(screen.getByTitle('Switch to Conversation mode'));
    expect(onToggleMode).toHaveBeenCalledTimes(1);
  });

  it('does not show Clear button when messageCount is 0', () => {
    render(<Header {...defaultProps} messageCount={0} />);
    expect(screen.queryByTitle('Clear chat')).not.toBeInTheDocument();
  });

  it('shows Clear button when messageCount > 0', () => {
    render(<Header {...defaultProps} messageCount={5} />);
    expect(screen.getByTitle('Clear chat')).toBeInTheDocument();
  });

  it('calls onClearChat when Clear button is clicked', () => {
    const onClearChat = vi.fn();
    render(<Header {...defaultProps} messageCount={3} onClearChat={onClearChat} />);
    fireEvent.click(screen.getByTitle('Clear chat'));
    expect(onClearChat).toHaveBeenCalledTimes(1);
  });

  it('shows Stop speaking button when isSpeaking is true', () => {
    render(<Header {...defaultProps} isSpeaking={true} />);
    expect(screen.getByTitle('Stop speaking')).toBeInTheDocument();
  });

  it('calls onCancelSpeech when Stop button is clicked', () => {
    const onCancelSpeech = vi.fn();
    render(<Header {...defaultProps} isSpeaking={true} onCancelSpeech={onCancelSpeech} />);
    fireEvent.click(screen.getByTitle('Stop speaking'));
    expect(onCancelSpeech).toHaveBeenCalledTimes(1);
  });

  it('calls onChangeApiKey when API Key button is clicked', () => {
    const onChangeApiKey = vi.fn();
    render(<Header {...defaultProps} onChangeApiKey={onChangeApiKey} />);
    fireEvent.click(screen.getByTitle('Change API Key'));
    expect(onChangeApiKey).toHaveBeenCalledTimes(1);
  });
});
