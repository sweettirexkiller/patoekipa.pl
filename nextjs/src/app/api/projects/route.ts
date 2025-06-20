import { NextRequest, NextResponse } from 'next/server';
import { cosmosOperations } from '@/lib/cosmos';
import { Project, PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/lib/database-schema';
import { nanoid } from 'nanoid';

// GET - Retrieve projects with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as Project['category'];
    const status = searchParams.get('status') as Project['status'];
    const featured = searchParams.get('featured') === 'true';
    const teamMemberId = searchParams.get('teamMember');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let query = 'SELECT * FROM c WHERE c.type = "project"';
    const parameters: any[] = [];

    if (category && PROJECT_CATEGORIES.includes(category)) {
      query += ' AND c.category = @category';
      parameters.push({ name: '@category', value: category });
    }

    if (status && PROJECT_STATUSES.includes(status)) {
      query += ' AND c.status = @status';
      parameters.push({ name: '@status', value: status });
    }

    if (featured) {
      query += ' AND c.featured = true';
    }

    if (teamMemberId) {
      query += ' AND ARRAY_CONTAINS(c.teamMembers, @teamMemberId)';
      parameters.push({ name: '@teamMemberId', value: teamMemberId });
    }

    query += ' ORDER BY c.priority DESC, c.createdAt DESC';

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
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'description', 'technologies', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Field '${field}' is required` },
          { status: 400 }
        );
      }
    }

    const project: Project = {
      id: body.id || nanoid(),
      type: 'project',
      createdAt: new Date().toISOString(),
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      longDescription: body.longDescription,
      image: body.image || '',
      images: body.images || [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      category: body.category,
      status: body.status || 'planning',
      featured: body.featured || false,
      
      links: {
        androidLink: body.links?.androidLink,
        iosLink: body.links?.iosLink,
        webLink: body.links?.webLink,
        githubLink: body.links?.githubLink,
        demoLink: body.links?.demoLink,
        documentationLink: body.links?.documentationLink,
      },
      
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate,
      duration: body.duration,
      clientName: body.clientName,
      clientIndustry: body.clientIndustry,
      projectSize: body.projectSize || 'medium',
      
      teamMembers: Array.isArray(body.teamMembers) ? body.teamMembers : [],
      projectLead: body.projectLead,
      
      metrics: body.metrics || {},
      
      tags: Array.isArray(body.tags) ? body.tags : [],
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      priority: body.priority || 5,
    };

    const result = await cosmosOperations.createDocument(project);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get existing project
    const existingResult = await cosmosOperations.readDocument(id);
    if (!existingResult.success) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const updatedProject: Project = {
      ...existingResult.data,
      ...updateData,
      id,
      updatedAt: new Date().toISOString(),
    };

    const result = await cosmosOperations.updateDocument(id, updatedProject);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
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
    console.error('Error in DELETE /api/projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 