# 🤖 WhatsApp Bot with Google Gemini AI

Bot WhatsApp yang terintegrasi dengan **Google Gemini AI** untuk chatting, image understanding, dan voice features.

## ✨ Fitur Utama

- ✅ **Chat AI** — Terintegrasi dengan Google Gemini 1.5 Flash
- 🖼️ **Image Recognition** — Terima dan proses gambar (dalam pengembangan)
- 🎧 **Voice Transcription** — Terima dan proses suara (dalam pengembangan)
- ⏱️ **Rate Limiting** — Mencegah spam pesan
- 🔄 **Auto-reconnect** — Tidak perlu restart manual
- 💾 **Session Persistence** — Save/restore koneksi WhatsApp

---

## 📋 Prerequisites

1. **Node.js** v20+ (sudah terinstal)
2. **npm** v10+ (sudah terinstal)
3. **Google Gemini API Key** — [Dapatkan di sini](https://aistudio.google.com/apikey)

---

## 🚀 Langkah Instalasi & Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi API Key
```bash
cp .env.example .env
# Edit file .env dan isi GEMINI_API_KEY=your_key_di_sini
```

### 3. Jalankan Bot

**Mode Development (auto-reload):**
```bash
npm run dev
```

**Mode Production:**
```bash
npm run build
npm start
```

### 4. Scan QR Code

1. Bot akan otomatis mengeluarkan **QR code** di terminal
2. Buka WhatsApp di ponsel Anda
3. Pilih **Menu → Linked devices → Link a device**
4. **Scan QR code** tersebut dengan kamera ponsel
5. Tunggu hingga status **"Connected"** di terminal

### 5. Uji Bot
Kirim pesan ke bot atau foto, bot akan merespons via Gemini AI.

---

## 📁 Struktur Proyek

```
src/
├── index.ts          # Entry point
├── bot.ts            # Message handler + Gemini logic
├── whatsapp.ts       # WhatsApp connection (Baileys)
├── gemini.ts         # Google Gemini AI integration
├── config.ts         # Configuration management
└── types.ts          # TypeScript definitions
```

---

## ⚙️ Konfigurasi Environment

| Variable | Default | Keterangan |
|----------|---------|-----------|
| `GEMINI_API_KEY` | - | **Wajib**. Google Gemini API key |
| `WHATSAPP_SESSION_PATH` | `./auth_info` | Lokasi penyimpanan session WhatsApp |
| `BOT_NAME` | `GeminiBot` | Nama bot yang akan muncul |
| `RATE_LIMIT_ENABLED` | `true` | Aktifkan/disable rate limiting |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Window rate limit (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | `10` | Maksimal request per window |

---

## 🐳 Docker Support

```bash
# Build & Run
docker build -t whatsapp-gemini-bot .
docker run -d whatsapp-gemini-bot
```

---

## ⚠️ Peringatan & Disclaimer

- Jangan **commit** file `.env` ke repository (sudah ada di `.gitignore`)
- Bot ini untuk **keperluan pembelajaran**, bukan komersial
- Gemini API memiliki rate limit dan biaya
- Gunakan **Baileys** dengan bijak, pastikan tidak melanggar WhatsApp Terms

---

## 📄 License

MIT
