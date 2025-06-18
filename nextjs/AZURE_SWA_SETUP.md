# Azure Static Web Apps Setup - With Next.js API Routes

## Overview
This project is configured for Azure Static Web Apps (SWA) with Next.js API routes support. The chat widget uses **real OpenAI integration** through server-side API routes.

## Configuration Changes

### Next.js Configuration (`next.config.js`)
- **Output mode**: Default (not export) - Enables API routes
- **Trailing slash**: Enabled for better Azure SWA compatibility
- **Images**: Standard configuration

### Chat Widget Implementation
The chat widget (`src/components/ChatWidget.tsx`) uses:
- **Real API integration** - Connects to `/api/chat` endpoint
- **OpenAI streaming** - Real-time AI responses with GPT-4o-mini
- **Security features** - Comprehensive prompt injection protection
- **Full Patoekipa knowledge** - Extensive system prompt with team info

### Azure SWA Workflow (`.github/workflows/`)
- **Build output**: Empty (Next.js handles build detection)
- **API support**: Next.js API routes enabled
- **Skip API build**: True (using Next.js API routes)

## API Features

### Real OpenAI Integration
- **Model**: GPT-4o-mini for fast, intelligent responses
- **Streaming**: Real-time response generation
- **Security**: Multi-layer prompt injection protection
- **Knowledge**: Comprehensive Patoekipa team, project, and service information

### Security Features
1. **Direct Instruction Detection**: Prevents prompt manipulation
2. **Role-Playing Prevention**: Blocks attempts to change AI behavior
3. **Jailbreak Protection**: Detects and blocks bypass attempts
4. **Encoding Bypass Prevention**: Prevents encoded instruction injection
5. **Topic Relevance**: Ensures conversations stay Patoekipa-focused

### Response Categories
1. **Team Information** - Details about all 4 team members
2. **Project Portfolio** - Commercial and hobby projects
3. **Services** - Complete IT service offerings
4. **Technologies** - Full technology stack
5. **Contact** - How to reach and work with the team

## Environment Variables

### Required for Production
- `OPENAI_API_KEY` - Your OpenAI API key (starts with `sk-`)

### Demo Mode
Without a valid API key, the system returns:
```json
{
  "error": "Demo mode - brak klucza API. Skontaktuj się z zespołem Patoekipa dla pełnej funkcjonalności.",
  "demo": true
}
```

## Deployment

### Azure SWA Configuration
Set environment variables in Azure Portal:
1. Go to your Static Web App in Azure Portal
2. Navigate to Configuration → Environment variables
3. Add `OPENAI_API_KEY` with your OpenAI API key

### Build Process
1. `npm run build` - Creates Next.js build with API routes
2. Azure SWA automatically detects and deploys the application
3. API routes are available at `/api/*` endpoints
4. Real-time streaming responses work automatically

## Testing

### Local Development
```bash
# Set up environment
cp env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run development server
npm run dev

# Test the chat widget at http://localhost:3000
```

### Production Testing
```bash
# Build for production
npm run build

# Start production server
npm start

# Test API endpoint directly
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Cześć!"}]}'
```

## Example Interactions

### Greeting
**User**: "Cześć!"
**AI**: Detailed welcome message with conversation options

### Team Questions
**User**: "Kto jest w zespole?"
**AI**: Complete information about all 4 team members with roles and technologies

### Project Questions
**User**: "Jakie projekty realizujecie?"
**AI**: Detailed list of commercial and hobby projects with descriptions

### Technology Questions
**User**: "Jakich technologii używacie?"
**AI**: Comprehensive technology stack organized by category

### Contact Questions
**User**: "Jak mogę się z wami skontaktować?"
**AI**: All contact information and collaboration details

## Troubleshooting

### 405 Method Not Allowed
- Ensure `next.config.js` does NOT have `output: 'export'`
- Verify Azure SWA routing includes `/api/*` routes
- Check that API route file exists at `src/app/api/chat/route.ts`

### Chat Widget Not Responding
- Check browser console for errors
- Verify `OPENAI_API_KEY` is set in Azure SWA environment variables
- Test API endpoint directly with curl

### Build Failures
- Ensure all dependencies are in `package.json`
- Check TypeScript compilation errors
- Verify Next.js configuration is valid

### Streaming Issues
- Check network tab for SSE connection
- Verify Content-Type headers are correct
- Ensure no proxy/firewall blocking streaming

## Benefits of Real Integration

✅ **Intelligent Responses** - Powered by GPT-4o-mini  
✅ **Real-time Streaming** - Natural conversation flow  
✅ **Security Protected** - Multi-layer prompt injection prevention  
✅ **Comprehensive Knowledge** - Full Patoekipa information  
✅ **Professional Quality** - Production-ready implementation  
✅ **Scalable Architecture** - Ready for high traffic  

## Future Enhancements

- **Analytics**: Track conversation patterns and user interests
- **Multilingual**: Add English language support
- **Voice**: Integrate speech-to-text and text-to-speech
- **Memory**: Add conversation context persistence
- **Integration**: Connect with CRM systems for lead tracking

The current implementation provides a professional, secure, and intelligent chat experience that represents the Patoekipa team effectively. 