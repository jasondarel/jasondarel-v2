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
    summary: 'Drove full-stack microservice development in PERN while bridging architectural parity and database migrations between dual-version C# enterprise systems.',
    keyMetric: {
      value: 'Dual-Stack Systems',
      label: 'PERN microservices development alongside dual-version C# / .NET feature parity',
    },
    highlights: [
      'Built end-to-end production microservice modules using the **PERN stack (PostgreSQL, Express, React, Node.js)** to support scalable client workflows.',
      'Maintained continuous feature parity between legacy and modernized **C# / .NET** application versions, resolving bugs across codebases, schemas, and stored procedures.',
      'Modernized legacy database infrastructure by converting SQL Server schemas and stored procedures into performant **PostgreSQL & PL/pgSQL** routines.',
      'Conducted cross-version QA testing and end-to-end feature validation to guarantee zero defect leakage prior to client deployment.',
    ],
    tags: ['PERN Stack', 'Microservices', 'C# / .NET', 'PostgreSQL', 'SQL Server', 'PL/pgSQL', 'QA Testing'],
  },
];
