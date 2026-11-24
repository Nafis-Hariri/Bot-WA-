export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'unknown';

export interface IncomingMessage {
  remoteJid: string;
  fromMe: boolean;
  messageType: MessageType;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: number;
  pushName?: string;
}

export interface RateLimitInfo {
  count: number;
  resetTime: number;
}

export interface SessionData {
  id: string;
  createdAt: number;
  expiresAt: number;
}