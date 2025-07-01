import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { cosmosOperations } from "./cosmos";
import { TeamMember, Project, Testimonial } from "./database-schema";

// Tool to get team members
export const getTeamMembersTool = new DynamicStructuredTool({
  name: "get_team_members",
  description: "Get information about team members. Can optionally filter by name or role.",
  schema: z.object({
    name: z.string().optional().describe("Filter by team member name"),
    role: z.string().optional().describe("Filter by team member role"),
    isActive: z.boolean().optional().describe("Filter by active status"),
  }),
  func: async ({ name, role, isActive }) => {
    try {
      let query = "SELECT * FROM c WHERE c.type = 'team_member'";
      const parameters: any[] = [];
      
      if (name) {
        query += " AND CONTAINS(LOWER(c.name), @name)";
        parameters.push({ name: "@name", value: name.toLowerCase() });
      }
      
      if (role) {
        query += " AND CONTAINS(LOWER(c.role), @role)";
        parameters.push({ name: "@role", value: role.toLowerCase() });
      }
      
      if (isActive !== undefined) {
        query += " AND c.isActive = @isActive";
        parameters.push({ name: "@isActive", value: isActive });
      }
      
      query += " ORDER BY c.name";
      
      const result = await cosmosOperations.queryDocuments(query, parameters);
      
      if (result.success) {
        const teamMembers = result.data as TeamMember[];
        return JSON.stringify(teamMembers.map(member => ({
          name: member.name,
          role: member.role,
          bio: member.bio,
          skills: member.skills,
          yearsOfExperience: member.yearsOfExperience,
          location: member.location,
          availability: member.availability,
          social: member.social,
          isActive: member.isActive,
          joinDate: member.joinDate,
          languages: member.languages,
          certifications: member.certifications
        })));
      } else {
        console.error('Database error in getTeamMembersTool:', result.error);
        return `Kurwa, coś się zjebało z bazą danych przy pobieraniu zespołu: ${result.error}`;
      }
    } catch (error) {
      console.error('Error in getTeamMembersTool:', error);
      return `Kurwa, coś się zjebało z bazą danych przy pobieraniu zespołu. Spróbuj jeszcze raz albo napisz na kontakt@patoekipa.pl`;
    }
  },
});

// Tool to get projects
export const getProjectsTool = new DynamicStructuredTool({
  name: "get_projects",
  description: "Get information about projects. Can filter by category, status, or search by title/description.",
  schema: z.object({
    category: z.enum(["commercial", "hobby", "open_source", "internal"]).optional().describe("Filter by project category"),
    status: z.enum(["active", "completed", "archived", "in_progress", "planning"]).optional().describe("Filter by project status"),
    featured: z.boolean().optional().describe("Filter by featured projects only"),
    search: z.string().optional().describe("Search in project title or description"),
  }),
  func: async ({ category, status, featured, search }) => {
    try {
      let query = "SELECT * FROM c WHERE c.type = 'project'";
      const parameters: any[] = [];
      
      if (category) {
        query += " AND c.category = @category";
        parameters.push({ name: "@category", value: category });
      }
      
      if (status) {
        query += " AND c.status = @status";
        parameters.push({ name: "@status", value: status });
      }
      
      if (featured !== undefined) {
        query += " AND c.featured = @featured";
        parameters.push({ name: "@featured", value: featured });
      }
      
      if (search) {
        query += " AND (CONTAINS(LOWER(c.title), @search) OR CONTAINS(LOWER(c.description), @search))";
        parameters.push({ name: "@search", value: search.toLowerCase() });
      }
      
      query += " ORDER BY c.createdAt DESC";
      
      const result = await cosmosOperations.queryDocuments(query, parameters);
      
      if (result.success) {
        const projects = result.data as Project[];
        return JSON.stringify(projects.map(project => ({
          title: project.title,
          subtitle: project.subtitle,
          description: project.description,
          longDescription: project.longDescription,
          technologies: project.technologies,
          category: project.category,
          status: project.status,
          featured: project.featured,
          links: project.links,
          startDate: project.startDate,
          endDate: project.endDate,
          duration: project.duration,
          clientName: project.clientName,
          clientIndustry: project.clientIndustry,
          projectSize: project.projectSize,
          teamMembers: project.teamMembers,
          projectLead: project.projectLead,
          metrics: project.metrics,
          tags: project.tags
        })));
      } else {
        console.error('Database error in getProjectsTool:', result.error);
        return `Kurwa, coś się zjebało z bazą danych przy pobieraniu projektów: ${result.error}`;
      }
    } catch (error) {
      console.error('Error in getProjectsTool:', error);
      return `Kurwa, coś się zjebało z bazą danych przy pobieraniu projektów. Spróbuj jeszcze raz albo napisz na kontakt@patoekipa.pl`;
    }
  },
});

// Tool to get testimonials
export const getTestimonialsTool = new DynamicStructuredTool({
  name: "get_testimonials",
  description: "Get client testimonials and reviews. Can filter by company, rating, or featured status.",
  schema: z.object({
    company: z.string().optional().describe("Filter by company name"),
    minRating: z.number().min(1).max(5).optional().describe("Minimum rating (1-5 stars)"),
    featured: z.boolean().optional().describe("Filter by featured testimonials only"),
    approved: z.boolean().optional().describe("Filter by approval status"),
  }),
  func: async ({ company, minRating, featured, approved }) => {
    try {
      let query = "SELECT * FROM c WHERE c.type = 'testimonial'";
      const parameters: any[] = [];
      
      if (company) {
        query += " AND CONTAINS(LOWER(c.company), @company)";
        parameters.push({ name: "@company", value: company.toLowerCase() });
      }
      
      if (minRating) {
        query += " AND c.rating >= @minRating";
        parameters.push({ name: "@minRating", value: minRating });
      }
      
      if (featured !== undefined) {
        query += " AND c.featured = @featured";
        parameters.push({ name: "@featured", value: featured });
      }
      
      if (approved !== undefined) {
        query += " AND c.approved = @approved";
        parameters.push({ name: "@approved", value: approved });
      }
      
      query += " ORDER BY c.testimonialDate DESC";
      
      const result = await cosmosOperations.queryDocuments(query, parameters);
      
      if (result.success) {
        const testimonials = result.data as Testimonial[];
        return JSON.stringify(testimonials.map(testimonial => ({
          name: testimonial.name,
          role: testimonial.role,
          company: testimonial.company,
          content: testimonial.content,
          rating: testimonial.rating,
          testimonialDate: testimonial.testimonialDate,
          projectId: testimonial.projectId,
          featured: testimonial.featured,
          verified: testimonial.verified,
          language: testimonial.language
        })));
      } else {
        console.error('Database error in getTestimonialsTool:', result.error);
        return `Kurwa, coś się zjebało z bazą danych przy pobieraniu opinii: ${result.error}`;
      }
    } catch (error) {
      console.error('Error in getTestimonialsTool:', error);
      return `Kurwa, coś się zjebało z bazą danych przy pobieraniu opinii. Spróbuj jeszcze raz albo napisz na kontakt@patoekipa.pl`;
    }
  },
});

// Tool to get company/team statistics
export const getCompanyStatsTool = new DynamicStructuredTool({
  name: "get_company_stats",
  description: "Get general statistics about the company, team, and projects for overview information.",
  schema: z.object({}),
  func: async () => {
    try {
      // Get team stats
      const teamResult = await cosmosOperations.queryDocuments(
        "SELECT * FROM c WHERE c.type = 'team_member' AND c.isActive = true"
      );
      
      // Get project stats
      const projectsResult = await cosmosOperations.queryDocuments(
        "SELECT * FROM c WHERE c.type = 'project'"
      );
      
      // Get testimonials stats
      const testimonialsResult = await cosmosOperations.queryDocuments(
        "SELECT * FROM c WHERE c.type = 'testimonial' AND c.approved = true"
      );
      
      if (teamResult.success && projectsResult.success && testimonialsResult.success) {
        const teamMembers = teamResult.data as TeamMember[];
        const projects = projectsResult.data as Project[];
        const testimonials = testimonialsResult.data as Testimonial[];
        
        const stats = {
          teamSize: teamMembers.length,
          totalProjects: projects.length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          activeProjects: projects.filter(p => p.status === 'active' || p.status === 'in_progress').length,
          commercialProjects: projects.filter(p => p.category === 'commercial').length,
          hobbyProjects: projects.filter(p => p.category === 'hobby').length,
          totalTestimonials: testimonials.length,
          averageRating: testimonials.length > 0 
            ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
            : 0,
          mainTechnologies: Array.from(new Set(projects.flatMap(p => p.technologies))).slice(0, 10),
          teamExperience: teamMembers.reduce((sum, member) => sum + (member.yearsOfExperience || 0), 0),
          languages: Array.from(new Set(teamMembers.flatMap(m => m.languages || []))),
          locations: Array.from(new Set(teamMembers.map(m => m.location).filter(Boolean)))
        };
        
        return JSON.stringify(stats);
      } else {
        console.error('Database error in getCompanyStatsTool - one or more queries failed');
        return `Kurwa, coś się zjebało z bazą danych przy pobieraniu statystyk firmy`;
      }
    } catch (error) {
      console.error('Error in getCompanyStatsTool:', error);
      return `Kurwa, coś się zjebało z bazą danych przy pobieraniu statystyk. Spróbuj jeszcze raz albo napisz na kontakt@patoekipa.pl`;
    }
  },
});

export const agentTools = [
  getTeamMembersTool,
  getProjectsTool,
  getTestimonialsTool,
  getCompanyStatsTool,
]; 