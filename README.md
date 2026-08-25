
# 🚀 Omni-Assist - Offline • Private • AI

> Your Private Offline Sathi for Everything - No Internet, No Data Leak!

!![Omni-Assist](screenshot.png)

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://omni-assist.vercel.app)
[![Offline](https://img.shields.io/badge/100%25-Offline-green?style=for-the-badge)](https://github.com/radheshyamdhangar/omni-assist)
[![Private](https://img.shields.io/badge/100%25-Private-black?style=for-the-badge)]()

## 📸 Screenshot
![Omni-Assist Demo](./screenshot.png)
*Dual Engine - Ollama (Desktop) + WebLLM (Web)*

### 💡 What is Omni-Assist?

Omni-Assist started as **Bank AI Desktop** but now it's **Everything AI**. It's a Tauri + React + Ollama based offline AI assistant.

**Problem it Solves:**
- ChatGPT ko internet chahiye, data leak ka risk hai
- Banking / Study / Health data private rehna chahiye
- Rural India me internet nahi, par AI chahiye

**Solution:**
- ✅ 100% Offline - `ollama` local pe chalta hai
- ✅ 100% Private - Koi API call nahi
- ✅ 5 Domains in 1 App

### 🧠 5 Domains Supported

| Domain | Icon | What it does |
| :--- | :--- | :--- |
| **General** | 💬 | Daily questions, Hinglish chat |
| **Banking** | 🏦 | UPI, Loans, FD, RD, CIBIL, Banking fraud help (Hinglish) |
| **Study** | 📚 | Sathi tutor - Science, Math, History simple me |
| **Coding** | 💻 | Senior Dev - Clean code, debugging, projects |
| **Health** | 🩺 | General wellness info (Not a medical diagnosis) |

### ⚡ Dual Engine Architecture

This app is smart. It auto-detects the environment:

1.  **Desktop Mode (Tauri) - `⚡ Ollama (Fast Desktop)`**
    - Uses `http://localhost:11434` (phi3:mini model)
    - Super Fast, No download needed after model pull
    - Best for Laptop users

2.  **Web Mode (Vercel) - `🌐 WebLLM (Browser Offline)`**
    - Uses `@mlc-ai/web-llm` - Llama-3.2-1B runs *inside* browser!
    - First time ~1GB model download, then fully offline
    - Best for Live Demo link

```javascript
// Auto-detection logic in App.jsx
try {
  await fetch("http://localhost:11434/api/tags")
  setEngine("ollama") // Desktop
} catch {
  setEngine("webllm") // Web - Load WebLLM
}
### 🛠️ Tech Stack

- *Frontend*: React + Vite + Tailwind
- *Desktop*: Tauri (Rust)
- *AI Desktop*: Ollama (phi3:mini / llama3.2)
- *AI Web*: WebLLM (Llama-3.2-1B-Instruct-q4f32)
- *Deployment*: Vercel

### 🚀 How to Run Locally

*Step 1: Ollama Install*
Download from https://ollama.com/
ollama run phi3:mini
*Step 2: Frontend*
npm install
npm install @mlc-ai/web-llm
npx vite --port 5173
Open `http://localhost:5173`

*Step 3: Tauri Desktop App (Optional)*
npm run tauri dev
npm run tauri build # to make .exe
### 🌐 Deploy to Vercel
npm i -g vercel
vercel --prod
No env variables needed! WebLLM runs in browser.

### 🔒 Privacy First

- No OpenAI API Key
- No data sent to cloud
- All `localStorage` only
- Works on Airplane Mode!

### 👨‍💻 Author

*Radheshyam Dhangar*
- GitHub: [@radheshyamdhangar](https://github.com/radheshyamdhangar)
- Project: Omni-Assist (Previously Bank AI Desktop)

### 📜 License

MIT License - Use freely, keep it private & offline!