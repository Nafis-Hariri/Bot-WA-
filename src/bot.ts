import { config } from './config.js';
import { getGeminiModel, getChatHistory, clearChatHistory } from './gemini.js';
import { createWhatsAppSocket, getWhatsAppSocket } from './whatsapp.js';
import type { IncomingMessage } from './types.js';

let whatsappSocket: any = null;
const rateLimitState = new Map<string, { count: number; resetTime: number }>();

export async function startBot() {
  console.log('🚀 Starting WhatsApp-Gemini Bot...');
  
  whatsappSocket = await createWhatsAppSocket();
}

export async function handleIncomingMessage(incoming: IncomingMessage) {
  const userId = incoming.remoteJid;
  const now = Date.now();

  // Rate limiting check
  const userRateLimit = rateLimitState.get(userId) || { count: 0, resetTime: 0 };
  if (config.rateLimitEnabled && now < userRateLimit.resetTime) {
    if (userRateLimit.count >= config.rateLimitMaxRequests) {
      await sendTextMessage(userId, '⏳ Terlalu banyak pesan. Coba lagi dalam 1 menit.');
      return;
    }
  }

  let responseText: string;

  if (incoming.messageType === 'text' && incoming.text) {
    const history = getChatHistory(userId);
    
    const chat = getGeminiModel().startChat({ history });
    const result = await chat.sendMessage(incoming.text);
    responseText = result.response.text();
    
    // Update history
    history.push(
      { role: 'user', parts: [{ text: incoming.text }] },
      { role: 'model', parts: [{ text: responseText }] }
    );
    
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
  } 
  else if (incoming.messageType === 'image') {
    responseText = '🖼️ Terima kasih atas foto-nya! (Fitur vision AI masih dalam pengembangan...)';
  }
  else if (incoming.messageType === 'audio') {
    responseText = '🎧 Terima kasih atas pesan suaranya! (Fitur transkripsi suara masih dalam pengembangan...)';
  }
  else {
    responseText = '👋 Halo! Saya ' + config.botName + '. Kirim teks atau foto untuk mulai ngobrol.';
  }

  // Increment rate limit
  rateLimitState.set(userId, {
    count: (userRateLimit.count || 0) + 1,
    resetTime: userRateLimit.resetTime || (now + config.rateLimitWindowMs),
  });

  await sendTextMessage(userId, responseText);
}

async function sendTextMessage(to: string, text: string) {
  const socket = getWhatsAppSocket();
  if (!socket) return;
  
  try {
    await socket.sendMessage({
      remoteJid: to,
      message: { text },
    });
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

// Handle socket connection updates for auto-reconnect
export async function handleSocketConnectionUpdate(update: any) {
  const { connection, lastDisconnect } = update;
  if (connection === 'disconnected') {
    console.log('WhatsApp disconnected, attempting reconnect...');
    const newSocket = await createWhatsAppSocket();
    return newSocket;
  }
}