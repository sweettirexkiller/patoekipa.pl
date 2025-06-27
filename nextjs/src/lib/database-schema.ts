// Database Schema Types for Patoekipa Portfolio

// Base interface for all database documents
export interface BaseDocument {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Team Member Schema
export interface TeamMember extends BaseDocument {
  type: 'team_member';
  name: string;
  role: string;
  bio: string;
  skills: string[];
  avatar: string;
  portfolioUrl: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
    website?: string;
  };
  isActive: boolean;
  joinDate: string;
  location?: string;
  timezone?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  languages?: string[];
  availability: 'available' | 'busy' | 'unavailable';
}

// Project Schema
export interface Project extends BaseDocument {
  type: 'project';
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[]; // Additional project images
  technologies: string[];
  category: 'commercial' | 'hobby' | 'open_source' | 'internal';
  status: 'active' | 'completed' | 'archived' | 'in_progress' | 'planning';
  featured: boolean;
  
  // Project Links
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
  duration?: string; // e.g., "3 months"
  clientName?: string;
  clientIndustry?: string;
  projectSize: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Team Assignment
  teamMembers: string[]; // Array of team member IDs
  projectLead?: string; // Team member ID
  
  // Project Metrics
  metrics?: {
    linesOfCode?: number;
    commits?: number;
    contributors?: number;
    downloads?: number;
    users?: number;
    rating?: number;
  };
  
  // SEO and Display
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  priority: number; // For ordering (1-10)
}

// Testimonial Schema
export interface Testimonial extends BaseDocument {
  type: 'testimonial';
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number; // 1-5 stars
  avatar: string; // URL or emoji
  
  // Additional Details
  projectId?: string; // Reference to related project
  clientEmail?: string;
  clientLinkedIn?: string;
  testimonialDate: string;
  
  // Display Settings
  featured: boolean;
  approved: boolean;
  displayOrder: number;
  
  // Verification
  verified: boolean;
  verificationMethod?: 'email' | 'linkedin' | 'manual';
  
  // Metadata
  source: 'website_form' | 'email' | 'linkedin' | 'manual' | 'imported';
  language: 'pl' | 'en';
}

// Contact Message Schema
export interface ContactMessage extends BaseDocument {
  type: 'contact_message';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  
  // Contact Details
  subject?: string;
  preferredContactMethod: 'email' | 'phone' | 'linkedin';
  urgency: 'low' | 'medium' | 'high';
  projectType?: 'web_development' | 'mobile_app' | 'consulting' | 'other';
  budget?: string;
  timeline?: string;
  
  // Status Management
  status: 'new' | 'read' | 'replied' | 'in_progress' | 'completed' | 'archived';
  assignedTo?: string; // Team member ID
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Follow-up
  followUpDate?: string;
  lastContactDate?: string;
  responseCount: number;
  
  // Source Tracking
  source: 'website_contact_form' | 'email' | 'linkedin' | 'referral' | 'other';
  referralSource?: string;
  utmParameters?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  
  // IP and Location (for analytics)
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  
  // Notes and Tags
  internalNotes?: string;
  tags?: string[];
}

// Blog Post Schema (for future use)
export interface BlogPost extends BaseDocument {
  type: 'blog_post';
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string; // Team member ID
  
  // Publishing
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  categories: string[];
  
  // Engagement
  views: number;
  likes: number;
  shares: number;
  
  // Content
  readingTime: number; // minutes
  language: 'pl' | 'en';
}

// Analytics Event Schema
export interface AnalyticsEvent extends BaseDocument {
  type: 'analytics_event';
  eventName: string;
  eventCategory: 'page_view' | 'user_interaction' | 'form_submission' | 'download' | 'error';
  
  // Event Data
  properties: Record<string, any>;
  userId?: string;
  sessionId?: string;
  
  // Context
  page: string;
  referrer?: string;
  userAgent?: string;
  
  // Location
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  
  // Timing
  timestamp: string;
  duration?: number; // milliseconds
}

// Newsletter Subscription Schema
export interface NewsletterSubscription extends BaseDocument {
  type: 'newsletter_subscription';
  email: string;
  name?: string;
  
  // Subscription Details
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  subscribedAt: string;
  unsubscribedAt?: string;
  
  // Preferences
  interests: string[];
  frequency: 'weekly' | 'monthly' | 'quarterly';
  language: 'pl' | 'en';
  
  // Source
  source: 'website' | 'social_media' | 'referral' | 'manual';
  
  // Engagement
  openRate?: number;
  clickRate?: number;
  lastOpenedAt?: string;
  lastClickedAt?: string;
}

// Configuration Schema (for app settings)
export interface AppConfig extends BaseDocument {
  type: 'app_config';
  key: string;
  value: any;
  description?: string;
  category: 'general' | 'seo' | 'social' | 'analytics' | 'feature_flags';
  isPublic: boolean; // Can be exposed to frontend
}

// Admin User Schema
export interface AdminUser extends BaseDocument {
  type: 'admin_user';
  githubUsername: string;
  githubUserId: string;
  displayName: string;
  email?: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  lastLoginAt?: string;
  addedBy: string;
  addedAt: string;
  permissions?: {
    canManageUsers?: boolean;
    canManageProjects?: boolean;
    canManageTeam?: boolean;
    canManageTestimonials?: boolean;
    canManageContacts?: boolean;
  };
  notes?: string;
}

// Union type for all document types
export type DatabaseDocument = 
  | TeamMember 
  | Project 
  | Testimonial 
  | ContactMessage 
  | BlogPost 
  | AnalyticsEvent 
  | NewsletterSubscription 
  | AppConfig 
  | AdminUser;

// Helper type to get document type by type field
export type DocumentByType<T extends DatabaseDocument['type']> = Extract<DatabaseDocument, { type: T }>;

// Database Query Helpers
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

// Database operation response types
export interface DatabaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Validation schemas (can be used with libraries like Joi or Zod)
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// Constants for dropdown/select options
export const PROJECT_CATEGORIES = ['commercial', 'hobby', 'open_source', 'internal'] as const;
export const PROJECT_STATUSES = ['active', 'completed', 'archived', 'in_progress', 'planning'] as const;
export const PROJECT_SIZES = ['small', 'medium', 'large', 'enterprise'] as const;
export const CONTACT_STATUSES = ['new', 'read', 'replied', 'in_progress', 'completed', 'archived'] as const;
export const PRIORITY_LEVELS = ['low', 'medium', 'high', 'urgent'] as const;
export const TEAM_AVAILABILITY = ['available', 'busy', 'unavailable'] as const; 