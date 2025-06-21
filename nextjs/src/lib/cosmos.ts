import { CosmosClient, Database, Container } from '@azure/cosmos';

// Helper function to handle unknown errors
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

// Cosmos DB configuration
const endpoint = process.env.COSMOS_DB_ENDPOINT || 'https://patoekipa-cosmosdb.documents.azure.com:443/';
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'patoekipa-db';
const containerId = process.env.COSMOS_DB_CONTAINER_NAME || 'data';

if (!key) {
  throw new Error('COSMOS_DB_KEY environment variable is required');
}

// Initialize Cosmos client
const client = new CosmosClient({ endpoint, key });

// Get database and container references
const database: Database = client.database(databaseId);
const container: Container = database.container(containerId);

// Export the container for use in API routes
export { client, database, container };

// Helper functions for common operations
export const cosmosOperations = {
  // Create a new document
  async createDocument(data: any) {
    try {
      const { resource } = await container.items.create(data);
      return { success: true, data: resource };
    } catch (error) {
      console.error('Error creating document:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Read a document by ID
  async readDocument(id: string, partitionKey?: string) {
    try {
      const { resource } = await container.item(id, partitionKey || id).read();
      return { success: true, data: resource };
    } catch (error) {
      console.error('Error reading document:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Query documents
  async queryDocuments(query: string, parameters?: any[]) {
    try {
      const { resources } = await container.items
        .query({ query, parameters })
        .fetchAll();
      return { success: true, data: resources };
    } catch (error) {
      console.error('Error querying documents:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Update a document
  async updateDocument(id: string, data: any, partitionKey?: string) {
    try {
      const { resource } = await container.item(id, partitionKey || id).replace(data);
      return { success: true, data: resource };
    } catch (error) {
      console.error('Error updating document:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Delete a document
  async deleteDocument(id: string, partitionKey?: string) {
    try {
      await container.item(id, partitionKey || id).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Get all documents (with optional filtering)
  async getAllDocuments(maxItemCount?: number) {
    try {
      const querySpec = {
        query: 'SELECT * FROM c',
        parameters: []
      };
      
      const { resources } = await container.items
        .query(querySpec, { maxItemCount })
        .fetchAll();
      
      return { success: true, data: resources };
    } catch (error) {
      console.error('Error getting all documents:', error);
      return { success: false, error: getErrorMessage(error) };
    }
  }
};

// Test connection function
export async function testConnection() {
  try {
    const { resource: databaseInfo } = await database.read();
    const { resource: containerInfo } = await container.read();
    
    if (!databaseInfo || !containerInfo) {
      throw new Error('Failed to read database or container information');
    }
    
    console.log('✅ Cosmos DB connection successful');
    console.log('Database:', databaseInfo.id);
    console.log('Container:', containerInfo.id);
    
    return { success: true, database: databaseInfo.id, container: containerInfo.id };
  } catch (error) {
    console.error('❌ Cosmos DB connection failed:', error);
    return { success: false, error: getErrorMessage(error) };
  }
} 