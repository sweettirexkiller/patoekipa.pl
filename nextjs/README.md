# Patoekipa Portfolio - Next.js

Modern web application version of the Patoekipa portfolio built with Next.js, React 19, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local and add your OpenAI API key

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Environment Variables

Create a `.env.local` file in the root directory and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                # App Router (Next.js 13+)
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable React components
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

## 🎨 Styling

This project uses **Tailwind CSS v4** for styling:
- Utility-first CSS framework
- Responsive design
- Dark mode support
- Custom design system

## 🖼️ Assets

This project uses shared assets from `../shared/assets/`. To use images in Next.js:

```tsx
import Image from 'next/image'

// For shared assets
<Image 
  src="/shared/assets/logo.png" 
  alt="Logo" 
  width={200} 
  height={100} 
/>
```

## 🔧 Development

- Follow React best practices
- Use TypeScript for type safety
- Implement responsive design
- Optimize for SEO
- Keep shared assets in sync

## ⚡ Features

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ TypeScript support
- ✅ Tailwind CSS
- ✅ ESLint configuration
- ✅ Responsive design
- ✅ SEO optimization
- ✅ AI-powered chat widget with OpenAI integration
- ✅ Real-time streaming responses
- ✅ Professional AI assistant for Patoekipa services

## 📦 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
