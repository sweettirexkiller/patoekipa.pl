const { app } = require('@azure/functions');

app.http('chat', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Chat function called');
        
        // Handle CORS
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: corsHeaders
            };
        }

        if (request.method === 'GET') {
            return {
                status: 200,
                headers: corsHeaders,
                jsonBody: {
                    message: 'Chat API is working! Use POST to send messages.',
                    timestamp: new Date().toISOString()
                }
            };
        }

        if (request.method === 'POST') {
            try {
                const body = await request.text();
                let requestData;
                
                try {
                    requestData = JSON.parse(body);
                } catch (parseError) {
                    return {
                        status: 400,
                        headers: corsHeaders,
                        jsonBody: { error: 'Invalid JSON in request body' }
                    };
                }

                const { messages } = requestData;

                if (!messages || !Array.isArray(messages)) {
                    return {
                        status: 400,
                        headers: corsHeaders,
                        jsonBody: { error: 'Messages array is required' }
                    };
                }

                // For now, return a mock response since OpenAI might be causing issues
                const mockResponse = `Dziękuję za wiadomość! 🤖\n\nJestem asystentem AI zespołu **Patoekipa**.\n\n### Otrzymałem twoją wiadomość:\n"${messages[messages.length - 1]?.content || 'brak treści'}"\n\n### Co mogę robić:\n- ✅ Odpowiadać na pytania o usługi Patoekipa\n- ✅ Pomagać w wyborze technologii\n- ✅ Udzielać porad technicznych\n\nSkontaktuj się z zespołem na hello@patoekipa.pl 🚀`;

                // Return as streaming format expected by the frontend
                const streamingResponse = `data: ${JSON.stringify({ content: mockResponse })}\n\ndata: [DONE]\n\n`;

                return {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'text/plain; charset=utf-8',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    },
                    body: streamingResponse
                };

            } catch (error) {
                context.log('Error processing chat request:', error);
                return {
                    status: 500,
                    headers: corsHeaders,
                    jsonBody: { error: 'Internal server error' }
                };
            }
        }

        return {
            status: 405,
            headers: corsHeaders,
            jsonBody: { error: 'Method not allowed' }
        };
    }
}); 