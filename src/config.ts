import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  // Google Gemini
  geminiApiKey: process.env.GEMINI_API_KEY || '',

  // WhatsApp
  sessionPath: process.env.WHATSAPP_SESSION_PATH || './auth_info',
  logLevel: (process.env.WHATSAPP_LOG_LEVEL || 'info') as 'error' | 'warn' | 'info' | 'debug',

  // Bot info
  botName: process.env.BOT_NAME || 'GeminiBot',
  botNumber: process.env.BOT_NUMBER || '',

  // Rate limiting
  rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
} as const;