import { NextRequest, NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if Azure Storage is configured
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    
    if (!accountName || !accountKey) {
      return NextResponse.json({
        success: false,
        status: 'not_configured',
        message: 'Azure Storage credentials not configured',
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }

    // Basic configuration check (without actually connecting)
    return NextResponse.json({
      success: true,
      status: 'configured',
      message: 'Azure Storage credentials are configured',
      data: {
        storageAccount: accountName,
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'avatars',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Storage health check error:', error);
    
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 