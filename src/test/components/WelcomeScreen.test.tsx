import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WelcomeScreen } from '../../components/WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders the welcome heading', () => {
    render(<WelcomeScreen />);
    expect(screen.getByRole('heading', { name: /welcome to englispeak/i })).toBeInTheDocument();
  });

  it('renders the three feature cards', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText('Text Chat')).toBeInTheDocument();
    expect(screen.getByText('Voice Input')).toBeInTheDocument();
    expect(screen.getByText('AI Feedback')).toBeInTheDocument();
  });

  it('renders the call-to-action hint', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(/start by typing a message/i)).toBeInTheDocument();
  });

  it('renders the AI tutor description', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(/ai-powered tutor/i)).toBeInTheDocument();
  });
});
