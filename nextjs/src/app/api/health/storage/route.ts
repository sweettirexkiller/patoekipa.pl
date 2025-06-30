import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { checkAzureStorageConnection, listAvatars } from '@/lib/azure-storage';

export async function GET(request: NextRequest) {
  // Check admin authorization
  const auth = await verifyAuth(request);
  if (!auth.isAuthenticated) {
    return createAuthResponse('Authentication required');
  }
  if (!auth.isAuthorized) {
    return createAuthResponse('Admin access required', 403);
  }

  try {
    const startTime = Date.now();
    
    // Test connection
    const isConnected = await checkAzureStorageConnection();
    const responseTime = Date.now() - startTime;
    
    if (isConnected) {
      // Get container info
      const avatars = await listAvatars();
      
      return NextResponse.json({
        success: true,
        status: 'healthy',
        data: {
          connected: true,
          responseTime: `${responseTime}ms`,
          avatarCount: avatars.length,
          containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'avatars',
          storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 'unhealthy',
        data: {
          connected: false,
          responseTime: `${responseTime}ms`,
          error: 'Unable to connect to Azure Storage',
          timestamp: new Date().toISOString()
        }
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Storage health check error:', error);
    
    return NextResponse.json({
      success: false,
      status: 'error',
      data: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
} 