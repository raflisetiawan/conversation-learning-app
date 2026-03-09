import '@testing-library/jest-dom';

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = () => {};

// Stub speechSynthesis if missing (some test environments)
if (!window.speechSynthesis) {
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: () => {},
      cancel: () => {},
      getVoices: () => [],
      onvoiceschanged: null,
      speaking: false,
      pending: false,
      paused: false,
    },
    writable: true,
  });
}
