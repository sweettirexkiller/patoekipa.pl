import { CosmosClient, Database, Container } from '@azure/cosmos';

// Helper function to handle unknown errors
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

// Check if we're in a server environment (not during build)
function isServerEnvironment(): boolean {
  return typeof window === 'undefined' && process.env.NODE_ENV !== undefined;
}

// Cosmos DB configuration
let client: CosmosClient | null = null;
let database: Database | null = null;
let container: Container | null = null;

// Lazy initialization function
function initializeCosmosClient() {
  if (!client && isServerEnvironment()) {
    const endpoint = process.env.COSMOS_DB_ENDPOINT || 'https://patoekipa-cosmosdb.documents.azure.com:443/';
    const key = process.env.COSMOS_DB_KEY;
    const databaseId = process.env.COSMOS_DB_DATABASE_NAME || 'patoekipa-db';
    const containerId = process.env.COSMOS_DB_CONTAINER_NAME || 'data';

    if (!key) {
      throw new Error('COSMOS_DB_KEY environment variable is required');
    }

    // Initialize Cosmos client
    client = new CosmosClient({ endpoint, key });
    database = client.database(databaseId);
    container = database.container(containerId);
  }

  return { client, database, container };
}

// Helper function to get initialized container
function getContainer(): Container {
  if (!isServerEnvironment()) {
    throw new Error('Cosmos DB operations can only be performed in server environment');
  }
  
  const { container: containerInstance } = initializeCosmosClient();
  if (!containerInstance) {
    throw new Error('Failed to initialize Cosmos DB container');
  }
  return containerInstance;
}

// Helper function to get initialized database
function getDatabase(): Database {
  if (!isServerEnvironment()) {
    throw new Error('Cosmos DB operations can only be performed in server environment');
  }
  
  const { database: databaseInstance } = initializeCosmosClient();
  if (!databaseInstance) {
    throw new Error('Failed to initialize Cosmos DB database');
  }
  return databaseInstance;
}

// Export functions to get initialized instances
export function getCosmosClient(): CosmosClient {
  if (!isServerEnvironment()) {
    throw new Error('Cosmos DB operations can only be performed in server environment');
  }
  
  const { client: clientInstance } = initializeCosmosClient();
  if (!clientInstance) {
    throw new Error('Failed to initialize Cosmos DB client');
  }
  return clientInstance;
}

// Helper functions for common operations
export const cosmosOperations = {
  // Create a new document
  async createDocument(data: any) {
    try {
      const container = getContainer();
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
      const container = getContainer();
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
      const container = getContainer();
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
      const container = getContainer();
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
      const container = getContainer();
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
      const container = getContainer();
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
    const database = getDatabase();
    const container = getContainer();
    
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