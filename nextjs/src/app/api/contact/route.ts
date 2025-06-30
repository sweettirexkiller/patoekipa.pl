import { NextRequest, NextResponse } from 'next/server';
import { cosmosOperations } from '@/lib/cosmos';
import { ContactMessage, CONTACT_STATUSES, PRIORITY_LEVELS, VALIDATION_RULES } from '@/lib/database-schema';
import { nanoid } from 'nanoid';
import { verifyAuth, createAuthResponse } from '@/lib/auth';

// GET - Retrieve contact messages (admin only)
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ContactMessage['status'];
    const priority = searchParams.get('priority') as ContactMessage['priority'];
    const assignedTo = searchParams.get('assignedTo');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let query = 'SELECT * FROM c WHERE c.type = "contact_message"';
    const parameters: any[] = [];

    if (status && CONTACT_STATUSES.includes(status)) {
      query += ' AND c.status = @status';
      parameters.push({ name: '@status', value: status });
    }

    if (priority && PRIORITY_LEVELS.includes(priority)) {
      query += ' AND c.priority = @priority';
      parameters.push({ name: '@priority', value: priority });
    }

    if (assignedTo) {
      query += ' AND c.assignedTo = @assignedTo';
      parameters.push({ name: '@assignedTo', value: assignedTo });
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
    console.error('Error in GET /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new contact message (from contact form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (!VALIDATION_RULES.email.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (body.phone && !VALIDATION_RULES.phone.test(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Get client IP and basic info from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer');

    // Determine urgency based on keywords in message
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency', 'pilne', 'natychmiast'];
    const highKeywords = ['important', 'soon', 'quickly', 'ważne', 'szybko'];
    
    let urgency: ContactMessage['urgency'] = 'low';
    const messageText = body.message.toLowerCase();
    
    if (urgentKeywords.some(keyword => messageText.includes(keyword))) {
      urgency = 'high';
    } else if (highKeywords.some(keyword => messageText.includes(keyword))) {
      urgency = 'medium';
    }

    const contactMessage: ContactMessage = {
      id: body.id || nanoid(),
      type: 'contact_message',
      createdAt: new Date().toISOString(),
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone?.trim(),
      company: body.company?.trim(),
      message: body.message.trim(),
      
      subject: body.subject?.trim(),
      preferredContactMethod: body.preferredContactMethod || 'email',
      urgency,
      projectType: body.projectType,
      budget: body.budget,
      timeline: body.timeline,
      
      status: 'new',
      priority: urgency === 'high' ? 'high' : urgency === 'medium' ? 'medium' : 'low',
      responseCount: 0,
      
      source: 'website_contact_form',
      referralSource: body.referralSource,
      utmParameters: {
        source: body.utm_source,
        medium: body.utm_medium,
        campaign: body.utm_campaign,
      },
      
      ipAddress: ip,
      location: {
        // These would typically be populated by a geolocation service
        country: body.country,
        city: body.city,
        timezone: body.timezone,
      },
      
      tags: body.tags || [],
    };

    const result = await cosmosOperations.createDocument(contactMessage);
    
    if (result.success) {
      // TODO: Send notification email to team
      // TODO: Auto-assign based on project type or availability
      
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
        data: { id: result.data?.id }
      }, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a contact message (admin only)
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
        { success: false, error: 'Contact message ID is required' },
        { status: 400 }
      );
    }

    // Get existing contact message
    const existingResult = await cosmosOperations.readDocument(id);
    if (!existingResult.success) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      );
    }

    // Update response count if status changed to replied
    let responseCount = existingResult.data.responseCount || 0;
    if (updateData.status === 'replied' && existingResult.data.status !== 'replied') {
      responseCount += 1;
      updateData.lastContactDate = new Date().toISOString();
    }

    const updatedContactMessage: ContactMessage = {
      ...existingResult.data,
      ...updateData,
      id,
      responseCount,
      updatedAt: new Date().toISOString(),
    };

    const result = await cosmosOperations.updateDocument(id, updatedContactMessage);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a contact message (admin only)
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
        { success: false, error: 'Contact message ID is required' },
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
    console.error('Error in DELETE /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 