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
  imageType: 'booth' | 'food' | 'code' | 'ai' | 'store' | 'pomodoro' | 'figma';
  imgSrc?: string;
  tags: string[];
  techLogos: ProjectTech[];
  links?: {
    live?: string;
    github?: string;
    figma?: string;
  };
}

export const PROJECTS_DATA: ProjectItem[] = [
  // ── 1. BoothEase
  {
    id: 'boothease',
    title: 'BoothEase',
    description: 'A web app to book booths at events with interactive vendor reservations and venue management.',
    category: 'EVENT BOOKING',
    cardIndex: '01',
    imageType: 'booth',
    imgSrc: '/images/boothease.jpg',
    tags: ['Fullstack Developer', 'PHP', 'Laravel', 'MariaDB'],
    techLogos: [
      { name: 'PHP', logoKey: 'php' },
      { name: 'Laravel', logoKey: 'laravel' },
      { name: 'MariaDB', logoKey: 'mariadb' },
    ],
    links: {
      github: 'https://github.com/StephenJo16/BoothEase',
    },
  },

  // ── 2. FastEats
  {
    id: 'fasteats',
    title: 'FastEats',
    description: 'A PERN app used to order food online with digital menus and streamlined checkout processing.',
    category: 'FOOD ORDERING',
    cardIndex: '02',
    imageType: 'food',
    imgSrc: '/images/fasteats.jpeg',
    tags: ['Fullstack Developer', 'React', 'Node.js', 'Express', 'PostgreSQL'],
    techLogos: [
      { name: 'React', logoKey: 'react' },
      { name: 'Node.js', logoKey: 'nodejs' },
      { name: 'Express', logoKey: 'express' },
      { name: 'PostgreSQL', logoKey: 'postgre' },
    ],
    links: {
      github: 'https://github.com/jasondarel/FastEats',
    },
  },

  // ── 3. CodeWave
  {
    id: 'codewave',
    title: 'CodeWave',
    description: 'A web application to learn programming and coding through structured guided lessons and exercises.',
    category: 'EDTECH PLATFORM',
    cardIndex: '03',
    imageType: 'code',
    imgSrc: '/images/codewave.jpeg',
    tags: ['Fullstack Developer', 'PHP', 'Laravel', 'MySQL'],
    techLogos: [
      { name: 'PHP', logoKey: 'php' },
      { name: 'Laravel', logoKey: 'laravel' },
      { name: 'MySQL', logoKey: 'mysql' },
    ],
    links: {
      github: 'https://github.com/jasondarel/CodeWave',
    },
  },

  // ── 4. NourishScan
  {
    id: 'nourishscan',
    title: 'NourishScan',
    description: 'AI App for nutrition information providing instant dietary analysis and macro breakdown.',
    category: 'AI & HEALTHCARE',
    cardIndex: '04',
    imageType: 'ai',
    imgSrc: '/images/nourishscan.png',
    tags: ['Back-End Developer', 'Python', 'Flask', 'AI'],
    techLogos: [
      { name: 'Python', logoKey: 'python' },
      { name: 'Flask', logoKey: 'flask' },
    ],
    links: {
      github: 'https://github.com/jasondarel/NourishScan',
    },
  },

  // ── 5. GymMe
  {
    id: 'gymme',
    title: 'GymMe',
    description: 'Supplement selling application featuring catalog management, cart flows, and secure ordering.',
    category: 'COMMERCE BACKEND',
    cardIndex: '05',
    imageType: 'store',
    imgSrc: '/images/gymme.png',
    tags: ['Back-End Developer', 'C#', 'ASP.NET'],
    techLogos: [
      { name: 'C#', logoKey: 'csharp' },
      { name: 'ASP.NET', logoKey: 'aspnet' },
    ],
    links: {
      github: 'https://github.com/jasondarel/GymMe',
    },
  },

  // ── 6. StudyGo
  {
    id: 'studygo',
    title: 'StudyGo',
    description: 'Pomodoro-based Learning App built to enhance productivity, focus intervals, and study pacing.',
    category: 'PRODUCTIVITY',
    cardIndex: '06',
    imageType: 'pomodoro',
    imgSrc: '/images/studygo.png',
    tags: ['Front-End Developer', 'HTML5', 'CSS3', 'JavaScript'],
    techLogos: [
      { name: 'JavaScript', logoKey: 'javascript' },
      { name: 'HTML5', logoKey: 'html' },
      { name: 'CSS3', logoKey: 'css3' },
    ],
    links: {
      live: 'https://jasondarel.github.io/StudyGo/',
    },
  },

  // ── 7. Calm
  {
    id: 'calm',
    title: 'Calm',
    description: 'Mental Health Consultation App designed with calming aesthetics and intuitive consultation flows.',
    category: 'UI/UX DESIGN',
    cardIndex: '07',
    imageType: 'figma',
    imgSrc: '/images/calm.png',
    tags: ['UI/UX Designer', 'Figma', 'Prototyping'],
    techLogos: [
      { name: 'Figma', logoKey: 'figma' },
    ],
    links: {
      figma: 'https://www.figma.com/proto/fGarXaaZl37TFyOb6mshzO/Calm?node-id=24-347&node-type=canvas&t=GnatHqOsF43NwRpS-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=38%3A555&share=1',
    },
  },

  // ── 8. StaySeeker
  {
    id: 'stayseeker',
    title: 'StaySeeker',
    description: 'Web-based Accommodation Booking App prototype with seamless property discovery and booking UX.',
    category: 'UI/UX DESIGN',
    cardIndex: '08',
    imageType: 'figma',
    imgSrc: '/images/stayseeker.png',
    tags: ['UI/UX Designer', 'Figma', 'Prototyping'],
    techLogos: [
      { name: 'Figma', logoKey: 'figma' },
    ],
    links: {
      figma: 'https://www.figma.com/proto/sIaTgozISUlysYVvxV3Zye/StaySeeker?node-id=59-251&node-type=canvas&t=bQKR8FEOSW9o1v9p-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=59%3A251&share=1',
    },
  },
];
