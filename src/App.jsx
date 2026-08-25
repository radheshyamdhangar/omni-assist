import { useState } from "react"

const DOMAINS = {
    general: { label: "General 💬", icon: "💬", prompt: "You are Omni-Assist, a helpful, private offline AI for everything." },
    banking: { label: "Banking 🏦", icon: "🏦", prompt: "You are an expert banking assistant. Help with UPI, loans, fraud, finance in simple Hinglish." },
    study: { label: "Study 📚", icon: "📚", prompt: "You are a helpful tutor Sathi. Explain topics simply in Hindi + English with examples." },
    coding: { label: "Coding 💻", icon: "💻", prompt: "You are a senior developer. Write clean, commented code and explain it." },
    health: { label: "Health 🩺", icon: "🩺", prompt: "You are a wellness guide. Give general health info only, not medical diagnosis. Be safe." },
}

export default function App() {
    const [domain, setDomain] = useState("general")
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([
        { role: "ai", text: `Hello! I'm Omni-Assist 🚀 - Your offline AI Sathi.\n\nSelect a domain from left: Banking, Study, Coding, Health. How can I help?` }
    ])

    async function send() {
        if (!input.trim()) return
        const userMsg = input
        setInput("")
        setMessages(prev => [...prev, { role: "user", text: userMsg }, { role: "ai", text: "" }])

        // System prompt domain ke hisab se
        const systemPrompt = DOMAINS[domain].prompt

        try {
            const res = await fetch("http://localhost:11434/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "phi3:mini", // ya llama3.2:1b
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userMsg }
                    ],
                    stream: true
                })
            })

            const reader = res.body.getReader()
            let fullText = ""
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = new TextDecoder().decode(value)
                chunk.split("\n").forEach(line => {
                    if (!line) return
                    try {
                        const j = JSON.parse(line)
                        fullText += j.message?.content || ""
                        setMessages(prev => {
                            const arr = [...prev]
                            arr[arr.length - 1].text = fullText
                            return arr
                        })
                    } catch {}
                })
            }
        } catch (e) {
            setMessages(prev => {
                const arr = [...prev]
                arr[arr.length - 1].text = "❌ Ollama running nahi hai. Terminal me `ollama serve` aur `ollama pull phi3:mini` chalao."
                return arr
            })
        }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif', background: '#f5f5f7' }}>
            <div style={{ width: 280, background: 'white', borderRight: '1px solid #eee', padding: 20, display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>Omni-Assist 🚀</h1>
                <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>One AI for Everything</p>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.keys(DOMAINS).map(key => (
                        <button
                            key={key}
                            onClick={() => setDomain(key)}
                            style={{
                                textAlign: 'left', padding: '10px 14px', borderRadius: 12, border: domain === key? '2px solid #2563eb' : '1px solid #eee',
                                background: domain === key? '#eff6ff' : 'white', cursor: 'pointer', fontWeight: domain === key? 700 : 400
                            }}>
                            {DOMAINS[key].label}
                        </button>
                    ))}
                </div>

                <button onClick={() => setMessages([{ role: "ai", text: `Hello! I'm Omni-Assist in ${DOMAINS[domain].label} mode. How can I help?` }])} style={{ marginTop: 20, background: 'black', color: 'white', border: 'none', padding: 12, borderRadius: 999, cursor: 'pointer' }}>+ New Chat</button>

                <div style={{ marginTop: 'auto', background: '#f0fdf4', padding: 12, borderRadius: 12, fontSize: 11, border: '1px solid #bbf7d0' }}>
                    🔒 Offline • {DOMAINS[domain].label} Mode<br/>⚡ phi3:mini
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 56, background: 'black', color: 'white', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
                    <span>Omni • {DOMAINS[domain].label}</span>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>Private & Offline</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user'? 'flex-end' : 'flex-start' }}>
                            <div style={{ maxWidth: '70%', padding: '14px 18px', borderRadius: 20, background: m.role === 'user'? '#2563eb' : 'white', color: m.role === 'user'? 'white' : 'black', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', whiteSpace: 'pre-wrap' }}>{m.text || "..."}</div>
                        </div>
                    ))}
                </div>
                <div style={{ padding: 16, background: 'white', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: 12, background: '#f3f4f6', borderRadius: 999, padding: '8px 16px', alignItems: 'center' }}>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Ask anything in ${DOMAINS[domain].label}...`} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14 }} />
                        <button onClick={send} style={{ width: 40, height: 40, background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>↑</button>
                    </div>
                </div>
            </div>
        </div>
    )
}