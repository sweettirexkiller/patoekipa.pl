# Azure Static Web Apps Setup - Next.js with AI Integration

## Overview
This project is configured for Azure Static Web Apps (SWA) with Next.js API routes and real OpenAI integration. The configuration follows the hybrid architecture pattern that allows static frontend assets with server-side API functionality.

## Key Configuration Changes

### 1. **Azure SWA Platform Configuration** (`staticwebapp.config.json`)

**Critical Addition**: Node.js 18 runtime support for AI processing:

```json
{
  "platform": {
    "apiRuntime": "node:18"
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/_next/static/*",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

**Why This Matters**: Without `"apiRuntime": "node:18"`, Azure SWA cannot execute Next.js API routes that require Node.js runtime for AI processing.

### 2. **Next.js Configuration** (`next.config.js`)

**Hybrid Mode Configuration**:
```javascript
const nextConfig = {
  // For Azure Static Web Apps with API routes - hybrid mode
  trailingSlash: true,
  
  images: {
    unoptimized: true, // Optimize for static hosting
  },

  // Disable static export due to API routes and AI functionality
  // output: 'export',  // <-- This MUST be commented out or removed
  
  // Optimize for Azure Static Web Apps
  poweredByHeader: false,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

**Critical**: `output: 'export'` **MUST NOT** be used when you have API routes. This was the main cause of build failures.

### 3. **GitHub Actions Workflow Configuration**

**Proper Build Configuration**:
```yaml
- name: Build And Deploy
  with:
    app_location: "/nextjs"
    api_location: "" # Next.js handles API routes internally
    output_location: "" # Let Azure handle Next.js hybrid deployment automatically
    app_build_command: "npm run build" # Explicit build command
  env:
    # Environment variables for build and runtime
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    NODE_ENV: production
```

**Key Points**:
- `output_location: ""` - Let Azure auto-detect Next.js build output
- `app_build_command: "npm run build"` - Explicit build command prevents ambiguity
- Environment variables passed to both build and runtime

## Architecture Analysis (Based on Working Example)

### **Hybrid Deployment Model**
```
┌─ Static Assets ─┐    ┌─ API Routes (Node.js) ─┐
│ HTML, CSS, JS   │    │ /api/chat              │
│ Images, Fonts   │    │ OpenAI Integration     │
│ _next/static/*  │    │ Server-side Logic      │
└─ Served from CDN ┘   └─ Runs on Node.js 18   ┘
```

### **Request Flow**
1. **Static Requests**: `/_next/static/*`, images → Served from CDN
2. **API Requests**: `/api/chat` → Routed to Node.js runtime
3. **Page Requests**: `/`, `/about` → Static HTML with hydration

### **Build Process**
1. **Next.js Build**: Creates both static assets and API functions
2. **Azure Detection**: Automatically detects `.next` folder structure
3. **Deployment**: Static assets to CDN, API routes to Node.js runtime

## Environment Variables Setup

### **Required Secrets in GitHub Repository**:
```bash
OPENAI_API_KEY=sk-proj-...                    # OpenAI API authentication
AZURE_STATIC_WEB_APPS_API_TOKEN_*=...         # Azure deployment token
```

### **Local Development** (`.env.local`):
```bash
OPENAI_API_KEY=sk-proj-...
NODE_ENV=development
```

## API Route Implementation

### **Endpoint Structure** (`src/app/api/chat/route.ts`):
```typescript
export async function POST(req: NextRequest) {
  // 1. Input validation and security checks
  // 2. OpenAI API integration with streaming
  // 3. Error handling and response formatting
  // 4. Conversation state management
}
```

### **Frontend Integration** (`ChatWidget.tsx`):
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [...] })
});
```

## Troubleshooting Common Issues

### **"Unknown exception has occurred"**
**Cause**: Missing `"apiRuntime": "node:18"` in `staticwebapp.config.json`
**Solution**: Add platform configuration for Node.js runtime

### **"405 Method Not Allowed"**
**Cause**: `output: 'export'` in `next.config.js` disables API routes
**Solution**: Remove or comment out the export configuration

### **Build Artifacts Detection Issues**
**Cause**: Incorrect `output_location` configuration
**Solution**: Set `output_location: ""` to let Azure auto-detect

### **Environment Variable Issues**
**Cause**: Missing environment variables in GitHub secrets or Azure configuration
**Solution**: Verify all required secrets are set in GitHub repository settings

## Deployment Verification

### **Successful Build Indicators**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    69.2 kB         156 kB
├ ○ /_not-found                          877 B          88.2 kB
└ ƒ /api/chat                            0 B                0 B    # ← API route detected
```

### **Test API Endpoint**:
```bash
curl -X POST https://your-app.azurestaticapps.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

## Key Differences from Static Export

| Aspect | Static Export | Hybrid (Our Setup) |
|--------|---------------|-------------------|
| **API Routes** | ❌ Not supported | ✅ Full support |
| **Server Functions** | ❌ Disabled | ✅ Node.js runtime |
| **Build Output** | Static files only | Static + Server functions |
| **Deployment** | CDN only | CDN + Compute |
| **AI Integration** | ❌ Client-side only | ✅ Server-side processing |

## Benefits of This Architecture

✅ **Real AI Integration** - Server-side OpenAI processing  
✅ **Security** - API keys protected on server-side  
✅ **Performance** - Static assets from CDN, dynamic processing on-demand  
✅ **Scalability** - Automatic scaling for both static and compute resources  
✅ **Cost Efficiency** - Pay only for compute usage, static assets served efficiently  

The configuration now matches the working pattern from your successful implementation and should resolve the Azure SWA build failures. 