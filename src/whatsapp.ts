import {
  makeWASocket,
  useMultiFileAuthState,
} from 'baileys';
import { config } from './config.js';
import type { IncomingMessage } from './types.js';
import qrcode from 'qrcode';

let sock: any = null;

export async function createWhatsAppSocket(): Promise<any> {
  const authState = await useMultiFileAuthState(config.sessionPath);
  const { state, saveCreds } = authState;

  const newSock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: state.keys,
    },
  });

  newSock.ev.on('connection.update', async (update: any) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('📱 Scan QR code ini dengan WhatsApp:');
      console.log('────────────────────────────────');
      await qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          console.error('QR generation error:', err);
          return;
        }
        // Print QR as text
        qrcode.toString(qr, { type: 'utf8' }, (err2, str) => {
          if (err2) {
            console.error('QR text error:', err2);
            return;
          }
          console.log(str);
          console.log('────────────────────────────────');
        });
      });
    }
    
    if (connection === 'connected') {
      console.log('✅ WhatsApp Connected');
      await saveCreds();
    }
    if (connection === 'error') {
      console.error('❌ WhatsApp connection error:', update.error);
    }
    if (connection === 'disconnected') {
      console.log('⚠️ WhatsApp disconnected, reconnecting...');
    }
    if (lastDisconnect?.error) {
      console.error('Last disconnect:', lastDisconnect.error);
    }
  });

  newSock.ev.on('messages.upsert', async (msg: any) => {
    for (const message of msg.messages) {
      try {
        const incoming = await convertToIncoming(message);
        if (!incoming) continue;
        if (incoming.fromMe) continue; // Ignore own messages
        const { handleIncomingMessage } = await import('./bot.js');
        await handleIncomingMessage(incoming);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
  });

  sock = newSock;
  return newSock;
}

export async function convertToIncoming(message: any): Promise<IncomingMessage | null> {
  const { key, message: msg } = message;
  if (!msg) return null;

  const remoteJid = key.participant || key.remoteJid;
  const fromMe = key.fromMe;

  let messageType: IncomingMessage['messageType'] = 'unknown';
  let text: string | undefined = msg.conversation;

  if (msg.imageMessage) {
    messageType = 'image';
    text = (msg.imageMessage.caption || '').trim() || undefined;
  } else if (msg.audioMessage) {
    messageType = 'audio';
  } else if (msg.videoMessage) {
    messageType = 'video';
  } else if (msg.documentMessage) {
    messageType = 'document';
  }

  if (!text && msg.extendedTextMessage) {
    text = msg.extendedTextMessage.contextBytes ? '' : msg.extendedTextMessage.text;
  }

  if (!text && msg.imageMessage?.caption) {
    text = msg.imageMessage.caption;
  }

  return {
    remoteJid,
    fromMe,
    messageType,
    text,
    imageUrl: messageType === 'image' ? remoteJid : undefined,
    audioUrl: messageType === 'audio' ? remoteJid : undefined,
    timestamp: key?.timestamp ?? Math.floor(Date.now() / 1000),
  };
}

export function getWhatsAppSocket() {
  return sock;
}