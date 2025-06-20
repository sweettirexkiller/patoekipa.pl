import { NextRequest, NextResponse } from 'next/server';
import { cosmosOperations } from '@/lib/cosmos';
import { TeamMember, TEAM_AVAILABILITY } from '@/lib/database-schema';
import { nanoid } from 'nanoid';

// GET - Retrieve all team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    const availability = searchParams.get('availability') as TeamMember['availability'];

    let query = 'SELECT * FROM c WHERE c.type = "team_member"';
    const parameters: any[] = [];

    if (activeOnly) {
      query += ' AND c.isActive = true';
    }

    if (availability && TEAM_AVAILABILITY.includes(availability)) {
      query += ' AND c.availability = @availability';
      parameters.push({ name: '@availability', value: availability });
    }

    query += ' ORDER BY c.name ASC';

    const result = await cosmosOperations.queryDocuments(query, parameters);
    
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
    console.error('Error in GET /api/team:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'role', 'bio', 'skills', 'social'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    const teamMember: TeamMember = {
      id: body.id || nanoid(),
      type: 'team_member',
      createdAt: new Date().toISOString(),
      name: body.name,
      role: body.role,
      bio: body.bio,
      skills: Array.isArray(body.skills) ? body.skills : [],
      avatar: body.avatar || '',
      portfolioUrl: body.portfolioUrl || '',
      social: {
        github: body.social?.github || '',
        linkedin: body.social?.linkedin || '',
        twitter: body.social?.twitter,
        website: body.social?.website,
      },
      isActive: body.isActive !== undefined ? body.isActive : true,
      joinDate: body.joinDate || new Date().toISOString(),
      location: body.location,
      timezone: body.timezone,
      yearsOfExperience: body.yearsOfExperience,
      certifications: body.certifications || [],
      languages: body.languages || [],
      availability: body.availability || 'available',
    };

    const result = await cosmosOperations.createDocument(teamMember);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/team:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a team member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    // Get existing team member
    const existingResult = await cosmosOperations.readDocument(id);
    if (!existingResult.success) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    const updatedTeamMember: TeamMember = {
      ...existingResult.data,
      ...updateData,
      id,
      updatedAt: new Date().toISOString(),
    };

    const result = await cosmosOperations.updateDocument(id, updatedTeamMember);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/team:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a team member
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
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
    console.error('Error in DELETE /api/team:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}