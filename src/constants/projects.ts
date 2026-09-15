export interface ProjectTech {
  name: string;
  logoKey: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  features?: string[];
  role?: string;
  year?: string;
  category: string;
  cardIndex: string;
  imageType: 'booth' | 'food' | 'code' | 'ai' | 'store' | 'pomodoro' | 'figma';
  imgSrc?: string;
  images?: string[];
  tags: string[];
  techLogos: ProjectTech[];
  links?: {
    live?: string;
    github?: string;
    figma?: string;
  };
}

export const PROJECTS_DATA: ProjectItem[] = [
  // ── 1. FastEats
  {
    id: 'fasteats',
    title: 'FastEats',
    description: 'Food ordering platform with digital menus and seamless cart checkout.',
    longDescription:
      'FastEats is a web application built to make ordering from local eateries straightforward. Customers can browse restaurant menus, customize items, manage their cart in real time, and check out seamlessly. I built the backend with Node and Express on top of a PostgreSQL database to handle menu inventory, user orders, and order history.',
    features: [
      'Browse categorized digital restaurant menus with live price updates',
      'Persistent shopping cart with instant quantity adjustments',
      'RESTful API built with Express and Node.js for order management',
      'Relational database in PostgreSQL tracking items, users, and order statuses',
      'Mobile-friendly interface built with React for quick ordering',
    ],
    role: 'Full-Stack Developer',
    year: '2024',
    category: 'FOOD ORDERING',
    cardIndex: '01',
    imageType: 'food',
    imgSrc: '/images/fasteats.jpeg',
    images: ['/images/fasteats.jpeg', '/images/fasteats2.png', '/images/fasteats3.png'],
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

  // ── 2. NourishScan
  {
    id: 'nourishscan',
    title: 'NourishScan',
    description: 'AI nutrition tracker estimating calories and macros from meal photos.',
    longDescription:
      'NourishScan helps users keep track of what they eat by snapping or uploading a photo of their meal. The backend uses Python and Flask along with an AI model to detect food items on the plate and provide an estimated breakdown of calories, protein, carbs, and fats.',
    features: [
      'Photo-based food recognition to quickly log daily meals',
      'Nutritional breakdown showing estimated calories, carbs, protein, and fat',
      'Lightweight Python Flask API handling image uploads and model predictions',
      'Custom dietary tags and quick allergen alerts for common ingredients',
    ],
    role: 'Back-End Developer',
    year: '2024',
    category: 'AI & HEALTHCARE',
    cardIndex: '02',
    imageType: 'ai',
    imgSrc: '/images/nourishscan.png',
    images: ['/images/nourishscan.png', '/images/nourish1.png', '/images/nourish2.png'],
    tags: ['Back-End Developer', 'Python', 'Flask', 'AI'],
    techLogos: [
      { name: 'Python', logoKey: 'python' },
      { name: 'Flask', logoKey: 'flask' },
    ],
    links: {
      github: 'https://github.com/jasondarel/NourishScan',
    },
  },

  // ── 3. BoothEase
  {
    id: 'boothease',
    title: 'BoothEase',
    description: 'Exhibition booth booking platform with interactive venue floor plans.',
    longDescription:
      'BoothEase was created to simplify how event organizers rent out stalls and how vendors reserve their spots. Instead of relying on manual forms or spreadsheets, vendors can view a venue floor map, pick available booths based on size and price, and confirm their booking through an organized dashboard.',
    features: [
      'Visual venue floor plan allowing vendors to browse and select available stalls',
      'Vendor dashboard for tracking reservations, booth details, and invoices',
      'Admin portal for organizers to manage event layouts and review bookings',
      'MariaDB database structure ensuring stalls cannot be booked twice simultaneously',
    ],
    role: 'Full-Stack Developer',
    year: '2024',
    category: 'EVENT BOOKING',
    cardIndex: '03',
    imageType: 'booth',
    imgSrc: '/images/boothease.jpg',
    images: ['/images/boothease.jpg', '/images/boothease1.png', '/images/boothease2.png'],
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

  // ── 4. CodeWave
  {
    id: 'codewave',
    title: 'CodeWave',
    description: 'Course enrollment platform with structured programming learning paths.',
    longDescription:
      'CodeWave is a course platform built with PHP Laravel and MySQL. Users can explore available programming courses, enroll in the topics they want to learn, and read through organized module materials at their own pace.',
    features: [
      'Course catalog to browse and discover programming subjects',
      'Enrollment system allowing students to register for courses they want to learn',
      'Structured reading materials and modular lessons with code snippets',
      'Student dashboard for viewing and managing enrolled courses',
      'Backend built with Laravel and MySQL handling user accounts, courses, and enrollments',
    ],
    role: 'Full-Stack Developer',
    year: '2024',
    category: 'EDTECH PLATFORM',
    cardIndex: '04',
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

  // ── 5. Fiomodoro
  {
    id: 'fiomodoro',
    title: 'Fiomodoro',
    description: 'Minimalist Pomodoro timer and study companion with session tracking.',
    longDescription:
      'Fiomodoro is a clean, distraction-free Pomodoro web app built with React and TypeScript. It lets you customize focus sessions and breaks, tracks your daily completed intervals, and plays subtle audio alerts so you can stay in the zone without constantly watching the clock.',
    features: [
      'Customizable intervals for focus sessions, short breaks, and long breaks',
      'Session tracker that saves your daily completed pomodoros locally',
      'Gentle sound effects and browser tab notifications when intervals finish',
      'Minimalist, keyboard-accessible interface with zero distractions',
    ],
    role: 'Front-End Developer',
    year: '2025',
    category: 'PRODUCTIVITY',
    cardIndex: '05',
    imageType: 'pomodoro',
    imgSrc: '/images/fiomodoro.png',
    tags: ['Front-End Developer', 'React', 'TypeScript'],
    techLogos: [
      { name: 'React', logoKey: 'react' },
      { name: 'TypeScript', logoKey: 'typescript' },
    ],
    links: {
      live: 'https://fiomodoro.vercel.app/',
      github: 'https://github.com/jasondarel/Fiomodoro',
    },
  },

  // ── 6. GymMe
  {
    id: 'gymme',
    title: 'GymMe',
    description: 'Fitness supplement e-commerce store with integrated order management.',
    longDescription:
      'GymMe is a fitness supplement web shop built with C# and ASP.NET. Users can browse products by category, filter by fitness goal, add items to their shopping cart, and place orders through a step-by-step checkout flow. The back-end also includes basic admin functionality for managing product stock and reviewing customer orders.',
    features: [
      'Product catalog with category filtering and real-time stock availability',
      'Shopping cart with item adjustments and checkout summary',
      'Backend built with C# and ASP.NET handling order processing and sessions',
      'Admin dashboard to add, edit, or update supplement inventory and view orders',
    ],
    role: 'Back-End Developer',
    year: '2023',
    category: 'COMMERCE BACKEND',
    cardIndex: '06',
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

  // ── 7. Calm
  {
    id: 'calm',
    title: 'Calm',
    description: 'Therapist matching and appointment booking mobile UI/UX concept.',
    longDescription:
      'Calm is a mobile app concept designed in Figma to make finding and booking mental health support feel warm and approachable. The flow guides users through a gentle self-check questionnaire, matches them with verified licensed therapists based on their needs, and lets them schedule chat or video sessions with ease.',
    features: [
      'Thoughtfully designed onboarding flow with a guided mood check-in',
      'Therapist discovery screens with doctor profiles, specialties, and reviews',
      'Seamless appointment booking interface for video and in-person consultations',
      'Complete mobile design system with calming color palette and accessible typography',
    ],
    role: 'UI/UX Designer',
    year: '2023',
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
    description: 'Holiday accommodation booking prototype with interactive stay search.',
    longDescription:
      'StaySeeker is a web prototype designed in Figma for discovering and booking holiday stays and rentals. The layout emphasizes clean visuals, clear pricing breakdowns without hidden fees, and an intuitive map-based search so travelers can easily compare properties and check amenities before booking.',
    features: [
      'Map and grid search view with filters for location, dates, guests, and price',
      'Detailed property pages featuring photo galleries, amenity lists, and host info',
      'Transparent checkout flow with total price breakdown and cancellation policies',
      'Reusable component system with responsive layouts and interactive states',
    ],
    role: 'UI/UX Designer',
    year: '2023',
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
