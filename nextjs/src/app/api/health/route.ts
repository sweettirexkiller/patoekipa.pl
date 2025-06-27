import { NextResponse } from 'next/server';

export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      WEBSITES_PORT: process.env.WEBSITES_PORT,
      HOSTNAME: process.env.HOSTNAME,
    },
    version: process.env.npm_package_version || 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };

  return NextResponse.json(healthData, { status: 200 });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
} 