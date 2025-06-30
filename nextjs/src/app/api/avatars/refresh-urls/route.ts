import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, createAuthResponse } from '@/lib/auth';
import { refreshAvatarSasUrl } from '@/lib/azure-storage';
import { cosmosOperations } from '@/lib/cosmos';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

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
          error: 'Azure Storage not configured. Please contact administrator.' 
        },
        { status: 503 }
      );
    }

    // Get all team members with avatars
    const teamMembersResult = await cosmosOperations.queryDocuments(
      'SELECT * FROM c WHERE c.type = "team_member" AND c.avatar != null AND c.avatar != ""'
    );

    if (!teamMembersResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    const teamMembers = teamMembersResult.data || [];
    const updatedMembers = [];
    const errors = [];

    for (const member of teamMembers) {
      try {
        // Extract filename from current avatar URL
        let filename = null;
        
        if (member.avatar) {
          // Handle both old public URLs and SAS URLs
          const urlParts = member.avatar.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          
          // Remove SAS query parameters if present
          filename = lastPart.split('?')[0];
          
          // Only process if it looks like a blob filename
          if (filename && (filename.includes('avatar-') || filename.match(/\.(jpg|jpeg|png|webp)$/i))) {
            // Generate new SAS URL
            const newSasUrl = await refreshAvatarSasUrl(filename);
            
            if (newSasUrl) {
              // Update the member's avatar URL
              const updatedMember = {
                ...member,
                avatar: newSasUrl,
                updatedAt: new Date().toISOString()
              };
              
              const updateResult = await cosmosOperations.updateDocument(member.id, updatedMember);
              
              if (updateResult.success) {
                updatedMembers.push({
                  id: member.id,
                  name: member.name,
                  oldUrl: member.avatar,
                  newUrl: newSasUrl
                });
              } else {
                errors.push({
                  id: member.id,
                  name: member.name,
                  error: 'Failed to update database'
                });
              }
            } else {
              errors.push({
                id: member.id,
                name: member.name,
                error: 'Failed to generate SAS URL or blob not found'
              });
            }
          }
        }
      } catch (error) {
        errors.push({
          id: member.id,
          name: member.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${teamMembers.length} team members`,
      data: {
        totalProcessed: teamMembers.length,
        successfulUpdates: updatedMembers.length,
        errorCount: errors.length,
        updatedMembers,
        errors
      }
    });

  } catch (error) {
    console.error('Error refreshing avatar URLs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh avatar URLs' },
      { status: 500 }
    );
  }
} 