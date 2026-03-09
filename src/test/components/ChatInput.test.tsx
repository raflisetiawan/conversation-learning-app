import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../../components/ChatInput';

const defaultProps = {
  onSendText: vi.fn(),
  onSendAudio: vi.fn(),
  isRecording: false,
  recordingDuration: 0,
  onStartRecording: vi.fn(),
  onStopRecording: vi.fn(),
  disabled: false,
  recordingError: null,
};

describe('ChatInput', () => {
  it('renders the text input field', () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  it('renders Send and Mic buttons', () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByTitle('Send message')).toBeInTheDocument();
    expect(screen.getByTitle('Start recording')).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByTitle('Send message')).toBeDisabled();
  });

  it('send button is enabled when text is entered', async () => {
    render(<ChatInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(/type your message/i);
    await userEvent.type(input, 'Hello');
    expect(screen.getByTitle('Send message')).not.toBeDisabled();
  });

  it('calls onSendText with input value on send', async () => {
    const onSendText = vi.fn();
    render(<ChatInput {...defaultProps} onSendText={onSendText} />);
    const input = screen.getByPlaceholderText(/type your message/i);
    await userEvent.type(input, 'Hello AI');
    fireEvent.submit(input.closest('form')!);
    expect(onSendText).toHaveBeenCalledWith('Hello AI');
  });

  it('clears input after sending', async () => {
    render(<ChatInput {...defaultProps} />);
    const input = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
    await userEvent.type(input, 'Hello');
    fireEvent.submit(input.closest('form')!);
    expect(input.value).toBe('');
  });

  it('does not send empty or whitespace-only messages', async () => {
    const onSendText = vi.fn();
    render(<ChatInput {...defaultProps} onSendText={onSendText} />);
    const input = screen.getByPlaceholderText(/type your message/i);
    await userEvent.type(input, '   ');
    fireEvent.submit(input.closest('form')!);
    expect(onSendText).not.toHaveBeenCalled();
  });

  it('calls onStartRecording when mic button clicked (not recording)', () => {
    const onStartRecording = vi.fn();
    render(<ChatInput {...defaultProps} onStartRecording={onStartRecording} />);
    fireEvent.click(screen.getByTitle('Start recording'));
    expect(onStartRecording).toHaveBeenCalledTimes(1);
  });

  it('shows Stop recording button when isRecording is true', () => {
    render(<ChatInput {...defaultProps} isRecording={true} />);
    expect(screen.getByTitle('Stop recording')).toBeInTheDocument();
  });

  it('calls onStopRecording when stop button is clicked', () => {
    const onStopRecording = vi.fn();
    render(<ChatInput {...defaultProps} isRecording={true} onStopRecording={onStopRecording} />);
    fireEvent.click(screen.getByTitle('Stop recording'));
    expect(onStopRecording).toHaveBeenCalledTimes(1);
  });

  it('shows recording duration when isRecording is true', () => {
    render(<ChatInput {...defaultProps} isRecording={true} recordingDuration={65} />);
    expect(screen.getByText('Recording 1:05')).toBeInTheDocument();
  });

  it('shows error message when recordingError is provided', () => {
    render(<ChatInput {...defaultProps} recordingError="Microphone access denied." />);
    expect(screen.getByText('Microphone access denied.')).toBeInTheDocument();
  });

  it('shows "AI is thinking..." placeholder when disabled', () => {
    render(<ChatInput {...defaultProps} disabled={true} />);
    expect(screen.getByPlaceholderText('AI is thinking...')).toBeInTheDocument();
  });

  it('disables input and send button when disabled prop is true', () => {
    render(<ChatInput {...defaultProps} disabled={true} />);
    expect(screen.getByPlaceholderText('AI is thinking...')).toBeDisabled();
  });
});
