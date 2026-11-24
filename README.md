# 🤖 WhatsApp Bot with Google Gemini AI

Bot WhatsApp yang terintegrasi dengan Google Gemini AI. Fitur utama:
- ✅ Chat AI (Gemini 1.5 Flash)
- 🖼️ Image recognition (dalam pengembangan)
- 🎧 Voice transcription (dalam pengembangan)
- ⏱️ Rate limiting built-in
- 🔄 Auto-reconnect

## 📋 Prerequisites

1. Node.js 20+ (sudah terinstall)
2. NPM 10+ (sudah terinstall)
3. Google Gemini API Key (dari [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

## 🚀 Langkah-langkah

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi API Key
Salin `.env.example` ke `.env` dan ganti `YOUR_API_KEY_HERE`:
```bash
cp .env.example .env
# Edit .env, ganti GEMINI_API_KEY=AIzaSyYOUR_API_KEY_HERE
```

### 3. Jalankan Bot
```bash
# Development mode (auto-reload)
npm run dev

# Atau build lalu start
npm run build
npm start
```

### 4. Scan QR Code
Buka WhatsApp di HP, buka menu **Linked devices** → **Link a device**, lalu scan QR code yang muncul di terminal.

## 📁 Struktur Proyek
```
src/
├── index.ts          # Entry point
├── bot.ts            # Message handler
├── whatsapp.ts       # WhatsApp connection (Baileys)
├── gemini.ts         # Gemini AI integration
├── config.ts         # Configuration
└── types.ts          # Type definitions
```

## 🛠️ Konfigurasi

Buka `.env` dan sesuaikan:
- `GEMINI_API_KEY`: Google Gemini API key (wajib)
- `WHATSAPP_SESSION_PATH`: Folder untuk session WhatsApp
- `BOT_NAME`: Nama bot
- `RATE_LIMIT_ENABLED`: Aktifkan rate limiting
- `RATE_LIMIT_MAX_REQUESTS`: Maksimal request per window

## 📝 Catatan

- Bot ini menggunakan library [Baileys](https://github.com/adihajij/baileys) untuk koneksi WhatsApp
- AI provider: Google Gemini 1.5 Flash
- Session disimpan di folder `./auth_info`
- Rate limiting mencegah spam

## ⚠️ Peringatan

- Jangan share API key ke publik
- Jangan commit file `.env` ke repository (sudah di .gitignore)
- Bot ini untuk keperluan belajar, bukan komersial