import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';

// Azure Storage configuration
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'avatars';

let blobServiceClient: BlobServiceClient | null = null;
let sharedKeyCredential: StorageSharedKeyCredential | null = null;

// Lazy initialization of BlobServiceClient
function getBlobServiceClient(): { client: BlobServiceClient; credential: StorageSharedKeyCredential } {
  if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_STORAGE_ACCOUNT_KEY) {
    throw new Error('Azure Storage credentials are not configured. Please set AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY environment variables.');
  }

  if (!blobServiceClient || !sharedKeyCredential) {
    sharedKeyCredential = new StorageSharedKeyCredential(
      AZURE_STORAGE_ACCOUNT_NAME,
      AZURE_STORAGE_ACCOUNT_KEY
    );

    blobServiceClient = new BlobServiceClient(
      `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      sharedKeyCredential
    );
  }

  return { client: blobServiceClient, credential: sharedKeyCredential };
}

// Generate a SAS URL for a blob with read permissions
function generateSasUrl(blobName: string, expiresInHours: number = 24 * 365): string {
  const { credential } = getBlobServiceClient();
  
  const sasOptions = {
    containerName: AZURE_STORAGE_CONTAINER_NAME,
    blobName: blobName,
    permissions: BlobSASPermissions.parse("r"), // Read permission
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + expiresInHours * 60 * 60 * 1000), // Default 1 year
  };

  const sasToken = generateBlobSASQueryParameters(sasOptions, credential).toString();
  
  return `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_STORAGE_CONTAINER_NAME}/${blobName}?${sasToken}`;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

export async function uploadAvatarToBlob(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  try {
    // Get blob service client (lazy initialization)
    const { client } = getBlobServiceClient();
    
    // Get container client
    const containerClient = client.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    
    // Try to create container with private access (no public access needed)
    try {
      await containerClient.createIfNotExists({
        access: 'container' // Try container level access first
      });
    } catch (publicAccessError) {
      console.log('Container level access failed, trying private access...');
      try {
        // If public access is disabled, create private container
        await containerClient.createIfNotExists({
          access: 'blob' // Blob level access
        });
      } catch (blobAccessError) {
        console.log('Blob level access failed, creating private container...');
        // Create private container (no public access)
        await containerClient.createIfNotExists();
      }
    }

    // Get blob client
    const blobClient = containerClient.getBlockBlobClient(filename);
    
    // Upload the file
    await blobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: contentType,
        blobCacheControl: 'public, max-age=31536000', // Cache for 1 year
      },
      metadata: {
        uploadedAt: new Date().toISOString(),
        source: 'patoekipa-admin'
      }
    });

    // Generate SAS URL for private access (valid for 1 year)
    const sasUrl = generateSasUrl(filename);
    
    return {
      success: true,
      url: sasUrl,
      filename
    };

  } catch (error) {
    console.error('Azure Blob Storage upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
}

export async function deleteAvatarFromBlob(filename: string): Promise<boolean> {
  try {
    const { client } = getBlobServiceClient();
    const containerClient = client.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(filename);
    
    await blobClient.deleteIfExists();
    return true;
  } catch (error) {
    console.error('Error deleting blob:', error);
    return false;
  }
}

export async function listAvatars(): Promise<string[]> {
  try {
    const { client } = getBlobServiceClient();
    const containerClient = client.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    const avatars: string[] = [];
    
    for await (const blob of containerClient.listBlobsFlat()) {
      avatars.push(blob.name);
    }
    
    return avatars;
  } catch (error) {
    console.error('Error listing blobs:', error);
    return [];
  }
}

// Health check function
export async function checkAzureStorageConnection(): Promise<boolean> {
  try {
    // Check if credentials are available first
    if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_STORAGE_ACCOUNT_KEY) {
      return false;
    }

    const { client } = getBlobServiceClient();
    const containerClient = client.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    
    // Try to get container properties (this works even with private containers)
    await containerClient.getProperties();
    return true;
  } catch (error) {
    console.error('Azure Storage connection failed:', error);
    return false;
  }
}

// Helper function to refresh SAS URLs for existing avatars
export async function refreshAvatarSasUrl(filename: string): Promise<string | null> {
  try {
    const { client } = getBlobServiceClient();
    const containerClient = client.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(filename);
    
    // Check if blob exists
    const exists = await blobClient.exists();
    if (!exists) {
      return null;
    }
    
    // Generate new SAS URL
    return generateSasUrl(filename);
  } catch (error) {
    console.error('Error refreshing SAS URL:', error);
    return null;
  }
} 