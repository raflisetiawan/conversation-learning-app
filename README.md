# 🗣️ EngliSpeak — AI English Practice

**EngliSpeak** is an interactive English conversation practice platform powered by Google Gemini AI. Practice your English by chatting with an AI tutor — type or speak, and get instant feedback with auto text-to-speech responses.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)

---

## ✨ Features

### 🎓 Dual Chat Modes
- **English Tutor** — AI corrects grammar, teaches vocabulary, and gives pronunciation tips
- **Conversation Partner** — Free-form chat on any topic, in any language

### 💬 Text & Voice Input
- Type messages via the text input field
- Click the **mic button** to record voice messages using the **MediaRecorder API**
- Visual recording indicator with live duration timer

### 🔊 Auto Text-to-Speech
- AI replies are automatically read aloud using the **Web Speech API**
- Prefers natural-sounding English voices (Google/Microsoft)
- Stop TTS at any time from the header

### 📱 Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline-capable app shell (via Workbox service worker)
- Custom app icon and splash screen

### 🎨 Premium UI
- Dark theme with **Slate/Indigo** color palette
- Glassmorphism effects and micro-animations
- Messenger-style chat bubbles with avatars
- Fully responsive (mobile-first design)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A free **Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd conversation-learning-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Enter Your API Key

On first launch, you'll be prompted to enter your Gemini API key. The key is stored **only in your browser's localStorage** and is never sent to any server other than Google's Gemini API.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ApiKeyModal.tsx     # API key entry modal with instructions
│   ├── ChatBubble.tsx      # Chat message bubble + typing indicator
│   ├── ChatInput.tsx       # Text input + mic button + recording UI
│   ├── Header.tsx          # App header with mode toggle & controls
│   ├── InstallPWA.tsx      # PWA install banner
│   └── WelcomeScreen.tsx   # Landing screen with feature cards
├── hooks/
│   ├── useSpeechSynthesis.ts   # Web Speech API (TTS) wrapper
│   └── useVoiceRecorder.ts     # MediaRecorder API wrapper
├── lib/
│   ├── geminiApi.ts        # Gemini API integration (text + audio)
│   └── mockApi.ts          # Mock API for offline UI testing
├── test/
│   ├── setup.ts            # Vitest setup (jest-dom, jsdom stubs)
│   ├── components/         # Component tests
│   ├── hooks/              # Hook tests
│   ├── lib/                # Utility tests
│   └── features/           # Integration / feature tests
├── App.tsx                 # Main application shell
├── main.tsx                # Entry point + SW registration
├── types.ts                # TypeScript interfaces
└── index.css               # Tailwind v4 + custom theme + animations
```

---

## 🧪 Testing

The project uses **Vitest** + **React Testing Library** with **jsdom**.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Interactive UI
npm run test:ui
```

### Test Coverage

| Category        | File                       | Tests |
|-----------------|----------------------------|-------|
| **Unit**        | `mockApi.test.ts`          | 4     |
| **Unit**        | `geminiApi.test.ts`        | 9     |
| **Hook**        | `useSpeechSynthesis.test.ts` | 5   |
| **Hook**        | `useVoiceRecorder.test.tsx` | 7    |
| **Component**   | `Header.test.tsx`          | 13    |
| **Component**   | `ChatBubble.test.tsx`      | 9     |
| **Component**   | `ChatInput.test.tsx`       | 14    |
| **Component**   | `WelcomeScreen.test.tsx`   | 4     |
| **Component**   | `ApiKeyModal.test.tsx`     | 11    |
| **Component**   | `InstallPWA.test.tsx`      | 3     |
| **Integration** | `App.test.tsx`             | 18    |
| **Total**       |                            | **97** |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [TypeScript 5.9](https://www.typescriptlang.org) | Type safety |
| [Vite 7](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [Lucide React](https://lucide.dev) | Icon library |
| [Google Generative AI](https://ai.google.dev) | Gemini API SDK |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app) | PWA support |
| [Vitest](https://vitest.dev) | Test runner |
| [React Testing Library](https://testing-library.com) | Component testing |

---

## 📖 User Flows

### Flow 1 — Text Chat
```
User types message → Send → Message in UI → API call to Gemini
→ Bot reply in UI → TTS reads the reply aloud
```

### Flow 2 — Voice Chat
```
User clicks Mic → Permission granted → Recording starts (with visual indicator)
→ User clicks Stop → Audio sent to Gemini → Bot reply in UI → TTS reads reply
```

### Flow 3 — Mode Switch
```
User clicks mode toggle (Tutor ↔ Chat) → Chat history cleared
→ New system prompt loaded → Fresh conversation starts
```

---

## 🔧 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is  not licensed 
