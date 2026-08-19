export interface ExperienceRole {
  id: string;
  role: string;
  employmentType: string;
  company: string;
  shortCompany: string;
  period: string;
  status?: 'Current' | 'Completed';
  location?: string;
  summary: string;
  keyMetric?: {
    value: string;
    label: string;
  };
  highlights: string[];
  tags: string[];
}

export const EXPERIENCE_DATA: ExperienceRole[] = [
  {
    id: 'gositus',
    role: 'Full-Stack Developer',
    employmentType: 'Full Time',
    company: 'PT. Go Online Solusi (Gositus)',
    shortCompany: 'Gositus',
    period: 'Apr 2026 — Present',
    status: 'Current',
    location: 'Jakarta, Indonesia',
    summary: 'Driving full-stack engineering across high-performance web applications, dynamic CMS platforms, and AI-powered service backends.',
    keyMetric: {
      value: '99.6%',
      label: 'Load time reduction via SSR & indexing',
    },
    highlights: [
      'Reduced load times by **99.6%** on multiple country-specific transaction pages by implementing server-side rendering, query optimization, and indexing.',
      'Engineered secure REST APIs powering an LLM chatbot\'s data access, exposing **1,100+** participants\' event attendance, rosters, and profile data with role-based access control.',
      'Engineered core modules for a next-generation ERP platform, designing cross-module data flows and system interactions to digitize complex business workflows.',
      'Integrated CMS-driven backends for multiple client websites, including database schema changes, OTP authentication flows and rate limiting, migrating client\'s fully hardcoded site to a dynamic CMS architecture.',
      'Translated complex Figma designs into responsive, multilingual, production-ready frontends for a variety of client websites, refining through multiple rounds of client feedback.',
    ],
    tags: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'CMS Architecture', 'Figma'],
  },
  {
    id: 'kpsg',
    role: 'Full-Stack Developer Intern',
    employmentType: 'Internship',
    company: 'PT. Karyaputra Suryagemilang (KPSG Group)',
    shortCompany: 'KPSG Group',
    period: 'Feb 2025 — Feb 2026',
    status: 'Completed',
    location: 'Tangerang Regency, Indonesia',
    summary: 'Contributed to enterprise client-facing web applications, microservices workflows, and database modernization initiatives.',
    keyMetric: {
      value: 'DB Migration',
      label: 'SQL Server to PostgreSQL & PL/pgSQL',
    },
    highlights: [
      'Built end-to-end features for a production client-facing web app using microservice architecture, supporting real-world user workflows and production deployment.',
      'Migrated database logic from legacy SQL Server to PostgreSQL, rewriting stored procedures into optimized PL/pgSQL functions.',
      'Maintained dual legacy/.NET and modern app versions, resolving bugs across code, schemas, and stored procedures to ensure feature parity.',
      'Performed QA testing and feature validation to catch defects prior to client delivery.',
    ],
    tags: ['Microservices', 'PostgreSQL', 'SQL Server', '.NET / C#', 'PL/pgSQL', 'QA Testing'],
  },
];
