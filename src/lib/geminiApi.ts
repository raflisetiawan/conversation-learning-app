import { GoogleGenerativeAI, type Part } from '@google/generative-ai';

export type ChatMode = 'tutor' | 'conversation';

const TUTOR_PROMPT = `You are EngliSpeak, a friendly and encouraging English language tutor. Your role is to:
1. Help users practice conversational English
2. Gently correct grammar and pronunciation mistakes
3. Teach useful vocabulary, idioms, and phrases
4. Keep responses concise (2-4 sentences max) and conversational
5. Use simple English that intermediate learners can understand
6. Occasionally ask follow-up questions to keep the conversation going
7. Praise good attempts and provide constructive feedback

Always respond in English. If the user writes in another language, respond in English and encourage them to try in English.`;

const CONVERSATION_PROMPT = `You are EngliSpeak, a friendly and knowledgeable conversation partner. Your role is to:
1. Chat naturally like a real friend — be warm, engaging, and genuine
2. Answer questions thoroughly but concisely (keep responses to 2-5 sentences unless more depth is needed)
3. Share interesting perspectives, opinions, and knowledge on any topic
4. Be helpful with any request — from general knowledge, advice, creative ideas, to problem-solving
5. Use natural, conversational language (not too formal, not too casual)
6. Ask follow-up questions to keep the conversation interesting
7. ALWAYS remember and reference what was discussed earlier in the conversation

You can respond in any language the user writes in. Match their language preference. Be a great conversationalist!`;

const AUDIO_INSTRUCTION_TUTOR = 'The user sent a voice message. Transcribe what you heard, then respond naturally as an English tutor. If unclear, politely ask them to repeat.';
const AUDIO_INSTRUCTION_CONVERSATION = 'The user sent a voice message. Briefly confirm what you heard, then continue the conversation naturally. If unclear, politely ask them to repeat.';

function getSystemPrompt(mode: ChatMode): string {
  return mode === 'tutor' ? TUTOR_PROMPT : CONVERSATION_PROMPT;
}

// ─── Single Chat Session per mode ──────────────────────────────────────────
let chatSession: ReturnType<ReturnType<GoogleGenerativeAI['getGenerativeModel']>['startChat']> | null = null;
let currentApiKey: string | null = null;
let currentMode: ChatMode | null = null;

function getOrCreateChat(apiKey: string, mode: ChatMode) {
  // Reuse session only if key AND mode haven't changed
  if (chatSession && currentApiKey === apiKey && currentMode === mode) {
    return chatSession;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite-preview',
    systemInstruction: getSystemPrompt(mode),
  });

  chatSession = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.85,
    },
  });
  currentApiKey = apiKey;
  currentMode = mode;

  return chatSession;
}

// ─── Text message ─────────────────────────────────────────────────────────
export async function sendMessageToGemini(
  apiKey: string,
  message: string,
  mode: ChatMode
): Promise<string> {
  const chat = getOrCreateChat(apiKey, mode);
  const result = await chat.sendMessage(message);
  return result.response.text();
}

// ─── Audio message (routes through the SAME chat session for context) ──────
export async function sendAudioToGemini(
  apiKey: string,
  audioBlob: Blob,
  mode: ChatMode
): Promise<string> {
  const chat = getOrCreateChat(apiKey, mode);

  // Convert blob to base64
  const buffer = await audioBlob.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  const instruction = mode === 'tutor' ? AUDIO_INSTRUCTION_TUTOR : AUDIO_INSTRUCTION_CONVERSATION;

  // Send audio + instruction as a single multipart message into the ongoing chat
  const parts: Part[] = [
    {
      inlineData: {
        mimeType: (audioBlob.type || 'audio/webm') as string,
        data: base64,
      },
    },
    { text: instruction },
  ];

  const result = await chat.sendMessage(parts);
  return result.response.text();
}

// ─── Reset / clear ─────────────────────────────────────────────────────────
export function resetChat() {
  chatSession = null;
  currentMode = null;
}

// ─── Storage helpers ────────────────────────────────────────────────────────
const API_KEY_STORAGE = 'englispeak_gemini_api_key';
const MODE_STORAGE = 'englispeak_chat_mode';

export function getSavedApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE);
}

export function saveApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
  chatSession = null;
  currentApiKey = null;
  currentMode = null;
}

export function getSavedMode(): ChatMode {
  return (localStorage.getItem(MODE_STORAGE) as ChatMode) || 'tutor';
}

export function saveMode(mode: ChatMode) {
  localStorage.setItem(MODE_STORAGE, mode);
}
