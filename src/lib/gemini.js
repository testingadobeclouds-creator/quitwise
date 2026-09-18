import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

let genAI = null
let model = null

function getModel() {
  if (!model) {
    if (!API_KEY || API_KEY === 'PASTE_YOUR_GEMINI_KEY_HERE') {
      throw new Error('GEMINI_KEY_MISSING')
    }
    genAI = new GoogleGenerativeAI(API_KEY)
    model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: `You are QuitWise AI, a compassionate and professional addiction recovery counselor. 

Your role is to:
- Provide empathetic, non-judgmental support to people recovering from addictions (alcohol, tobacco, drugs, gambling, gaming, social media).
- Offer practical coping strategies and evidence-based techniques for managing cravings.
- Guide breathing exercises, mindfulness, and grounding techniques when needed.
- Celebrate the user's progress and milestones warmly.
- Gently encourage seeking professional help for serious situations.
- Keep responses concise (2-4 paragraphs max) and warm in tone.
- NEVER provide medical dosage advice or encourage any addictive behavior.
- If someone is in crisis, always provide emergency hotline: iCall (India): 9152987821 or 911 for emergencies.
Always end with a short motivational line or affirmation.`,
    })
  }
  return model
}

/**
 * Send a message and get a streaming response.
 * @param {Array<{role: string, parts: string}>} history - Chat history
 * @param {string} message - Latest user message
 * @param {function} onChunk - Called with each streamed text chunk
 */
export async function sendChatMessage(history, message, onChunk) {
  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
  ]
  let lastError = null




  if (!API_KEY || API_KEY === 'PASTE_YOUR_GEMINI_KEY_HERE') {
    throw new Error('GEMINI_KEY_MISSING')
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY)
  }

  for (const modelName of modelsToTry) {
    try {
      const m = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: `You are QuitWise AI, a compassionate and professional addiction recovery counselor. 
Your role is to:
- Provide empathetic, non-judgmental support to people recovering from addictions (alcohol, tobacco, drugs, gambling, gaming, social media).
- Offer practical coping strategies and evidence-based techniques for managing cravings.
- Guide breathing exercises, mindfulness, and grounding techniques when needed.
- Celebrate the user's progress and milestones warmly.
- Gently encourage seeking professional help for serious situations.
- Keep responses concise (2-4 paragraphs max) and warm in tone.
- NEVER provide medical dosage advice or encourage any addictive behavior.
- If someone is in crisis, always provide emergency hotline: iCall (India): 9152987821 or 911 for emergencies.
Always end with a short motivational line or affirmation.`,
      })

      const chat = m.startChat({
        history: history.map(h => ({
          role: h.role,
          parts: [{ text: h.text }],
        })),
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.75,
        },
      })

      const result = await chat.sendMessageStream(message)
      let full = ''
      for await (const chunk of result.stream) {
        const text = chunk.text()
        full += text
        onChunk(text)
      }
      return full
    } catch (err) {
      lastError = err
      console.warn(`Model ${modelName} failed, trying next fallback:`, err.message)
    }
  }

  throw lastError || new Error('Could not connect to Gemini AI services.')
}


/** Simple one-shot prompt (for daily tips, quotes, etc.) */
export async function generateText(prompt) {
  const m = getModel()
  const result = await m.generateContent(prompt)
  return result.response.text()
}
