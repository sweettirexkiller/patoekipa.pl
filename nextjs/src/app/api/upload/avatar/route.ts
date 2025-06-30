import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { uploadAvatarToBlob, deleteAvatarFromBlob } from '@/lib/azure-storage';
import { nanoid } from 'nanoid';

// Mark this route as dynamic since it uses request headers for auth and handles file uploads
export const dynamic = 'force-dynamic';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  // Check admin authorization
  const auth = await verifyAuth(request);
  if (!auth.isAuthenticated) {
    return createAuthResponse('Authentication required');
  }
  if (!auth.isAuthorized) {
    return createAuthResponse('Admin access required', 403);
  }

  try {
    // Check if Azure Storage is configured
    if (!process.env.AZURE_STORAGE_ACCOUNT_NAME || !process.env.AZURE_STORAGE_ACCOUNT_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Azure Storage not configured. Please contact administrator to set up file upload functionality.' 
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Generate unique filename
    const filename = `avatar-${nanoid()}.${extension}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Azure Blob Storage
    const uploadResult = await uploadAvatarToBlob(buffer, filename, file.type);
    
    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        avatarUrl: uploadResult.url,
        filename: uploadResult.filename,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    
    // Handle Azure Storage configuration errors
    if (error instanceof Error && error.message.includes('Azure Storage credentials')) {
      return NextResponse.json(
        { success: false, error: 'Azure Storage not configured. Please contact administrator.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

// DELETE - Remove avatar file
export async function DELETE(request: NextRequest) {
  // Check admin authorization
  const auth = await verifyAuth(request);
  if (!auth.isAuthenticated) {
    return createAuthResponse('Authentication required');
  }
  if (!auth.isAuthorized) {
    return createAuthResponse('Admin access required', 403);
  }

  try {
    // Check if Azure Storage is configured
    if (!process.env.AZURE_STORAGE_ACCOUNT_NAME || !process.env.AZURE_STORAGE_ACCOUNT_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Azure Storage not configured. Please contact administrator.' 
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteAvatarFromBlob(filename);
    
    if (deleted) {
      return NextResponse.json({
        success: true,
        message: 'Avatar deleted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete avatar' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error deleting avatar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete avatar' },
      { status: 500 }
    );
  }
} 