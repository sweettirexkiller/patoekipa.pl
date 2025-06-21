# Cosmos DB Composite Indexes Setup

If you want to restore multi-field sorting in your admin panel, you need to create composite indexes in Cosmos DB.

## Required Composite Indexes:

### 1. Projects Collection
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      [
        { "path": "/priority", "order": "descending" },
        { "path": "/createdAt", "order": "descending" }
      ]
    ]
  }
}
```

### 2. Testimonials Collection  
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      [
        { "path": "/displayOrder", "order": "ascending" },
        { "path": "/rating", "order": "descending" },
        { "path": "/createdAt", "order": "descending" }
      ]
    ]
  }
}
```

### 3. Contact Messages Collection
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      [
        { "path": "/priority", "order": "descending" },
        { "path": "/createdAt", "order": "descending" }
      ]
    ]
  }
}
```

## How to Apply:

### Via Azure Portal:
1. Go to Azure Portal → Your Cosmos DB Account
2. Navigate to Data Explorer
3. Select your container
4. Go to Scale & Settings
5. Update the Indexing Policy with the composite indexes above

### Via Azure CLI:
```bash
# Update container indexing policy
az cosmosdb sql container update \
  --account-name your-cosmos-account \
  --database-name patoekipa \
  --name your-container \
  --indexing-policy @indexing-policy.json
```

After creating these indexes, you can restore the original ORDER BY clauses in your API routes for better sorting. 