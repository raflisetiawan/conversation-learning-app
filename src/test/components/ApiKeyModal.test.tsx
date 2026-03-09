import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiKeyModal } from '../../components/ApiKeyModal';

describe('ApiKeyModal', () => {
  it('renders the modal heading', () => {
    render(<ApiKeyModal onSubmit={vi.fn()} />);
    expect(screen.getByText('Connect to Gemini')).toBeInTheDocument();
  });

  it('renders the API key input', () => {
    render(<ApiKeyModal onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText('AIzaSy...')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<ApiKeyModal onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /start practicing/i })).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<ApiKeyModal onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /start practicing/i })).toBeDisabled();
  });

  it('submit button enables when text is typed', async () => {
    render(<ApiKeyModal onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText('AIzaSy...');
    await userEvent.type(input, 'AIzaSy_testkey');
    expect(screen.getByRole('button', { name: /start practicing/i })).not.toBeDisabled();
  });

  it('calls onSubmit with the typed API key', async () => {
    const onSubmit = vi.fn();
    render(<ApiKeyModal onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText('AIzaSy...');
    await userEvent.type(input, 'AIzaSy_testkey_123');
    fireEvent.submit(input.closest('form')!);
    expect(onSubmit).toHaveBeenCalledWith('AIzaSy_testkey_123');
  });

  it('trims whitespace from submitted key', async () => {
    const onSubmit = vi.fn();
    render(<ApiKeyModal onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText('AIzaSy...');
    await userEvent.type(input, '  AIzaSy_mykey  ');
    fireEvent.submit(input.closest('form')!);
    expect(onSubmit).toHaveBeenCalledWith('AIzaSy_mykey');
  });

  it('does not call onSubmit with empty/whitespace key', async () => {
    const onSubmit = vi.fn();
    render(<ApiKeyModal onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText('AIzaSy...');
    await userEvent.type(input, '   ');
    fireEvent.submit(input.closest('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('toggles show/hide key on eye button click', async () => {
    render(<ApiKeyModal onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText('AIzaSy...') as HTMLInputElement;
    expect(input.type).toBe('password');
    // Eye button is the second button inside the relative div
    const toggleBtn = screen.getAllByRole('button').find(
      (btn) => !btn.textContent?.includes('Start')
    )!;
    fireEvent.click(toggleBtn);
    expect(input.type).toBe('text');
    fireEvent.click(toggleBtn);
    expect(input.type).toBe('password');
  });

  it('renders with an initial key pre-filled', () => {
    render(<ApiKeyModal onSubmit={vi.fn()} initialKey="AIzaSy_existing" />);
    const input = screen.getByPlaceholderText('AIzaSy...') as HTMLInputElement;
    expect(input.value).toBe('AIzaSy_existing');
  });

  it('renders a link to Google AI Studio', () => {
    render(<ApiKeyModal onSubmit={vi.fn()} />);
    expect(screen.getByRole('link', { name: /google ai studio/i })).toHaveAttribute(
      'href',
      'https://aistudio.google.com/apikey'
    );
  });
});
