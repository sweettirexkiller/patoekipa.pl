import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'test_key',
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Add system message to provide context about Patoekipa
    const systemMessage = {
      role: 'system' as const,
      content: `Jesteś asystentem AI zespołu Patoekipa - polskiej firmy specjalizującej się w tworzeniu nowoczesnych aplikacji webowych, mobilnych i systemów. 

Patoekipa oferuje:
- Tworzenie aplikacji webowych (React, Next.js, Vue.js)
- Aplikacje mobilne (Flutter, React Native)
- Systemy backend (Node.js, Python, Java)
- Rozwiązania AI i Machine Learning
- Konsultacje techniczne i architektura systemów
- DevOps i wdrożenia w chmurze

Zespół składa się z doświadczonych programistów: Michała, Piotra, Tomasza i Anny.

Odpowiadaj profesjonalnie, pomocnie i w języku polskim. Jeśli użytkownik pyta o usługi, ceny lub szczegóły projektów, zaproponuj mu kontakt z zespołem przez formularz na stronie lub bezpośrednio.

Bądź konkretny i merytoryczny, ale zachowaj przyjazny ton. Jeśli nie znasz odpowiedzi na pytanie techniczne, przyznaj się do tego i zasugeruj konsultację z ekspertami zespołu.`
    }

    const allMessages = [systemMessage, ...messages]

    console.log('GEkkiiiii');
    console.log(process.env.OPENAI_API_KEY);

    // Check if we have a real API key (starts with sk-)
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'test_key_for_development' || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
      // Return a mock streaming response for testing
      const encoder = new TextEncoder()
      const mockResponse = "Dziękuję za wiadomość! 🤖\n\nJestem asystentem AI zespołu **Patoekipa**. Obecnie działam w trybie demonstracyjnym.\n\nAby w pełni korzystać z moich możliwości, zespół musi skonfigurować prawdziwy klucz API OpenAI.\n\n### Co mogę robić:\n- ✅ Odpowiadać na pytania o usługi Patoekipa\n- ✅ Pomagać w wyborze technologii\n- ✅ Udzielać porad technicznych\n- ✅ Formatować odpowiedzi w **Markdown**\n\n```javascript\n// Przykład kodu\nconsole.log('Witaj w Patoekipa!');\n```\n\nSkontaktuj się z zespołem, aby uzyskać pełną funkcjonalność! 🚀"
      
      const readable = new ReadableStream({
        async start(controller) {
          // Simulate streaming by sending chunks
          const words = mockResponse.split(' ')
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? words[i] : ' ' + words[i])
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`
            controller.enqueue(encoder.encode(data))
            // Add small delay to simulate real streaming
            await new Promise(resolve => setTimeout(resolve, 50))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: allMessages,
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    })

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              const data = `data: ${JSON.stringify({ content })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          // Send end signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 