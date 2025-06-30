import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

// Azure Storage configuration
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'avatars';

if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_STORAGE_ACCOUNT_KEY) {
  throw new Error('Azure Storage credentials are not configured. Please set AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY environment variables.');
}

// Create the BlobServiceClient
const sharedKeyCredential = new StorageSharedKeyCredential(
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY
);

const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  sharedKeyCredential
);

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
    // Get container client
    const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    
    // Ensure container exists (create if it doesn't)
    await containerClient.createIfNotExists({
      access: 'blob' // Public read access for avatars
    });

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

    // Return the public URL
    const url = blobClient.url;
    
    return {
      success: true,
      url,
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
    const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
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
    const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
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
    const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    await containerClient.getProperties();
    return true;
  } catch (error) {
    console.error('Azure Storage connection failed:', error);
    return false;
  }
} 