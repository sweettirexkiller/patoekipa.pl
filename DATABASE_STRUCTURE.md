# 🗄️ Database Structure & API Documentation

## 📋 Overview

This document describes the comprehensive database structure for the Patoekipa portfolio website, including team members, projects, testimonials, and contact messages stored in Azure Cosmos DB.

## 🏗️ Database Architecture

### **Document Types**
The database uses a single container with different document types identified by the `type` field:

- `team_member` - Team member profiles
- `project` - Portfolio projects
- `testimonial` - Client testimonials
- `contact_message` - Contact form submissions
- `blog_post` - Blog articles (future use)
- `analytics_event` - User analytics
- `newsletter_subscription` - Newsletter subscriptions
- `app_config` - Application configuration

### **Container Configuration**
- **Container Name**: `data`
- **Partition Key**: `/id`
- **Throughput**: 400 RU/s (within free tier)

## 📊 Data Models

### 1. **Team Member** (`team_member`)

```typescript
interface TeamMember {
  id: string;                    // Unique identifier
  type: 'team_member';
  createdAt: string;
  updatedAt?: string;
  
  // Basic Info
  name: string;                  // Full name
  role: string;                  // Job title
  bio: string;                   // Description
  skills: string[];              // Technical skills
  avatar: string;                // Avatar image URL
  portfolioUrl: string;          // Personal portfolio
  
  // Social Links
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    website?: string;
  };
  
  // Status & Availability
  isActive: boolean;             // Is team member active
  availability: 'available' | 'busy' | 'unavailable';
  joinDate: string;              // When they joined
  
  // Additional Details
  location?: string;
  timezone?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  languages?: string[];
}
```

### 2. **Project** (`project`)

```typescript
interface Project {
  id: string;
  type: 'project';
  createdAt: string;
  updatedAt?: string;
  
  // Basic Info
  title: string;                 // Project name
  subtitle: string;              // Short description
  description: string;           // Detailed description
  longDescription?: string;      // Extended description
  image: string;                 // Main project image
  images?: string[];             // Additional images
  
  // Classification
  category: 'commercial' | 'hobby' | 'open_source' | 'internal';
  status: 'active' | 'completed' | 'archived' | 'in_progress' | 'planning';
  featured: boolean;             // Show on homepage
  
  // Technology & Links
  technologies: string[];        // Tech stack
  links: {
    androidLink?: string;
    iosLink?: string;
    webLink?: string;
    githubLink?: string;
    demoLink?: string;
    documentationLink?: string;
  };
  
  // Project Details
  startDate: string;
  endDate?: string;
  duration?: string;             // e.g., "3 months"
  clientName?: string;
  clientIndustry?: string;
  projectSize: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Team Assignment
  teamMembers: string[];         // Array of team member IDs
  projectLead?: string;          // Team member ID
  
  // Metrics
  metrics?: {
    linesOfCode?: number;
    commits?: number;
    contributors?: number;
    downloads?: number;
    users?: number;
    rating?: number;
  };
  
  // SEO & Display
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  priority: number;              // For ordering (1-10)
}
```

### 3. **Testimonial** (`testimonial`)

```typescript
interface Testimonial {
  id: string;
  type: 'testimonial';
  createdAt: string;
  updatedAt?: string;
  
  // Basic Info
  name: string;                  // Client name
  role: string;                  // Client position
  company: string;               // Client company
  content: string;               // Testimonial text
  rating: number;                // 1-5 stars
  avatar: string;                // Avatar or emoji
  
  // Relationships
  projectId?: string;            // Related project
  clientEmail?: string;
  clientLinkedIn?: string;
  testimonialDate: string;
  
  // Display Settings
  featured: boolean;             // Show prominently
  approved: boolean;             // Moderation status
  displayOrder: number;          // Sort order
  
  // Verification
  verified: boolean;
  verificationMethod?: 'email' | 'linkedin' | 'manual';
  
  // Metadata
  source: 'website_form' | 'email' | 'linkedin' | 'manual' | 'imported';
  language: 'pl' | 'en';
}
```

### 4. **Contact Message** (`contact_message`)

```typescript
interface ContactMessage {
  id: string;
  type: 'contact_message';
  createdAt: string;
  updatedAt?: string;
  
  // Contact Info
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  
  // Project Details
  subject?: string;
  preferredContactMethod: 'email' | 'phone' | 'linkedin';
  urgency: 'low' | 'medium' | 'high';
  projectType?: 'web_development' | 'mobile_app' | 'consulting' | 'other';
  budget?: string;
  timeline?: string;
  
  // Status Management
  status: 'new' | 'read' | 'replied' | 'in_progress' | 'completed' | 'archived';
  assignedTo?: string;           // Team member ID
  priority: 'low' | 'medium' | 'high' | 'urgent';
  responseCount: number;
  
  // Follow-up
  followUpDate?: string;
  lastContactDate?: string;
  
  // Analytics
  source: 'website_contact_form' | 'email' | 'linkedin' | 'referral' | 'other';
  referralSource?: string;
  utmParameters?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  
  // Notes
  internalNotes?: string;
  tags?: string[];
}
```

## 🔌 API Endpoints

### **Team Members** (`/api/team`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/team` | Get all team members | `?active=true&availability=available` |
| `POST` | `/api/team` | Create team member | Body: TeamMember data |
| `PUT` | `/api/team` | Update team member | Body: {id, ...updates} |

**Example Usage:**
```javascript
// Get active team members
const response = await fetch('/api/team?active=true');
const { data } = await response.json();

// Create new team member
const newMember = {
  name: "John Doe",
  role: "Frontend Developer",
  bio: "Passionate about React and TypeScript",
  skills: ["React", "TypeScript", "Next.js"],
  social: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe"
  }
};

await fetch('/api/team', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newMember)
});
```

### **Projects** (`/api/projects`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/projects` | Get projects | `?category=commercial&status=active&featured=true&teamMember=id&limit=10` |
| `POST` | `/api/projects` | Create project | Body: Project data |
| `PUT` | `/api/projects` | Update project | Body: {id, ...updates} |
| `DELETE` | `/api/projects` | Delete project | `?id=project_id` |

**Example Usage:**
```javascript
// Get featured commercial projects
const response = await fetch('/api/projects?category=commercial&featured=true');
const { data } = await response.json();

// Get projects by team member
const memberProjects = await fetch('/api/projects?teamMember=piotr');

// Create new project
const newProject = {
  title: "E-commerce Platform",
  subtitle: "Modern online store",
  description: "Full-featured e-commerce solution",
  technologies: ["Next.js", "Stripe", "PostgreSQL"],
  category: "commercial",
  teamMembers: ["piotr", "mozdowski"]
};

await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProject)
});
```

### **Testimonials** (`/api/testimonials`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/testimonials` | Get testimonials | `?featured=true&approved=true&projectId=id&limit=5` |
| `POST` | `/api/testimonials` | Create testimonial | Body: Testimonial data |
| `PUT` | `/api/testimonials` | Update testimonial | Body: {id, ...updates} |
| `DELETE` | `/api/testimonials` | Delete testimonial | `?id=testimonial_id` |

**Example Usage:**
```javascript
// Get featured testimonials for homepage
const response = await fetch('/api/testimonials?featured=true&limit=3');
const { data } = await response.json();

// Get testimonials for specific project
const projectTestimonials = await fetch('/api/testimonials?projectId=project123');

// Submit new testimonial (requires approval)
const testimonial = {
  name: "Jane Smith",
  role: "CEO",
  company: "TechCorp",
  content: "Excellent work on our project!",
  rating: 5,
  projectId: "project123"
};

await fetch('/api/testimonials', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testimonial)
});
```

### **Contact Messages** (`/api/contact`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/contact` | Get messages (admin) | `?status=new&priority=high&assignedTo=id&limit=20` |
| `POST` | `/api/contact` | Submit contact form | Body: Contact data |
| `PUT` | `/api/contact` | Update message (admin) | Body: {id, ...updates} |
| `DELETE` | `/api/contact` | Delete message (admin) | `?id=message_id` |

**Example Usage:**
```javascript
// Submit contact form
const contactData = {
  name: "John Client",
  email: "john@example.com",
  message: "I need help with my project",
  projectType: "web_development",
  budget: "$5,000 - $10,000"
};

const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(contactData)
});

// Admin: Get new messages
const newMessages = await fetch('/api/contact?status=new');

// Admin: Mark message as read
await fetch('/api/contact', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: "message123",
    status: "read",
    assignedTo: "piotr"
  })
});
```

## 🔄 Data Migration

### **Running the Migration Script**

```bash
# From the nextjs directory
cd nextjs

# Set environment variables
export COSMOS_DB_KEY="your_cosmos_db_key"

# Run migration
npx tsx src/scripts/migrate-data.ts
```

### **Migration Functions**

```typescript
import { 
  runFullMigration,
  migrateTeamMembers,
  migrateProjects,
  migrateTestimonials 
} from '@/scripts/migrate-data';

// Full migration
await runFullMigration();

// Selective migration
await migrateTeamMembers();
await migrateProjects();
await migrateTestimonials();
```

## 🔍 Query Examples

### **Advanced Queries**

```javascript
// Get projects by multiple team members
const query = `
  SELECT * FROM c 
  WHERE c.type = "project" 
  AND (ARRAY_CONTAINS(c.teamMembers, "piotr") 
       OR ARRAY_CONTAINS(c.teamMembers, "mozdowski"))
  ORDER BY c.priority DESC
`;

// Get testimonials with high ratings
const highRatedQuery = `
  SELECT * FROM c 
  WHERE c.type = "testimonial" 
  AND c.rating >= 4 
  AND c.approved = true
  ORDER BY c.rating DESC, c.createdAt DESC
`;

// Get contact messages requiring follow-up
const followUpQuery = `
  SELECT * FROM c 
  WHERE c.type = "contact_message" 
  AND c.status IN ("new", "read") 
  AND c.priority IN ("high", "urgent")
  ORDER BY c.priority DESC, c.createdAt ASC
`;
```

## 📈 Analytics & Reporting

### **Common Analytics Queries**

```javascript
// Project statistics by category
const projectStats = `
  SELECT c.category, COUNT(1) as count
  FROM c 
  WHERE c.type = "project"
  GROUP BY c.category
`;

// Team member project counts
const memberProjectCounts = `
  SELECT m.name, 
         (SELECT COUNT(1) 
          FROM p 
          WHERE p.type = "project" 
          AND ARRAY_CONTAINS(p.teamMembers, m.id)) as projectCount
  FROM c m
  WHERE m.type = "team_member"
`;

// Contact form conversion by source
const contactSources = `
  SELECT c.source, COUNT(1) as submissions
  FROM c 
  WHERE c.type = "contact_message"
  GROUP BY c.source
`;
```

## 🛡️ Security Considerations

### **Data Access Control**
- Contact messages contain sensitive information (admin only)
- Testimonials require approval before display
- Team member data should be publicly accessible
- Project data is public but can be filtered by status

### **Input Validation**
- Email format validation
- Phone number format validation
- Required field validation
- Data sanitization for XSS prevention

### **Rate Limiting**
- Contact form submissions (prevent spam)
- API endpoint rate limiting
- Database query optimization

## 🚀 Deployment Considerations

### **Environment Variables**
```bash
# Required for production
COSMOS_DB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_DB_KEY=your_primary_key
COSMOS_DB_DATABASE_NAME=patoekipa-db
COSMOS_DB_CONTAINER_NAME=data
```

### **Azure Static Web App Configuration**
Add environment variables in Azure Portal:
1. Go to Static Web App → Configuration
2. Add all Cosmos DB environment variables
3. Restart the application

### **Monitoring**
- Monitor RU consumption in Azure Portal
- Set up alerts for high usage
- Track API response times
- Monitor error rates

## 📚 Additional Resources

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Cosmos DB SQL Query Reference](https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-query-getting-started)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**📝 Note**: This database structure is designed to be scalable and maintainable while staying within Azure Cosmos DB free tier limits. All schemas include proper TypeScript types for type safety and better developer experience. 