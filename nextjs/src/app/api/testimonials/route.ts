import { NextRequest, NextResponse } from 'next/server';
import { cosmosOperations } from '@/lib/cosmos';
import { Testimonial } from '@/lib/database-schema';
import { nanoid } from 'nanoid';
import { verifyAuth, createAuthResponse } from '@/lib/auth';

// GET - Retrieve testimonials with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const approved = searchParams.get('approved') !== 'false'; // Default to approved only
    const projectId = searchParams.get('projectId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let query = 'SELECT * FROM c WHERE c.type = "testimonial"';
    const parameters: any[] = [];

    if (approved) {
      query += ' AND c.approved = true';
    }

    if (featured) {
      query += ' AND c.featured = true';
    }

    if (projectId) {
      query += ' AND c.projectId = @projectId';
      parameters.push({ name: '@projectId', value: projectId });
    }

    query += ' ORDER BY c.createdAt DESC';

    const result = await cosmosOperations.queryDocuments(query, parameters);
    
    if (result.success) {
      let data = result.data || [];
      
      // Apply limit if specified
      if (limit && limit > 0) {
        data = data.slice(0, limit);
      }

      return NextResponse.json({
        success: true,
        data,
        count: data.length,
        total: result.data?.length || 0
      });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'role', 'company', 'content', 'rating'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const testimonial: Testimonial = {
      id: body.id || nanoid(),
      type: 'testimonial',
      createdAt: new Date().toISOString(),
      name: body.name,
      role: body.role,
      company: body.company,
      content: body.content,
      rating: body.rating,
      avatar: body.avatar || '👤',
      
      projectId: body.projectId,
      clientEmail: body.clientEmail,
      clientLinkedIn: body.clientLinkedIn,
      testimonialDate: body.testimonialDate || new Date().toISOString(),
      
      featured: body.featured || false,
      approved: body.approved !== undefined ? body.approved : false, // Default to not approved
      displayOrder: body.displayOrder || 999,
      
      verified: body.verified || false,
      verificationMethod: body.verificationMethod,
      
      source: body.source || 'website_form',
      language: body.language || 'pl',
    };

    const result = await cosmosOperations.createDocument(testimonial);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a testimonial
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
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    // Get existing testimonial
    const existingResult = await cosmosOperations.readDocument(id);
    if (!existingResult.success) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const updatedTestimonial: Testimonial = {
      ...existingResult.data,
      ...updateData,
      id,
      updatedAt: new Date().toISOString(),
    };

    const result = await cosmosOperations.updateDocument(id, updatedTestimonial);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a testimonial
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
        { success: false, error: 'Testimonial ID is required' },
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
    console.error('Error in DELETE /api/testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 