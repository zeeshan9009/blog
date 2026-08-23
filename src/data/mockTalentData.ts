import type { Professional, PromotionRecord, Inquiry } from '../types/talent';

export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'ali-raza',
    name: 'Ali Raza',
    title: 'Node.js Developer',
    category: 'Development',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Senior Backend Engineer with 6+ years specializing in distributed Node.js microservices, scalable REST & GraphQL APIs, MongoDB, Redis caching, and real-time WebSockets.',
    hourlyRate: 45,
    experienceYears: 6,
    score: 96,
    rating: 4.9,
    reviewCount: 120,
    skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'TypeScript', 'Docker', 'AWS'],
    detailedSkills: [
      { name: 'Node.js', level: 'Expert' },
      { name: 'Express', level: 'Expert' },
      { name: 'MongoDB', level: 'Expert' },
      { name: 'Redis', level: 'Intermediate' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'AWS', level: 'Intermediate' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Lead Backend Architect',
        company: 'CloudScale Technologies',
        period: '2023 - Present',
        description: 'Architected high-throughput API gateway processing 50M+ requests monthly with 99.98% uptime.'
      },
      {
        id: 'exp-2',
        role: 'Senior Node.js Developer',
        company: 'Innovatech Solutions',
        period: '2020 - 2023',
        description: 'Developed scalable microservices, integrated payment processors, and reduced server response latency by 40%.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Fintech Microservices Gateway',
        description: 'Real-time transaction authorization engine built with Node.js, Express, Kafka, and Redis caching.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/project1',
        githubUrl: 'https://github.com/aliraza/fintech-gateway',
        tags: ['Node.js', 'Redis', 'Kafka', 'Docker']
      },
      {
        id: 'port-2',
        title: 'SaaS Multi-tenant CRM Backend',
        description: 'Robust RESTful API with role-based access control, automated invoice generation, and audit logging.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/project2',
        tags: ['Express', 'MongoDB', 'JWT', 'TypeScript']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Sarah Jenkins',
        rating: 5,
        comment: 'Ali delivered an exceptionally fast Node.js backend under a tight deadline. Code quality was pristine!',
        date: '2 weeks ago',
        project: 'API Modernization'
      },
      {
        id: 'rev-2',
        clientName: 'David Vance',
        rating: 5,
        comment: 'Outstanding engineer. Fixed complex database bottleneck issues and improved our platform speed tremendously.',
        date: '1 month ago',
        project: 'Performance Optimization'
      }
    ],
    externalLinks: {
      linkedin: 'https://linkedin.com/in/aliraza-dev',
      github: 'https://github.com/aliraza-backend',
      upwork: 'https://upwork.com/freelancers/~0123456789',
      fiverr: 'https://fiverr.com/aliraza_pro',
      website: 'https://aliraza.dev'
    },
    isVerified: true,
    isPromoted: true,
    promotionExpiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(), // 19 hours remaining
    viewsCount: 3420,
    clicksCount: 890,
    inquiriesCount: 47,
    createdAt: '2025-10-15T08:00:00.000Z'
  },
  {
    id: 'ahmed-khan',
    name: 'Ahmed Khan',
    title: 'Full Stack Developer',
    category: 'Development',
    location: 'Islamabad, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Full Stack Developer with 5+ years of experience in React, Next.js, Node.js, and TypeScript. Passionate about crafting lightning-fast web applications with modern UI/UX.',
    hourlyRate: 50,
    experienceYears: 5,
    score: 95,
    rating: 4.8,
    reviewCount: 98,
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL'],
    detailedSkills: [
      { name: 'React', level: 'Expert' },
      { name: 'Next.js', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'Node.js', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'PostgreSQL', level: 'Intermediate' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Full Stack Engineer',
        company: 'Apex Digital Labs',
        period: '2022 - Present',
        description: 'Led a team of 4 engineers building enterprise dashboard software for global logistics clients.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Nexus Analytics SaaS',
        description: 'Next.js 14 based dashboard with real-time charts, SSR, dynamic routing, and Supabase auth.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/nexus',
        tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Michael Thorne',
        rating: 5,
        comment: 'Ahmed transformed our clunky web app into a sleek, responsive Next.js application. Highly recommended!',
        date: '3 weeks ago',
        project: 'Web App Redesign'
      }
    ],
    externalLinks: {
      linkedin: 'https://linkedin.com/in/ahmedkhan-dev',
      github: 'https://github.com/ahmedkhan-stack',
      upwork: 'https://upwork.com/freelancers/~0987654321',
      website: 'https://ahmedkhan.io'
    },
    isVerified: true,
    isPromoted: true,
    promotionExpiresAt: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    viewsCount: 2890,
    clicksCount: 710,
    inquiriesCount: 38,
    createdAt: '2025-11-01T10:00:00.000Z'
  },
  {
    id: 'usman-javaid',
    name: 'Usman Javaid',
    title: 'React Developer',
    category: 'Development',
    location: 'Karachi, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Frontend specialist building interactive, accessible, and high-performance user interfaces with React, Tailwind CSS, Redux Toolkit, and Vite.',
    hourlyRate: 40,
    experienceYears: 4,
    score: 93,
    rating: 4.7,
    reviewCount: 76,
    skills: ['React', 'Tailwind CSS', 'JavaScript', 'Redux', 'REST APIs', 'Figma to Code'],
    detailedSkills: [
      { name: 'React', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'JavaScript', level: 'Expert' },
      { name: 'Redux', level: 'Intermediate' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Frontend Developer',
        company: 'WebSphere Studio',
        period: '2021 - Present',
        description: 'Developed 30+ client web applications with strict pixel-perfect fidelity from Figma designs.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Crypto Asset Portfolio Manager',
        description: 'Interactive dashboard with live price feeds, dark mode toggle, and transaction history.',
        imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/cryptoview',
        tags: ['React', 'Tailwind CSS', 'Chart.js']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Alex Carter',
        rating: 5,
        comment: 'Super fast turnaround and great communication throughout the project.',
        date: '1 month ago',
        project: 'React Component Library'
      }
    ],
    externalLinks: {
      linkedin: 'https://linkedin.com/in/usmanjavaid-react',
      github: 'https://github.com/usmanjavaid',
      fiverr: 'https://fiverr.com/usman_react',
      upwork: 'https://upwork.com/freelancers/~0334455667'
    },
    isVerified: true,
    isPromoted: true,
    promotionExpiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    viewsCount: 1950,
    clicksCount: 520,
    inquiriesCount: 29,
    createdAt: '2025-12-05T12:00:00.000Z'
  },
  {
    id: 'sara-khan',
    name: 'Sara Khan',
    title: 'UI/UX Designer & Brand Strategist',
    category: 'Design',
    location: 'Dubai, UAE',
    country: 'UAE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Product Designer with 7+ years shaping intuitive SaaS digital experiences, design systems, interactive prototypes, and conversion-optimized mobile interfaces.',
    hourlyRate: 65,
    experienceYears: 7,
    score: 97,
    rating: 5.0,
    reviewCount: 142,
    skills: ['UI/UX Design', 'Figma', 'Design Systems', 'Wireframing', 'Prototyping', 'User Research', 'Mobile App Design'],
    detailedSkills: [
      { name: 'UI/UX Design', level: 'Expert' },
      { name: 'Figma', level: 'Expert' },
      { name: 'Design Systems', level: 'Expert' },
      { name: 'User Research', level: 'Expert' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Principal Product Designer',
        company: 'Studio Lumina',
        period: '2022 - Present',
        description: 'Redesigned core booking flow for a travel tech startup, resulting in a 34% increase in checkout conversions.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Aurora Banking App Redesign',
        description: 'Complete end-to-end design system and high-fidelity prototypes for iOS & Android fintech application.',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://dribbble.com/shots/aurora',
        tags: ['Figma', 'Mobile UI', 'Fintech', 'Design System']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Claire Beaumont',
        rating: 5,
        comment: 'Sara is in a league of her own. Her attention to typography, micro-interactions, and usability is world-class.',
        date: '1 week ago',
        project: 'SaaS Design System'
      }
    ],
    externalLinks: {
      linkedin: 'https://linkedin.com/in/sarakhan-design',
      upwork: 'https://upwork.com/freelancers/~0778899001',
      website: 'https://sarakhan.design'
    },
    isVerified: true,
    isPromoted: false,
    viewsCount: 4210,
    clicksCount: 1100,
    inquiriesCount: 63,
    createdAt: '2025-09-10T09:00:00.000Z'
  },
  {
    id: 'bilal-ahmed',
    name: 'Bilal Ahmed',
    title: 'WordPress & WooCommerce Expert',
    category: 'Development',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    bio: 'Custom WordPress theme and plugin developer. Speed optimization specialist delivering 95+ Google PageSpeed scores, WooCommerce custom checkouts, and secure deployments.',
    hourlyRate: 35,
    experienceYears: 6,
    score: 92,
    rating: 4.9,
    reviewCount: 110,
    skills: ['WordPress', 'WooCommerce', 'PHP', 'Speed Optimization', 'Elementor', 'ACF Pro', 'MySQL'],
    detailedSkills: [
      { name: 'WordPress', level: 'Expert' },
      { name: 'PHP', level: 'Expert' },
      { name: 'Speed Optimization', level: 'Expert' },
      { name: 'WooCommerce', level: 'Expert' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Senior WordPress Architect',
        company: 'PixelWP Agency',
        period: '2020 - Present',
        description: 'Built over 150+ custom WordPress websites and optimized high-traffic eCommerce storefronts.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Luxury Fashion eCommerce Store',
        description: 'Custom WooCommerce theme with AJAX cart, custom product filters, and sub-1-second load times.',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/luxurystore',
        tags: ['WordPress', 'WooCommerce', 'PHP', 'Tailwind']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Oliver Smith',
        rating: 5,
        comment: 'Bilal took our store from a sluggish 32 on PageSpeed to a blazing 98! Sales jumped immediately.',
        date: '2 weeks ago',
        project: 'Store Optimization'
      }
    ],
    externalLinks: {
      fiverr: 'https://fiverr.com/bilal_wp',
      upwork: 'https://upwork.com/freelancers/~0556677889',
      linkedin: 'https://linkedin.com/in/bilalahmed-wp'
    },
    isVerified: true,
    isPromoted: false,
    viewsCount: 2450,
    clicksCount: 680,
    inquiriesCount: 35,
    createdAt: '2025-10-20T11:00:00.000Z'
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    title: 'Python & AI Engineer',
    category: 'Development',
    location: 'Berlin, Germany',
    country: 'Germany',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    bio: 'Python Engineer specializing in FastAPI, LangChain, OpenAI API integration, vector databases (Pinecone/Qdrant), automated scrapers, and data pipelines.',
    hourlyRate: 75,
    experienceYears: 5,
    score: 98,
    rating: 5.0,
    reviewCount: 88,
    skills: ['Python', 'FastAPI', 'LangChain', 'OpenAI API', 'PyTorch', 'PostgreSQL', 'Docker'],
    detailedSkills: [
      { name: 'Python', level: 'Expert' },
      { name: 'FastAPI', level: 'Expert' },
      { name: 'LangChain', level: 'Expert' },
      { name: 'Docker', level: 'Intermediate' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'AI Systems Engineer',
        company: 'Synthetica AI',
        period: '2023 - Present',
        description: 'Built RAG pipelines and custom enterprise AI agents handling 250,000+ daily document queries.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'DocuChat AI - Enterprise Knowledge Assistant',
        description: 'FastAPI microservice with hybrid search, vector embeddings, and real-time streaming responses.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/docuchat',
        githubUrl: 'https://github.com/elenarostova/docuchat',
        tags: ['Python', 'FastAPI', 'LangChain', 'Pinecone']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Thomas Becker',
        rating: 5,
        comment: 'Elena built our AI knowledge base in record time. Deep technical knowledge and exceptional work ethic.',
        date: '5 days ago',
        project: 'AI Agent Development'
      }
    ],
    externalLinks: {
      github: 'https://github.com/elenarostova',
      linkedin: 'https://linkedin.com/in/elena-rostova-ai',
      website: 'https://rostova.ai'
    },
    isVerified: true,
    isPromoted: true,
    promotionExpiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
    viewsCount: 3880,
    clicksCount: 940,
    inquiriesCount: 52,
    createdAt: '2025-11-15T14:00:00.000Z'
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    title: 'Senior SEO & Growth Strategist',
    category: 'Marketing',
    location: 'Singapore',
    country: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    bio: 'Data-driven SEO strategist helping SaaS and eCommerce platforms scale organic traffic. Expertise in technical SEO audits, programmatic content, keyword architecture, and link growth.',
    hourlyRate: 60,
    experienceYears: 8,
    score: 94,
    rating: 4.9,
    reviewCount: 95,
    skills: ['SEO', 'Technical SEO', 'Content Strategy', 'Google Analytics', 'Ahrefs', 'Digital Marketing'],
    detailedSkills: [
      { name: 'SEO', level: 'Expert' },
      { name: 'Technical SEO', level: 'Expert' },
      { name: 'Google Analytics', level: 'Expert' },
      { name: 'Digital Marketing', level: 'Expert' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Head of Growth',
        company: 'HyperGrowth Agency',
        period: '2021 - Present',
        description: 'Scaled organic monthly active users from 20k to 650k for a B2B SaaS platform in 14 months.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'B2B SaaS 10x Organic Traffic Scale',
        description: 'Comprehensive keyword clustering and site architecture overhaul yielding +840% organic revenue.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/casestudy-seo',
        tags: ['SEO', 'Growth', 'Analytics', 'SaaS']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Daniel Vance',
        rating: 5,
        comment: 'Marcus delivered actionable insights on day one. Our organic impressions tripled within 60 days.',
        date: '3 weeks ago',
        project: 'SEO Site Audit & Execution'
      }
    ],
    externalLinks: {
      linkedin: 'https://linkedin.com/in/marcuschen-growth',
      upwork: 'https://upwork.com/freelancers/~0112233445',
      website: 'https://marcuschen.co'
    },
    isVerified: true,
    isPromoted: false,
    viewsCount: 2780,
    clicksCount: 610,
    inquiriesCount: 31,
    createdAt: '2025-10-05T07:00:00.000Z'
  },
  {
    id: 'sophia-rodriguez',
    name: 'Sophia Rodriguez',
    title: 'Flutter & Mobile App Engineer',
    category: 'Mobile',
    location: 'Barcelona, Spain',
    country: 'Spain',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    bio: 'Cross-platform mobile developer creating smooth, reactive iOS and Android applications with Flutter, Dart, Riverpod state management, Firebase, and native platform channels.',
    hourlyRate: 55,
    experienceYears: 5,
    score: 95,
    rating: 4.9,
    reviewCount: 64,
    skills: ['Flutter', 'Dart', 'Firebase', 'iOS Development', 'Android Development', 'REST APIs', 'UI Design'],
    detailedSkills: [
      { name: 'Flutter', level: 'Expert' },
      { name: 'Dart', level: 'Expert' },
      { name: 'Firebase', level: 'Expert' }
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Mobile Engineer',
        company: 'AppVenture Studios',
        period: '2022 - Present',
        description: 'Shipped 8 production Flutter applications to Apple App Store and Google Play Store with 4.8+ avg user rating.'
      }
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Zenith Habit & Focus Tracker',
        description: 'Cross-platform productivity application with offline-first sync, haptics, and custom interactive widgets.',
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
        liveUrl: 'https://example.com/zenithapp',
        tags: ['Flutter', 'Dart', 'Firebase', 'Mobile UI']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Lucas Mendez',
        rating: 5,
        comment: 'Sophia is one of the best Flutter devs we have ever worked with. Clean architecture and fluid 60fps animations.',
        date: '2 weeks ago',
        project: 'Fitness App Build'
      }
    ],
    externalLinks: {
      github: 'https://github.com/sophiarodriguez',
      linkedin: 'https://linkedin.com/in/sophia-rodriguez-mobile',
      upwork: 'https://upwork.com/freelancers/~0667788990'
    },
    isVerified: true,
    isPromoted: false,
    viewsCount: 2190,
    clicksCount: 490,
    inquiriesCount: 26,
    createdAt: '2025-12-01T15:00:00.000Z'
  }
];

export const INITIAL_PROMOTIONS: PromotionRecord[] = [
  {
    id: 'promo-101',
    professionalId: 'ali-raza',
    professionalName: 'Ali Raza',
    amount: 1,
    durationHours: 24,
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Credit Card (Stripe)',
    status: 'active',
    transactionId: 'TXN-98421'
  },
  {
    id: 'promo-102',
    professionalId: 'ahmed-khan',
    professionalName: 'Ahmed Khan',
    amount: 1,
    durationHours: 24,
    startedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'PayPal',
    status: 'active',
    transactionId: 'TXN-98319'
  },
  {
    id: 'promo-103',
    professionalId: 'usman-javaid',
    professionalName: 'Usman Javaid',
    amount: 1,
    durationHours: 24,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Apple Pay',
    status: 'active',
    transactionId: 'TXN-98544'
  },
  {
    id: 'promo-104',
    professionalId: 'elena-rostova',
    professionalName: 'Elena Rostova',
    amount: 1,
    durationHours: 24,
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Credit Card (Stripe)',
    status: 'active',
    transactionId: 'TXN-98510'
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    professionalId: 'ali-raza',
    professionalName: 'Ali Raza',
    clientName: 'Jonathan Hayes',
    clientEmail: 'jonathan@finovate.io',
    subject: 'Node.js Microservices Architecture Consultation',
    message: 'Hello Ali, we are rebuilding our real-time payment gateway and love your experience with Node.js and Redis. Are you available for a 3-month contract starting next month?',
    budget: '$5,000 - $10,000',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'unread'
  },
  {
    id: 'inq-2',
    professionalId: 'ali-raza',
    professionalName: 'Ali Raza',
    clientName: 'Jessica Taylor',
    clientEmail: 'jessica@healthstack.co',
    subject: 'Backend API optimization & Dockerization',
    message: 'Hi Ali, we need assistance streamlining our Express backend and optimizing MongoDB queries.',
    budget: '$2,000 - $4,000',
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    status: 'replied'
  }
];

export const POPULAR_SKILLS_LIST = [
  { name: 'Node.js', count: '1,420+' },
  { name: 'React', count: '2,850+' },
  { name: 'Next.js', count: '1,980+' },
  { name: 'Python', count: '2,150+' },
  { name: 'Laravel', count: '890+' },
  { name: 'PHP', count: '1,120+' },
  { name: 'Flutter', count: '940+' },
  { name: 'WordPress', count: '1,670+' },
  { name: 'UI/UX Design', count: '1,890+' },
  { name: 'Graphic Design', count: '1,340+' },
  { name: 'SEO', count: '1,110+' },
  { name: 'Digital Marketing', count: '1,430+' },
  { name: 'Video Editing', count: '870+' },
  { name: 'Content Writing', count: '1,250+' }
];
