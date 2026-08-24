export interface ProjectTech {
  name: string;
  logoKey: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  cardIndex: string;
  imageType: 'ai-chat' | 'transactions' | 'erp' | 'cms' | 'foundry' | 'figma';
  tags: string[];
  techLogos: ProjectTech[];
  links?: {
    live?: string;
    github?: string;
    figma?: string;
  };
}

export const PROJECTS_DATA: ProjectItem[] = [
  // ── 1. OmniChat AI Gateway
  {
    id: 'omnichat-ai',
    title: 'OmniChat AI Gateway & Engine',
    description: 'Conversational LLM engine exposing 1,100+ attendee records and live roster streams with sub-second retrieval.',
    category: 'AI & DATA SYSTEMS',
    cardIndex: '01',
    imageType: 'ai-chat',
    tags: ['Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'LLM Stream'],
    techLogos: [
      { name: 'Next.js', logoKey: 'nextjs' },
      { name: 'TypeScript', logoKey: 'typescript' },
      { name: 'Node.js', logoKey: 'nodejs' },
      { name: 'Express', logoKey: 'express' },
    ],
    links: {
      github: 'https://github.com',
      live: 'https://example.com',
    },
  },

  // ── 2. Enterprise Figma Canvas
  {
    id: 'figma-erp-canvas',
    title: 'Enterprise Flow Design System',
    description: 'Comprehensive Figma design library with 80+ atomic primitives, token variables, and conversational workflows.',
    category: 'DESIGN ARCHITECTURE',
    cardIndex: '02',
    imageType: 'figma',
    tags: ['Figma', 'UI/UX', 'Design System', 'Auto-Layout 5.0'],
    techLogos: [
      { name: 'Figma', logoKey: 'figma' },
      { name: 'HTML5', logoKey: 'html' },
      { name: 'CSS3', logoKey: 'css' },
    ],
    links: {
      figma: 'https://figma.com',
    },
  },

  // ── 3. Dynamic CMS Client Portals
  {
    id: 'dynamic-cms-portals',
    title: 'Dynamic CMS Client Portals',
    description: 'Production headless frontend portals translating complex Figma designs into responsive multilingual interfaces.',
    category: 'CLIENT PLATFORMS',
    cardIndex: '03',
    imageType: 'cms',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'i18n'],
    techLogos: [
      { name: 'Next.js', logoKey: 'nextjs' },
      { name: 'React', logoKey: 'react' },
      { name: 'Tailwind', logoKey: 'tailwind' },
      { name: 'TypeScript', logoKey: 'typescript' },
    ],
    links: {
      live: 'https://example.com',
      github: 'https://github.com',
    },
  },

  // ── 4. Global Transaction Engine
  {
    id: 'global-transactions',
    title: 'High-Throughput Transaction Core',
    description: 'Country-specific checkout architecture achieving 99.6% latency reduction via SSR, OTP rate-limiting, and indexing.',
    category: 'FINTECH & COMMERCE',
    cardIndex: '04',
    imageType: 'transactions',
    tags: ['Next.js SSR', 'TypeScript', 'PostgreSQL', 'Security', 'REST API'],
    techLogos: [
      { name: 'Next.js', logoKey: 'nextjs' },
      { name: 'React', logoKey: 'react' },
      { name: 'TypeScript', logoKey: 'typescript' },
      { name: 'Node.js', logoKey: 'nodejs' },
    ],
    links: {
      live: 'https://example.com',
    },
  },

  // ── 5. Kinetic UI Design Foundry
  {
    id: 'kinetic-design-foundry',
    title: 'Kinetic UI System & Suite',
    description: 'Minimalist component system with physics-driven scroll triggers, color flooding reveals, and Lenis inertia at 60 FPS.',
    category: 'INTERACTIVE FOUNDRY',
    cardIndex: '05',
    imageType: 'foundry',
    tags: ['React', 'GSAP', 'Lenis', 'Tailwind CSS', 'Animation'],
    techLogos: [
      { name: 'React', logoKey: 'react' },
      { name: 'TypeScript', logoKey: 'typescript' },
      { name: 'Tailwind', logoKey: 'tailwind' },
      { name: 'HTML5', logoKey: 'html' },
    ],
    links: {
      live: 'https://example.com',
      github: 'https://github.com',
    },
  },

  // ── 6. Enterprise ERP Microservices
  {
    id: 'erp-microservices',
    title: 'ERP Microservice Dual-Sync',
    description: 'Modernized enterprise platform bridging dual-version C#/.NET enterprise systems with performant PERN microservices.',
    category: 'BACKEND ARCHITECTURE',
    cardIndex: '06',
    imageType: 'erp',
    tags: ['PERN Stack', 'C# / .NET', 'Microservices', 'PostgreSQL', 'SQL Server'],
    techLogos: [
      { name: 'React', logoKey: 'react' },
      { name: 'C#', logoKey: 'csharp' },
      { name: 'Node.js', logoKey: 'nodejs' },
      { name: 'Express', logoKey: 'express' },
    ],
    links: {
      github: 'https://github.com',
    },
  },
];

