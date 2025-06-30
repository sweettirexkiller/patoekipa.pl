import { NextRequest, NextResponse } from 'next/server';
import { cosmosOperations, testConnection } from '@/lib/cosmos';
import { nanoid } from 'nanoid';
import { verifyAuth, createAuthResponse } from '@/lib/auth';

// GET - Retrieve all documents or test connection
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'test') {
      // Test database connection
      const result = await testConnection();
      return NextResponse.json(result);
    }

    // Get all documents
    const result = await cosmosOperations.getAllDocuments(100);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        count: result.data?.length || 0
      });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new document
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
    const body = await request.json();
    
    // Add ID and timestamp if not provided
    const document = {
      id: body.id || nanoid(),
      timestamp: new Date().toISOString(),
      ...body
    };

    const result = await cosmosOperations.createDocument(document);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing document
export async function PUT(request: NextRequest) {
  // Check admin authorization
  const auth = await verifyAuth(request);
  if (!auth.isAuthenticated) {
    return createAuthResponse('Authentication required');
  }
  if (!auth.isAuthorized) {
    return createAuthResponse('Admin access required', 403);
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Add updated timestamp
    const document = {
      id,
      updatedAt: new Date().toISOString(),
      ...updateData
    };

    const result = await cosmosOperations.updateDocument(id, document);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a document
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const result = await cosmosOperations.deleteDocument(id);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in DELETE /api/data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 