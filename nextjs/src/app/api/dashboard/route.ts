import { NextRequest, NextResponse } from 'next/server';
import { cosmosOperations } from '@/lib/cosmos';
import { verifyAuth, createAuthResponse } from '@/lib/auth';

// GET - Retrieve dashboard statistics (admin only)
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
    // Get team members count
    const teamResult = await cosmosOperations.queryDocuments(
      'SELECT VALUE COUNT(1) FROM c WHERE c.type = "team_member" AND c.isActive = true'
    );
    
    // Get projects count
    const projectsResult = await cosmosOperations.queryDocuments(
      'SELECT VALUE COUNT(1) FROM c WHERE c.type = "project"'
    );
    
    // Get testimonials count (approved only)
    const testimonialsResult = await cosmosOperations.queryDocuments(
      'SELECT VALUE COUNT(1) FROM c WHERE c.type = "testimonial" AND c.approved = true'
    );
    
    // Get new contacts count (unread/new status)
    const contactsResult = await cosmosOperations.queryDocuments(
      'SELECT VALUE COUNT(1) FROM c WHERE c.type = "contact_message" AND c.status = "new"'
    );

    // Calculate statistics
    const stats = {
      teamMembers: teamResult.success ? (teamResult.data?.[0] || 0) : 0,
      projects: projectsResult.success ? (projectsResult.data?.[0] || 0) : 0,
      testimonials: testimonialsResult.success ? (testimonialsResult.data?.[0] || 0) : 0,
      newContacts: contactsResult.success ? (contactsResult.data?.[0] || 0) : 0,
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error in GET /api/dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 