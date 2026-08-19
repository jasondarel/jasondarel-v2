export interface FloatingStack {
  name: string;
  logoKey: string;
  iconSrc?: string; // Optional custom PNG path in public/ (e.g. '/images/stacks/react.png')
  pos: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationClass: string;
  delay: string;
}

export interface SkillItem {
  id: string;
  title: string;
  // Dynamic color tokens for theme inversion
  bg: string;
  titleColor: string;
  boxBg: string;
  boxBorder: string;
  boxTextColor: string;
  iconBg: string;
  iconBorder: string;
  fallbackTextColor: string;
  stacks: FloatingStack[];
}

export const SKILLS_DATA: SkillItem[] = [
  // ── 1. FRONTEND: Normal Light Theme ─────────────────────────────────────────
  {
    id: 'frontend',
    title: 'Frontend',
    bg: 'var(--surface-0)',
    titleColor: 'var(--accent)',
    boxBg: 'var(--surface-1)',
    boxBorder: 'var(--border)',
    boxTextColor: 'var(--foreground)',
    iconBg: 'var(--surface-0)',
    iconBorder: 'var(--border)',
    fallbackTextColor: 'var(--accent)',
    stacks: [
      // ── Cluster 1: React & JavaScript Ecosystem (Left Side) ──
      {
        name: 'React.js',
        logoKey: 'react',
        iconSrc: '/images/stacks/react.png',
        pos: { top: '14%', left: '8%' },
        animationClass: 'animate-float-1',
        delay: '0s',
      },
      {
        name: 'Next.js',
        logoKey: 'nextjs',
        iconSrc: '/images/stacks/nextjs.png',
        pos: { top: '25%', left: '16%' },
        animationClass: 'animate-float-2',
        delay: '0.4s',
      },
      {
        name: 'TypeScript',
        logoKey: 'typescript',
        iconSrc: '/images/stacks/typescript.png',
        pos: { top: '48%', left: '6%' },
        animationClass: 'animate-float-3',
        delay: '0.8s',
      },
      {
        name: 'JavaScript',
        logoKey: 'javascript',
        iconSrc: '/images/stacks/javascript.png',
        pos: { top: '60%', left: '14%' },
        animationClass: 'animate-float-1',
        delay: '1.2s',
      },

      // ── Cluster 2: Styling & UI Markup (Right Side) ──────────
      {
        name: 'Tailwind CSS',
        logoKey: 'tailwind',
        iconSrc: '/images/stacks/tailwind.png',
        pos: { top: '14%', right: '8%' },
        animationClass: 'animate-float-2',
        delay: '0.3s',
      },
      {
        name: 'Bootstrap',
        logoKey: 'bootstrap',
        iconSrc: '/images/stacks/bootstrap.png',
        pos: { top: '26%', right: '16%' },
        animationClass: 'animate-float-3',
        delay: '0.7s',
      },
      {
        name: 'HTML',
        logoKey: 'html',
        iconSrc: '/images/stacks/html5.png',
        pos: { bottom: '26%', right: '14%' },
        animationClass: 'animate-float-1',
        delay: '1.1s',
      },
      {
        name: 'CSS',
        logoKey: 'css',
        iconSrc: '/images/stacks/css3.png',
        pos: { bottom: '14%', right: '6%' },
        animationClass: 'animate-float-2',
        delay: '1.5s',
      },
    ],
  },

  // ── 2. BACKEND: Inverted Dark Slate Scheme ──────────────────────────────────
  {
    id: 'backend',
    title: 'Backend',
    bg: 'var(--accent)',                    // #464642 (Maximum dark tone)
    titleColor: 'var(--surface-0)',          // #fbfbf9 (Light text)
    boxBg: 'rgba(255, 255, 255, 0.08)',     // Translucent dark-mode box
    boxBorder: 'rgba(255, 255, 255, 0.16)', // Soft light border
    boxTextColor: 'var(--surface-0)',       // Light text
    iconBg: 'rgba(255, 255, 255, 0.12)',    // Light icon badge
    iconBorder: 'rgba(255, 255, 255, 0.2)',
    fallbackTextColor: 'var(--surface-0)',
    stacks: [
      // ── Cluster 1: Node.js & Express (Top-Left) ─────────────
      {
        name: 'Node.js',
        logoKey: 'nodejs',
        iconSrc: '/images/stacks/nodejs.png',
        pos: { top: '10%', left: '8%' },
        animationClass: 'animate-float-1',
        delay: '0.2s',
      },
      {
        name: 'Express.js',
        logoKey: 'express',
        iconSrc: '/images/stacks/express.png',
        pos: { top: '22%', left: '15%' },
        animationClass: 'animate-float-2',
        delay: '0.5s',
      },

      // ── Cluster 2: Python, Flask & Java (Bottom-Left) ───────
      {
        name: 'Python',
        logoKey: 'python',
        iconSrc: '/images/stacks/python.png',
        pos: { bottom: '32%', left: '5%' },
        animationClass: 'animate-float-3',
        delay: '0.9s',
      },
      {
        name: 'Flask',
        logoKey: 'flask',
        iconSrc: '/images/stacks/flask.png',
        pos: { bottom: '18%', left: '12%' },
        animationClass: 'animate-float-1',
        delay: '1.3s',
      },
      {
        name: 'Java',
        logoKey: 'java',
        iconSrc: '/images/stacks/java.png',
        pos: { bottom: '8%', left: '22%' },
        animationClass: 'animate-float-2',
        delay: '0.4s',
      },

      // ── Cluster 3: PHP, Laravel, C#, .NET (Top-Right) ───────
      {
        name: 'Laravel',
        logoKey: 'laravel',
        iconSrc: '/images/stacks/laravel.png',
        pos: { top: '10%', right: '14%' },
        animationClass: 'animate-float-3',
        delay: '0.8s',
      },
      {
        name: 'PHP',
        logoKey: 'php',
        iconSrc: '/images/stacks/php.png',
        pos: { top: '20%', right: '5%' },
        animationClass: 'animate-float-1',
        delay: '1.0s',
      },
      {
        name: 'C#',
        logoKey: 'csharp',
        iconSrc: '/images/stacks/csharp.png',
        pos: { top: '34%', right: '16%' },
        animationClass: 'animate-float-2',
        delay: '1.4s',
      },
      {
        name: '.NET',
        logoKey: 'dotnet',
        iconSrc: '/images/stacks/dotnet.png',
        pos: { top: '44%', right: '6%' },
        animationClass: 'animate-float-3',
        delay: '0.6s',
      },

      // ── Cluster 4: Databases & ORMs (Bottom-Right) ──────────
      {
        name: 'PostgreSQL',
        logoKey: 'postgresql',
        iconSrc: '/images/stacks/postgresql.png',
        pos: { bottom: '34%', right: '5%' },
        animationClass: 'animate-float-1',
        delay: '1.1s',
      },
      {
        name: 'MySQL',
        logoKey: 'mysql',
        iconSrc: '/images/stacks/mysql.png',
        pos: { bottom: '22%', right: '15%' },
        animationClass: 'animate-float-2',
        delay: '0.3s',
      },
      {
        name: 'MariaDB',
        logoKey: 'mariadb',
        iconSrc: '/images/stacks/mariadb.png',
        pos: { bottom: '10%', right: '6%' },
        animationClass: 'animate-float-3',
        delay: '0.7s',
      },
      {
        name: 'SQL Server',
        logoKey: 'sqlserver',
        iconSrc: '/images/stacks/sqlserver.png',
        pos: { bottom: '8%', right: '22%' },
        animationClass: 'animate-float-1',
        delay: '1.2s',
      },
      {
        name: 'Prisma',
        logoKey: 'prisma',
        iconSrc: '/images/stacks/prisma.png',
        pos: { bottom: '12%', left: '46%' },
        animationClass: 'animate-float-2',
        delay: '0.9s',
      },
    ],
  },

  // ── 3. TOOLS: Reverts Back to Normal Light Theme ────────────────────────────
  {
    id: 'tools',
    title: 'Tools',
    bg: 'var(--surface-0)',
    titleColor: 'var(--accent)',
    boxBg: 'var(--surface-1)',
    boxBorder: 'var(--border)',
    boxTextColor: 'var(--foreground)',
    iconBg: 'var(--surface-0)',
    iconBorder: 'var(--border)',
    fallbackTextColor: 'var(--accent)',
    stacks: [
      // ── Cluster 1: Version Control & CI/CD (Left Side) ──────
      {
        name: 'Git',
        logoKey: 'git',
        iconSrc: '/images/stacks/git.png',
        pos: { top: '18%', left: '10%' },
        animationClass: 'animate-float-1',
        delay: '0.1s',
      },
      {
        name: 'GitHub Actions',
        logoKey: 'github',
        iconSrc: '/images/stacks/github.png',
        pos: { top: '32%', left: '18%' },
        animationClass: 'animate-float-2',
        delay: '0.6s',
      },
      {
        name: 'Figma',
        logoKey: 'figma',
        iconSrc: '/images/stacks/figma.png',
        pos: { bottom: '18%', left: '14%' },
        animationClass: 'animate-float-3',
        delay: '1.0s',
      },

      // ── Cluster 2: DevOps, Messaging & APIs (Right Side) ───
      {
        name: 'Docker',
        logoKey: 'docker',
        iconSrc: '/images/stacks/docker.png',
        pos: { top: '18%', right: '10%' },
        animationClass: 'animate-float-1',
        delay: '0.4s',
      },
      {
        name: 'RabbitMQ',
        logoKey: 'rabbitmq',
        iconSrc: '/images/stacks/rabbitmq.png',
        pos: { top: '32%', right: '18%' },
        animationClass: 'animate-float-2',
        delay: '0.8s',
      },
      {
        name: 'Postman',
        logoKey: 'postman',
        iconSrc: '/images/stacks/postman.png',
        pos: { bottom: '18%', right: '14%' },
        animationClass: 'animate-float-3',
        delay: '1.2s',
      },
    ],
  },
];
