# Azure Static Web Apps Setup - With Next.js API Routes

## Overview
This project is configured for Azure Static Web Apps (SWA) with Next.js API routes support. The chat widget uses real OpenAI integration through server-side API routes.

## Configuration Changes

### Next.js Configuration (`next.config.js`)
- **Output mode**: Default (not export) - Enables API routes
- **Trailing slash**: Enabled for better Azure SWA compatibility
- **Images**: Standard configuration

### Chat Widget Implementation
The chat widget (`src/components/ChatWidget.tsx`) uses:
- **Real API integration** - Connects to `/api/chat` endpoint
- **OpenAI streaming** - Real-time AI responses
- **Security features** - Prompt injection protection
- **Full Patoekipa knowledge** - Comprehensive system prompt

### Azure SWA Workflow (`.github/workflows/`)
- **Build output**: Empty (Next.js handles build)
- **API support**: Next.js API routes enabled
- **Skip API build**: True (using Next.js API routes)

## Chat Widget Features

### Response Categories
1. **Greetings** - Welcome messages
2. **Team information** - Details about Patoekipa members
3. **Projects** - Portfolio and project descriptions
4. **Services** - IT services offered
5. **Technologies** - Tech stack information
6. **Contact** - How to reach the team

### Example Interactions
- "Cześć!" → Welcome message with options
- "Kto jest w zespole?" → Team member details
- "Jakie projekty realizujecie?" → Project portfolio
- "Jakie technologie używacie?" → Technology stack
- "Jak się z wami skontaktować?" → Contact information

## Deployment

### Environment Variables
**Required for full functionality:**
- `OPENAI_API_KEY` - Your OpenAI API key (starts with `sk-`)

**Without API key:**
- Chat widget shows demo mode with mock responses

### Build Process
1. `npm run build` - Creates Next.js build with API routes
2. Azure SWA automatically deploys the full Next.js application
3. API routes are available at `/api/*` endpoints
4. Set `OPENAI_API_KEY` in Azure SWA environment variables

## Future Enhancements

### For Production Use
To upgrade to real AI responses:
1. **Upgrade to paid Azure SWA tier** - Enables Azure Functions
2. **Add OpenAI integration** - Server-side API with real AI
3. **Environment variables** - `OPENAI_API_KEY` configuration

### Alternative Approaches
1. **External API service** - Third-party backend
2. **Client-side OpenAI** - Direct browser integration (not recommended for production)
3. **Hybrid approach** - Static site + external serverless functions

## Benefits of Current Setup
- ✅ **Real AI responses** - Powered by OpenAI GPT-4o-mini
- ✅ **Server-side security** - Prompt injection protection
- ✅ **Streaming responses** - Real-time chat experience
- ✅ **Azure SWA integration** - Native Next.js API routes support
- ✅ **Comprehensive knowledge** - Full Patoekipa information
- ✅ **Professional responses** - Context-aware AI assistant

## Testing Locally
```bash
# Set up environment
cp env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run development server
npm run dev

# Or test production build
npm run build
npm start
```

The chat widget will connect to the real OpenAI API when properly configured. 