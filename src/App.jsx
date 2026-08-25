import { useState } from "react"

export default function App() {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I'm your Banking AI assistant (phi3:mini). Offline, secure, and fast. How can I help?" }
    ])

    async function send() {
        if (!input.trim()) return
        const userMsg = input
        setInput("")
        setMessages(prev => [...prev, { role: "user", text: userMsg }, { role: "ai", text: "" }])

        const res = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "phi3:mini",
                messages: [{ role: "user", content: userMsg }],
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
    }

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#f5f5f7' }}>
            <div style={{ width: 280, background: 'white', borderRight: '1px solid #eee', padding: 20, display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontWeight: 800, fontSize: 22 }}>Banking AI</h1>
                <button style={{ marginTop: 20, background: '#2563eb', color: 'white', border: 'none', padding: 12, borderRadius: 999 }}>+ New Chat</button>
                <div style={{ marginTop: 'auto', background: '#eff6ff', padding: 12, borderRadius: 12, fontSize: 12 }}>🔒 Offline • Fast Mode</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 56, background: 'black', color: 'white', display: 'flex', alignItems: 'center', padding: '0 24px' }}>Premium • phi3:mini (Fast)</div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ maxWidth: '70%', padding: '14px 18px', borderRadius: 20, background: m.role === 'user' ? '#2563eb' : 'white', color: m.role === 'user' ? 'white' : 'black', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', whiteSpace: 'pre-wrap' }}>{m.text || "..."}</div>
                        </div>
                    ))}
                </div>
                <div style={{ padding: 16, background: 'white', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: 12, background: '#f3f4f6', borderRadius: 999, padding: '8px 16px', alignItems: 'center' }}>
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask something..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none' }} />
                        <button onClick={send} style={{ width: 40, height: 40, background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>↑</button>
                    </div>
                </div>
            </div>
        </div>
    )
}