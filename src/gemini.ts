import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
import { config } from './config.js';

let model: GenerativeModel | null = null;
let chatHistory: Map<string, Content[]> = new Map();

export function getGeminiModel(): GenerativeModel {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY tidak diatur di .env');
  }

  if (!model) {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 2048,
      },
      systemInstruction: `Anda adalah ${config.botName}, asisten AI yang ramah dan membantu.
Anda berkomunikasi melalui WhatsApp.
Selalu jawab dalam bahasa Indonesia unless pengguna meminta bahasa lain.
Jawab secara singkat dan padat (maksimal 2-3 paragraf) agar cocok untuk WhatsApp.
Jika ditanya tentang gambar atau suara, beri tahu pengguna bahwa Anda saat ini hanya memproses teks.`,
    });
  }

  return model;
}

export function getChatHistory(userId: string): Content[] {
  if (!chatHistory.has(userId)) {
    chatHistory.set(userId, []);
  }
  return chatHistory.get(userId)!;
}

export function clearChatHistory(userId: string): void {
  chatHistory.delete(userId);
}

export async function generateResponse(userId: string, userMessage: string): Promise<string> {
  try {
    const model = getGeminiModel();
    const history = getChatHistory(userId);

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    // Update history
    history.push(
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: response }] }
    );

    // Keep last 20 messages to avoid context window overflow
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    return response;
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Maaf, terjadi kesalahan saat memproses pertanyaan Anda.');
  }
}