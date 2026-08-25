import { useState, useEffect } from "react"
import * as webllm from "@mlc-ai/web-llm"

const DOMAINS = {
    general: { label: "General", prompt: "You are Omni-Assist, a helpful, concise and private offline AI assistant." },
    banking: { label: "Banking", prompt: "You are an expert banking assistant. Provide clear, accurate guidance on UPI, loans, savings, investments and fraud prevention in professional English." },
    study: { label: "Study", prompt: "You are a knowledgeable academic tutor. Explain concepts clearly, step-by-step, with simple examples in professional English." },
    coding: { label: "Coding", prompt: "You are a senior software engineer. Write clean, efficient, well-commented code and explain your approach." },
    health: { label: "Health", prompt: "You are a wellness information assistant. Provide general, educational health information only. Always clarify that this is not a medical diagnosis and advise consulting a healthcare professional." },
}

const DOMAIN_ICONS = {
    general: "💬",
    banking: "🏦",
    study: "📚",
    coding: "💻",
    health: "🩺",
}

export default function App() {
    const [domain, setDomain] = useState("general")
    const [input, setInput] = useState("")
    const [engine, setEngine] = useState("checking")
    const [webEngine, setWebEngine] = useState(null)
    const [messages, setMessages] = useState([
        { role: "ai", text: `Welcome to Omni-Assist.\n\nYour secure, offline AI assistant across 5 domains. Select a domain from the sidebar to begin.` }
    ])

    useEffect(() => {
        async function init() {
            try {
                const res = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(1500) })
                if (res.ok) setEngine("ollama")
                else throw new Error()
            } catch {
                setEngine("webllm")
                const e = await webllm.CreateMLCEngine("Llama-3.2-1B-Instruct-q4f32_1-MLC", {
                    initProgressCallback: (p) => {
                        setMessages([{ role: "ai", text: `Initializing Offline Engine: ${Math.round(p.progress * 100)}%\n\nDownloading the secure AI model (~1GB) directly to your browser. This is a one-time setup. Once completed, the assistant will run instantly and remain fully offline. All data stays on your device.` }])
                    }
                })
                setWebEngine(e)
                setMessages([{ role: "ai", text: `Offline Engine Ready.\n\nThe local AI model has been successfully loaded in your browser. You are now running 100% offline and private in ${DOMAINS[domain].label} mode. How can I assist you today?` }])
            }
        }
        init()
    }, [])

    async function send() {
        if (!input.trim() || engine === "checking") return
        const userMsg = input
        setInput("")
        setMessages(prev => [...prev, { role: "user", text: userMsg }, { role: "ai", text: "" }])
        const sysPrompt = DOMAINS[domain].prompt

        if (engine === "ollama") {
            const res = await fetch("http://localhost:11434/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: "phi3:mini", messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userMsg }], stream: true })
            })
            const reader = res.body.getReader()
            let full = ""
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = new TextDecoder().decode(value)
                chunk.split("\n").forEach(line => {
                    if (!line) return
                    try { const j = JSON.parse(line); full += j.message?.content || ""; setMessages(p => { const a = [...p]; a[a.length - 1].text = full; return a }) } catch { }
                })
            }
        } else {
            const chunks = await webEngine.chat.completions.create({
                messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userMsg }], stream: true
            })
            let full = ""
            for await (const chunk of chunks) {
                full += chunk.choices[0]?.delta?.content || ""
                setMessages(p => { const a = [...p]; a[a.length - 1].text = full; return a })
            }
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif', background: '#f5f5f7' }}>
            <div style={{ width: 280, background: 'white', borderRight: '1px solid #eee', padding: 20, display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>Omni-Assist</h1>
                <p style={{ fontSize: 11, color: '#666', marginTop: 6, fontWeight: 500 }}>
                    {engine === "ollama"? "⚡ Ollama - High-Performance Desktop" : engine === "webllm"? "🌐 WebLLM - Secure Browser Engine" : "Initializing..."}
                </p>
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(DOMAINS).map(([k, v]) => (
                        <button key={k} onClick={() => setDomain(k)} style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 12, border: domain === k? '2px solid #2563eb' : '1px solid #eee', background: domain === k? '#eff6ff' : 'white', cursor: 'pointer', fontWeight: domain === k? 700 : 400 }}>{DOMAIN_ICONS[k]} {v.label}</button>
                    ))}
                </div>
                <button onClick={() => setMessages([{ role: "ai", text: `Omni-Assist is now in ${DOMAINS[domain].label} mode. How can I help you today?` }])} style={{ marginTop: 20, background: 'black', color: 'white', border: 'none', padding: 12, borderRadius: 999, cursor: 'pointer' }}>+ New Conversation</button>
                <div style={{ marginTop: 'auto', background: '#f0fdf4', padding: 12, borderRadius: 12, fontSize: 11, border: '1px solid #bbf7d0', color: '#166534', lineHeight: 1.5 }}>
                    <strong>🔒 100% Private & Offline</strong><br />No data leaves your device. Engine: {engine}
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 56, background: 'black', color: 'white', display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14, letterSpacing: 0.5 }}>OMNI-ASSIST • {DOMAINS[domain].label.toUpperCase()} • {engine.toUpperCase()}</div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user'? 'flex-end' : 'flex-start' }}>
                            <div style={{ maxWidth: '70%', padding: '14px 18px', borderRadius: 20, background: m.role === 'user'? '#2563eb' : 'white', color: m.role === 'user'? 'white' : 'black', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.text || "Thinking..."}</div>
                        </div>
                    ))}
                </div>
                <div style={{ padding: 16, background: 'white', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: 12, background: '#f3f4f6', borderRadius: 999, padding: '8px 16px' }}>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Ask anything in ${DOMAINS[domain].label}...`} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none' }} />
                        <button onClick={send} style={{ width: 40, height: 40, background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>↑</button>
                    </div>
                </div>
            </div>
        </div>
    )
}