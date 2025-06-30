import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get all relevant headers
    const headers: Record<string, string | null> = {};
    
    // Azure App Service authentication headers
    const authHeaders = [
      'x-ms-client-principal',
      'x-ms-client-principal-name',
      'x-ms-client-principal-id',
      'x-ms-client-principal-idp',
      'cookie',
      'authorization',
      'host',
      'x-forwarded-proto',
      'x-forwarded-for',
      'user-agent'
    ];

    authHeaders.forEach(header => {
      headers[header] = request.headers.get(header);
    });

    // Try to decode x-ms-client-principal if available
    let decodedPrincipal = null;
    const principalHeader = request.headers.get('x-ms-client-principal');
    if (principalHeader) {
      try {
        decodedPrincipal = JSON.parse(Buffer.from(principalHeader, 'base64').toString());
      } catch (error) {
        decodedPrincipal = { error: 'Failed to decode', message: (error as Error).message };
      }
    }

    // Try to call /.auth/me endpoint
    let authMeData = null;
    try {
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      const host = request.headers.get('host');
      const baseUrl = `${protocol}://${host}`;
      
      const authResponse = await fetch(`${baseUrl}/.auth/me`, {
        headers: {
          'Cookie': request.headers.get('Cookie') || '',
          'User-Agent': request.headers.get('User-Agent') || 'NextJS-Debug'
        }
      });

      if (authResponse.ok) {
        const responseText = await authResponse.text();
        if (responseText.trim()) {
          authMeData = JSON.parse(responseText);
        }
      } else {
        authMeData = { error: `HTTP ${authResponse.status}`, statusText: authResponse.statusText };
      }
    } catch (error) {
      authMeData = { error: 'Fetch failed', message: (error as Error).message };
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      requestUrl: request.url,
      headers,
      decodedPrincipal,
      authMeEndpoint: authMeData,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasCosmosConfig: !!(process.env.COSMOS_DB_ENDPOINT && process.env.COSMOS_DB_KEY),
        hasAzureStorageConfig: !!(process.env.AZURE_STORAGE_ACCOUNT_NAME && process.env.AZURE_STORAGE_ACCOUNT_KEY)
      }
    });

  } catch (error) {
    console.error('Debug auth error:', error);
    
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 