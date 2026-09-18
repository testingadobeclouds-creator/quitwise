import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../lib/gemini'
import { useAuth } from '../contexts/AuthContext'

const WELCOME = `Hello! I'm your QuitWise AI counselor 🌿

I'm here to support you 24/7 on your recovery journey. You can talk to me about:
• Managing cravings right now
• Breathing & mindfulness exercises
• Your progress and how you're feeling
• Strategies for avoiding triggers

**How are you feeling today?**`

export default function AIChat({ fullPage = false }) {
  const { user } = useAuth()
  const [open, setOpen]       = useState(fullPage)
  const [messages, setMessages] = useState([{ role: 'model', text: WELCOME }])
  const [input, setInput]     = useState('')
  const [sending, setSending] = useState(false)
  const [apiError, setApiError] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e?.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const userMsg = { role: 'user', text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setSending(true)
    setApiError(false)

    // Placeholder for streaming
    const aiPlaceholder = { role: 'model', text: '' }
    setMessages(m => [...m, aiPlaceholder])

    try {
      // Gemini API history must alternate and typically begin with 'user'
      const history = messages
        .filter(m => m.text && m.text !== WELCOME)
        .map(m => ({ role: m.role, text: m.text }))

      await sendChatMessage(history, text, (chunk) => {
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'model', text: copy[copy.length - 1].text + chunk }
          return copy
        })
      })
    } catch (err) {
      console.error('Gemini error:', err)
      if (err.message === 'GEMINI_KEY_MISSING') {
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = {
            role: 'model',
            text: '⚠️ AI chat requires a Gemini API key. Please verify `VITE_GEMINI_API_KEY` in your `.env` file.',
          }
          return copy
        })
        setApiError(true)
      } else {
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = {
            role: 'model',
            text: `⚠️ Error: ${err.message || 'I am having trouble connecting right now. Please try again.'}`,
          }
          return copy
        })
      }
    } finally {
      setSending(false)
    }
  }


  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) handleSend(e)
  }

  const chatContent = (
    <div className={`chat__window${fullPage ? ' chat__window--full' : ''}`}>
      {!fullPage && (
        <div className="chat__header">
          <div className="chat__header-left">
            <div className="chat__avatar">Q</div>
            <div>
              <div className="chat__name">QuitWise AI</div>
              <div className="chat__online">● Always online</div>
            </div>
          </div>
          <button className="chat__close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>
      )}

      <div className="chat__messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat__msg chat__msg--${m.role}`}>
            {m.role === 'model' && <div className="chat__msg-avatar">Q</div>}
            <div className="chat__bubble">
              <RenderMarkdown text={m.text} />
              {i === messages.length - 1 && sending && m.role === 'model' && (
                <span className="chat__cursor" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat__input-row" onSubmit={handleSend}>
        <textarea
          className="chat__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={user ? "Share how you're feeling…" : "Type a message… (Login to save history)"}
          rows={1}
          disabled={sending}
        />
        <button
          type="submit"
          className="chat__send-btn"
          disabled={!input.trim() || sending}
          aria-label="Send"
        >
          {sending ? '⏳' : '➤'}
        </button>
      </form>

      <p className="chat__disclaimer">
        QuitWise AI is not a substitute for professional medical care.
        Crisis? Call iCall: <strong>9152987821</strong>
      </p>
    </div>
  )

  if (fullPage) return chatContent

  return (
    <div className="chat__float">
      {open && chatContent}
      <button
        className={`chat__fab${open ? ' chat__fab--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle AI chat"
      >
        {open ? '✕' : '🤖'}
        {!open && <span className="chat__fab-label">AI Chat</span>}
      </button>
    </div>
  )
}

// Minimal markdown renderer (bold + line breaks)
function RenderMarkdown({ text }) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
    .replace(/^• /gm, '&bull; ')
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
