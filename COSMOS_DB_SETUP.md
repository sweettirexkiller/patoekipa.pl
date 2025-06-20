# Azure Cosmos DB Integration Guide

## 🎉 Setup Complete!

Your Azure Static Web Apps project is now connected to Azure Cosmos DB with the **free tier** enabled. Here's what has been configured:

## 📊 **Database Configuration**

### **Cosmos DB Account Details:**
- **Account Name**: `patoekipa-cosmosdb`
- **Resource Group**: `chill-projects`
- **Location**: `Central US`
- **Tier**: **Free Tier** (1,000 RU/s + 25 GB storage)
- **Database**: `patoekipa-db`
- **Container**: `data`
- **Partition Key**: `/id`

## 🔧 **Environment Setup**

### **1. Local Development (.env.local)**
```bash
# Copy from env.example and update with your keys
cp env.example .env.local
```

### **2. Required Environment Variables**
```bash
# OpenAI API (existing)
OPENAI_API_KEY=sk-proj-your-key-here

# Azure Cosmos DB (new)
COSMOS_DB_ENDPOINT=https://patoekipa-cosmosdb.documents.azure.com:443/
COSMOS_DB_KEY=cosmos-db-key
COSMOS_DB_DATABASE_NAME=patoekipa-db
COSMOS_DB_CONTAINER_NAME=data
```

### **3. Azure Static Web App Configuration**
Add these environment variables in Azure Portal:
1. Go to your Static Web App in Azure Portal
2. Navigate to **Configuration** → **Application settings**
3. Add the same environment variables as above

## 🚀 **API Endpoints Available**

### **Base URL**: `/api/data`

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/api/data` | Get all documents | `fetch('/api/data')` |
| `GET` | `/api/data?action=test` | Test DB connection | `fetch('/api/data?action=test')` |
| `POST` | `/api/data` | Create new document | `fetch('/api/data', {method: 'POST', body: JSON.stringify(data)})` |
| `PUT` | `/api/data` | Update document | `fetch('/api/data', {method: 'PUT', body: JSON.stringify({id, ...data})})` |
| `DELETE` | `/api/data?id=xxx` | Delete document | `fetch('/api/data?id=xxx', {method: 'DELETE'})` |

## 📝 **Usage Examples**

### **1. Test Database Connection**
```javascript
const response = await fetch('/api/data?action=test');
const result = await response.json();
console.log(result); // { success: true, database: "patoekipa-db", container: "data" }
```

### **2. Create a Document**
```javascript
const newData = {
  name: "John Doe",
  email: "john@example.com",
  type: "user"
};

const response = await fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newData)
});

const result = await response.json();
console.log(result); // { success: true, data: {...} }
```

### **3. Get All Documents**
```javascript
const response = await fetch('/api/data');
const result = await response.json();
console.log(result); // { success: true, data: [...], count: 5 }
```

### **4. Update a Document**
```javascript
const updateData = {
  id: "existing-document-id",
  name: "Jane Doe",
  email: "jane@example.com"
};

const response = await fetch('/api/data', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updateData)
});
```

### **5. Delete a Document**
```javascript
const response = await fetch('/api/data?id=document-id-to-delete', {
  method: 'DELETE'
});
```

## 🛠 **Direct Cosmos DB Operations**

You can also use the Cosmos operations directly in your API routes:

```typescript
import { cosmosOperations } from '@/lib/cosmos';

// In your API route
export async function GET() {
  const result = await cosmosOperations.getAllDocuments();
  return NextResponse.json(result);
}
```

## 💰 **Free Tier Limits**

Your Cosmos DB account has the following **free tier** benefits:
- ✅ **1,000 RU/s** throughput (shared across all containers)
- ✅ **25 GB** storage
- ✅ **No monthly charges** for this amount
- ✅ **Global distribution** available
- ✅ **99.99% SLA**

## 🔍 **Monitoring & Management**

### **Azure Portal Access**
- **Cosmos DB Account**: [Azure Portal](https://portal.azure.com) → Resource Groups → `chill-projects` → `patoekipa-cosmosdb`
- **Data Explorer**: View and query your data directly in the portal
- **Metrics**: Monitor RU consumption and storage usage

### **CLI Commands for Management**
```bash
# List all documents (for testing)
az cosmosdb sql container throughput show \
  --account-name patoekipa-cosmosdb \
  --resource-group chill-projects \
  --database-name patoekipa-db \
  --name data

# Check RU consumption
az cosmosdb sql container throughput show \
  --account-name patoekipa-cosmosdb \
  --resource-group chill-projects \
  --database-name patoekipa-db \
  --name data
```

## 🔐 **Security Best Practices**

1. **Environment Variables**: Never commit actual keys to Git
2. **Key Rotation**: Regularly rotate your Cosmos DB keys in Azure Portal
3. **Network Access**: Consider enabling firewall rules for production
4. **Authentication**: Use Azure AD authentication for enhanced security

## 🚀 **Next Steps**

1. **Test the Integration**:
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/data?action=test
   ```

2. **Deploy to Azure SWA**:
   - Your GitHub Actions workflow will automatically deploy
   - Make sure to add environment variables in Azure Portal

3. **Extend the API**:
   - Add more specific endpoints for your use case
   - Implement data validation and schemas
   - Add authentication if needed

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"COSMOS_DB_KEY environment variable is required"**
   - Make sure you've set the environment variables correctly
   - Check both local `.env.local` and Azure Portal configuration

2. **Connection timeout errors**
   - Verify your Cosmos DB account is running
   - Check if the endpoint URL is correct

3. **RU limit exceeded**
   - Monitor your RU consumption in Azure Portal
   - Consider optimizing queries or upgrading if needed

### **Useful Commands:**
```bash
# Test connection locally
curl http://localhost:3000/api/data?action=test

# Create test document
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Get all documents
curl http://localhost:3000/api/data
```

## 📚 **Resources**

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Cosmos DB Free Tier](https://docs.microsoft.com/en-us/azure/cosmos-db/free-tier)
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**🎉 Your app is now connected to Azure Cosmos DB with full CRUD capabilities!** 