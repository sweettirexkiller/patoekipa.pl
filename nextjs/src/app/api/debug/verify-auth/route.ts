import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG: Starting verifyAuth test ===');
    
    const authResult = await verifyAuth(request);
    
    console.log('=== DEBUG: verifyAuth result ===', JSON.stringify(authResult, null, 2));
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authResult,
      requestHeaders: {
        'x-ms-client-principal': !!request.headers.get('x-ms-client-principal'),
        'x-ms-client-principal-name': request.headers.get('x-ms-client-principal-name'),
        'x-ms-client-principal-id': request.headers.get('x-ms-client-principal-id'),
        'cookie': !!request.headers.get('cookie'),
        'host': request.headers.get('host')
      }
    });

  } catch (error) {
    console.error('Debug verify auth error:', error);
    
    return NextResponse.json({
      error: 'Debug verify auth failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 