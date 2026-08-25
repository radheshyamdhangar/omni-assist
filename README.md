# Offline Banking Assistant - 100% Offline AI

![Demo](./screenshots/offline-banking-assistant.gif)

> 100% Offline Banking AI Desktop App built with Tauri + React + Ollama (phi3:mini). No API keys, no internet needed.

Offline Banking Assistant AI Desktop and Web is a cross-platform desktop application that runs AI models locally via Ollama. It provides a private, fast chat interface for interacting with LLMs without sending data to the cloud, targeting low-resource machines and offline usage.

Key Features

- **100% Offline:** Runs locally using Ollama. No internet required after initial setup.
- **Privacy by Design:** All prompts, context, and responses remain on the local machine.
- **Premium User Experience:** Clean chat interface with conversation history and streaming responses.
- **Optimized for Low-End Hardware:** Default model `phi3:mini` (~2.2GB) runs efficiently on CPU with <4GB RAM.
- **Lightweight Distribution:** Built with Tauri, producing small installers.
- **Cross-Platform:** Supports Windows, macOS, and Linux from a single codebase.

Technology Stack

- **Frontend:** React + Vite
- **Desktop Layer:** Tauri (Rust)
- **AI Engine:** Ollama Chat API
- **Model:** `phi3:mini` (default), examples: `llama3.2:3b`, `llama3.1:8b`
- **Styling:** Vanilla CSS (no external UI framework dependency)

Getting Started

Prerequisites

- Node.js 18 or higher
- Rust (https://www.rust-lang.org/tools/install)
- Ollama (https://ollama.com/download)

Installation

1. Clone the repository and change directory:

   git clone https://github.com/your-username/bank-ai-desktop.git
   cd bank-ai-desktop

2. Install dependencies:

   npm install

3. Pull the default model locally with Ollama:

   ollama pull phi3:mini

4. Start development (web):

   npm run dev

5. Run the Tauri native development window:

   npm run tauri dev

Notes on models

- The default target is `phi3:mini` for minimal RAM usage. To try larger models, pull them with Ollama (e.g., `ollama pull llama3.2:3b`). Ensure sufficient disk and memory for larger models.

Build & Packaging

- Build web assets:

  npm run build

- Package the Tauri application for your platform:

  npm run tauri build

(See Tauri docs for platform-specific packaging, signing, and installer creation.)

Artifacts will be available at:

src-tauri\target\release\bundle\
- Windows: .msi & .exe
- macOS: .dmg
- Linux: .deb & AppImage

Project structure (important files)

- src/ — React application source
- public/ — static assets
- src-tauri/ — Tauri configuration and Rust-side code
- package.json — project scripts and dependencies
- vite.config.js — Vite configuration

Environment variables and security

- Keep API keys and secrets out of source control. Use environment variables or OS-level secret stores for any integrations that require credentials.

Contributing

- Open issues for bugs or feature requests.
- Fork the repo, create a topic branch, and open a pull request.
- Use clear commit messages and include relevant test or reproduction steps.

License

- Add your preferred license (e.g., MIT) at the repository root.

Contact

- For questions or help, open an issue or contact the maintainers.

Thank you for using Bank AI Desktop — a private, lightweight, offline-capable desktop client for local LLM experimentation and usage.
