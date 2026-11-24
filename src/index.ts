import { startBot } from './bot.js';

async function main() {
  console.log('🚀 Starting WhatsApp-Gemini Bot...');
  await startBot();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Bot shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Bot shutting down...');
  process.exit(0);
});

main().catch(console.error);