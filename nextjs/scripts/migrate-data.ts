// Data Migration Script - Populate Database with Existing Portfolio Data

import { cosmosOperations } from '../src/lib/cosmos';
import { TeamMember, Project, Testimonial } from '../src/lib/database-schema';
import { nanoid } from 'nanoid';
import portfolioData from '../../shared/content/portfolio.json';

// Sample testimonials from the current component
const sampleTestimonials = [
  {
    name: 'Jan Fikcyjny',
    role: 'CEO',
    company: 'FakeCompany Ltd.',
    content: 'Patoekipa dostarczyła nam rewolucyjną platformę e-commerce. Ich innowacyjne podejście i doskonała komunikacja sprawiły, że projekt przebiegł bez problemów. Wzrost sprzedaży o 300% mówi sam za siebie!',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    name: 'Anna Przykładowa',
    role: 'CTO',
    company: 'DummyCorp Industries',
    content: 'Zespół Patoekipa stworzył dla nas zaawansowany system AI do analizy danych. Jakość kodu, dokumentacja i wsparcie przerosły nasze oczekiwania. To partnerzy, na których można polegać!',
    rating: 5,
    avatar: '👨‍💻'
  },
  {
    name: 'Marek Testowy',
    role: 'Product Manager',
    company: 'FictionalTech Solutions',
    content: 'Aplikacja mobilna stworzona przez Patoekipę zdobyła już ponad milion użytkowników. Ich wiedza techniczna i kreatywność w UX/UI design sprawiają, że każdy projekt to prawdziwy sukces.',
    rating: 5,
    avatar: '👩‍🚀'
  },
  {
    name: 'Katarzyna Przykład',
    role: 'Founder',
    company: 'MockStartup Inc.',
    content: 'Dzięki Patoekipie udało nam się zdobyć rundę finansowania Series A. Ich MVP było na tyle imponujące, że inwestorzy od razu uwierzyli w naszą wizję. Profesjonalizm na najwyższym poziomie!',
    rating: 5,
    avatar: '🚀'
  },
  {
    name: 'Piotr Demoński',
    role: 'Marketing Director',
    company: 'PlaceholderBrand Co.',
    content: 'System CRM stworzony przez Patoekipę zwiększył naszą efektywność o 250%. Automatyzacja procesów i intuicyjny interfejs sprawiają, że praca z nim to czysta przyjemność. Rewelacyjny zespół!',
    rating: 5,
    avatar: '💼'
  },
  {
    name: 'Ewa Wzorcowa',
    role: 'Tech Lead',
    company: 'SampleSystems Corp',
    content: 'Mikroserwisy zaprojektowane przez Patoekipę obsługują obecnie 10 milionów requestów dziennie. Ich architektura jest skalowalna, bezpieczna i niezawodna. To prawdziwi mistrzowie swojego fachu!',
    rating: 5,
    avatar: '⚡'
  }
];

// Extended project data with more details
const extendedProjects = [
  // Commercial Projects
  {
    title: 'FlexiFlow CRM',
    subtitle: 'Nowoczesny system CRM dla małych i średnich przedsiębiorstw',
    description: 'Zaawansowany system CRM z automatyzacją procesów sprzedażowych, analizą danych klientów i integracją z popularnymi narzędziami biznesowymi.',
    image: '/shared/assets/projects/w01.png',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    category: 'commercial' as const,
    status: 'completed' as const,
    featured: true,
    links: {
      webLink: '#',
      demoLink: '#'
    },
    clientName: 'TechFlow Solutions',
    clientIndustry: 'Software',
    projectSize: 'large' as const,
    duration: '6 months',
    tags: ['CRM', 'Automation', 'Analytics'],
    priority: 10
  },
  {
    title: 'EcoTrack Mobile',
    subtitle: 'Aplikacja mobilna do monitorowania śladu węglowego',
    description: 'Kompleksowa aplikacja mobilna pomagająca firmom śledzić i redukować swój ślad węglowy poprzez monitoring aktywności i generowanie raportów.',
    image: '/shared/assets/projects/w02.png',
    technologies: ['Flutter', 'Firebase', 'Cloud Functions', 'Analytics'],
    category: 'commercial' as const,
    status: 'active' as const,
    featured: true,
    links: {
      androidLink: '#',
      iosLink: '#'
    },
    clientName: 'GreenTech Corp',
    clientIndustry: 'Environmental',
    projectSize: 'medium' as const,
    duration: '4 months',
    tags: ['Mobile', 'Environment', 'Analytics'],
    priority: 9
  },
  {
    title: 'SmartInventory Pro',
    subtitle: 'System zarządzania magazynem z AI',
    description: 'Zaawansowany system zarządzania magazynem wykorzystujący sztuczną inteligencję do przewidywania popytu i optymalizacji dostaw.',
    image: '/shared/assets/projects/w03.jpeg',
    technologies: ['Vue.js', 'Python', 'TensorFlow', 'PostgreSQL'],
    category: 'commercial' as const,
    status: 'completed' as const,
    featured: false,
    links: {
      webLink: '#'
    },
    clientName: 'LogiMax',
    clientIndustry: 'Logistics',
    projectSize: 'enterprise' as const,
    duration: '8 months',
    tags: ['AI/ML', 'Inventory', 'Optimization'],
    priority: 8
  },
  
  // Hobby Projects
  {
    title: 'CodeQuest Academy',
    subtitle: 'Interaktywna platforma do nauki programowania',
    description: 'Platforma edukacyjna z gamifikacją, wyzwaniami programistycznymi i interaktywnym środowiskiem nauki dla początkujących programistów.',
    image: '/shared/assets/projects/1.png',
    technologies: ['Flutter', 'Firebase', 'Dart', 'Cloud Functions'],
    category: 'hobby' as const,
    status: 'in_progress' as const,
    featured: false,
    links: {
      androidLink: '#',
      githubLink: '#'
    },
    projectSize: 'medium' as const,
    duration: '3 months',
    tags: ['Education', 'Gamification', 'Mobile'],
    priority: 6
  },
  {
    title: 'MindPalace Notes',
    subtitle: 'Aplikacja do tworzenia map myśli',
    description: 'Innowacyjna aplikacja do organizacji wiedzy wykorzystująca techniki mnemoniczne i wizualne mapy myśli.',
    image: '/shared/assets/projects/02.png',
    technologies: ['React Native', 'SQLite', 'Canvas API'],
    category: 'hobby' as const,
    status: 'completed' as const,
    featured: false,
    links: {
      androidLink: '#',
      iosLink: '#'
    },
    projectSize: 'small' as const,
    duration: '2 months',
    tags: ['Productivity', 'AI', 'Mind Mapping'],
    priority: 5
  }
];

export async function migrateTeamMembers() {
  console.log('🚀 Migrating team members...');
  
  const results = [];
  
  for (const member of portfolioData.members) {
    const teamMember: TeamMember = {
      id: member.id,
      type: 'team_member',
      createdAt: new Date().toISOString(),
      name: member.name,
      role: member.role,
      bio: member.bio,
      skills: member.skills,
      avatar: member.avatar,
      portfolioUrl: member.portfolioUrl,
      social: {
        github: member.social.github,
        linkedin: member.social.linkedin,
      },
      isActive: true,
      joinDate: '2020-01-01T00:00:00.000Z', // Default join date
      availability: 'available',
      yearsOfExperience: member.id === 'piotr' ? 5 : member.id === 'mozdowski' ? 6 : 4,
      languages: ['Polish', 'English'],
    };

    const result = await cosmosOperations.createDocument(teamMember);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ Created team member: ${member.name}`);
    } else {
      console.error(`❌ Failed to create team member: ${member.name}`, result.error);
    }
  }
  
  return results;
}

export async function migrateProjects() {
  console.log('🚀 Migrating projects...');
  
  const results = [];
  
  // Get team member IDs for assignment
  const teamQuery = await cosmosOperations.queryDocuments('SELECT * FROM c WHERE c.type = "team_member"');
  const teamMemberIds = teamQuery.success ? teamQuery.data?.map((member: any) => member.id) || [] : [];
  
  for (const projectData of extendedProjects) {
    // Assign random team members to projects
    const assignedMembers = teamMemberIds.slice(0, Math.floor(Math.random() * 3) + 1);
    
    const project: Project = {
      id: nanoid(),
      type: 'project',
      createdAt: new Date().toISOString(),
      ...projectData,
      startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      teamMembers: assignedMembers,
      projectLead: assignedMembers[0],
      metrics: {
        linesOfCode: Math.floor(Math.random() * 50000) + 10000,
        commits: Math.floor(Math.random() * 1000) + 100,
        contributors: assignedMembers.length,
      }
    };

    const result = await cosmosOperations.createDocument(project);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ Created project: ${projectData.title}`);
    } else {
      console.error(`❌ Failed to create project: ${projectData.title}`, result.error);
    }
  }
  
  return results;
}

export async function migrateTestimonials() {
  console.log('🚀 Migrating testimonials...');
  
  const results = [];
  
  // Get project IDs for linking testimonials
  const projectQuery = await cosmosOperations.queryDocuments('SELECT * FROM c WHERE c.type = "project"');
  const projectIds = projectQuery.success ? projectQuery.data?.map((project: any) => project.id) || [] : [];
  
  for (let i = 0; i < sampleTestimonials.length; i++) {
    const testimonialData = sampleTestimonials[i];
    
    const testimonial: Testimonial = {
      id: nanoid(),
      type: 'testimonial',
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      name: testimonialData.name,
      role: testimonialData.role,
      company: testimonialData.company,
      content: testimonialData.content,
      rating: testimonialData.rating,
      avatar: testimonialData.avatar,
      
      projectId: projectIds.length > 0 ? projectIds[Math.floor(Math.random() * projectIds.length)] : undefined,
      testimonialDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      
      featured: i < 3, // First 3 are featured
      approved: true,
      displayOrder: i + 1,
      
      verified: Math.random() > 0.5,
      verificationMethod: Math.random() > 0.5 ? 'email' : 'linkedin',
      
      source: 'manual',
      language: 'pl',
    };

    const result = await cosmosOperations.createDocument(testimonial);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ Created testimonial: ${testimonialData.name}`);
    } else {
      console.error(`❌ Failed to create testimonial: ${testimonialData.name}`, result.error);
    }
  }
  
  return results;
}

export async function runFullMigration() {
  console.log('🎯 Starting full data migration...');
  
  try {
    // Test database connection first
    const connectionTest = await cosmosOperations.getAllDocuments(1);
    if (!connectionTest.success) {
      throw new Error('Database connection failed');
    }
    
    console.log('✅ Database connection successful');
    
    // Run migrations in order
    const teamResults = await migrateTeamMembers();
    const projectResults = await migrateProjects();
    const testimonialResults = await migrateTestimonials();
    
    const summary = {
      teamMembers: {
        total: teamResults.length,
        successful: teamResults.filter(r => r.success).length,
        failed: teamResults.filter(r => !r.success).length,
      },
      projects: {
        total: projectResults.length,
        successful: projectResults.filter(r => r.success).length,
        failed: projectResults.filter(r => !r.success).length,
      },
      testimonials: {
        total: testimonialResults.length,
        successful: testimonialResults.filter(r => r.success).length,
        failed: testimonialResults.filter(r => !r.success).length,
      }
    };
    
    console.log('📊 Migration Summary:');
    console.log(`Team Members: ${summary.teamMembers.successful}/${summary.teamMembers.total} successful`);
    console.log(`Projects: ${summary.projects.successful}/${summary.projects.total} successful`);
    console.log(`Testimonials: ${summary.testimonials.successful}/${summary.testimonials.total} successful`);
    
    const totalSuccessful = summary.teamMembers.successful + summary.projects.successful + summary.testimonials.successful;
    const totalItems = summary.teamMembers.total + summary.projects.total + summary.testimonials.total;
    
    console.log(`🎉 Migration completed: ${totalSuccessful}/${totalItems} items migrated successfully`);
    
    return summary;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Individual functions are already exported above

// If running this script directly
if (require.main === module) {
  runFullMigration()
    .then(() => {
      console.log('✅ Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
} 