import type { Program, Intake, ClassGroup } from "@/lib/types";

export const programs: Program[] = [
  // Technology
  {
    id: "prog-fullstack",
    slug: "full-stack-development",
    code: "FSD",
    name: "Full-Stack Software Development",
    category: "technology",
    description:
      "Build complete web applications, from front-end interfaces to back-end services and databases.",
    overview:
      "This program takes you through the full web development lifecycle, from building user interfaces to designing back-end services, working with databases, and deploying applications. You'll work on practical projects that mirror real industry workflows.",
    whatYouWillLearn: [
      "Build responsive user interfaces with modern front-end frameworks",
      "Design and build back-end services and APIs",
      "Work with relational databases and data modeling",
      "Use version control and collaborative development workflows",
      "Deploy and maintain web applications",
    ],
    learningModes: ["physical", "online"],
    featured: true,
    isActive: true,
  },
  {
    id: "prog-frontend",
    slug: "frontend-development",
    code: "FE",
    name: "Frontend Development",
    category: "technology",
    description: "Focus on building fast, accessible, and well-structured user interfaces for the web.",
    overview:
      "A focused track on front-end engineering: structuring interfaces, working with modern JavaScript frameworks, and building interfaces that are responsive, accessible, and maintainable.",
    whatYouWillLearn: [
      "Structure web pages with semantic HTML and modern CSS",
      "Build interactive interfaces with JavaScript and a modern framework",
      "Apply responsive and accessible design practices",
      "Work with APIs to render dynamic data",
    ],
    learningModes: ["physical", "online"],
    isActive: true,
  },
  {
    id: "prog-backend",
    slug: "backend-development",
    code: "BE",
    name: "Backend Development",
    category: "technology",
    description: "Design and build the server-side systems that power web and mobile applications.",
    overview:
      "This program covers server-side programming, API design, database management, and the fundamentals of building reliable back-end systems for real applications.",
    whatYouWillLearn: [
      "Design and build RESTful APIs",
      "Work with databases and data modeling",
      "Apply authentication and authorization fundamentals",
      "Structure and organize server-side applications",
    ],
    learningModes: ["physical", "online"],
    isActive: true,
  },
  {
    id: "prog-uiux",
    slug: "ui-ux-design",
    code: "UIUX",
    name: "UI/UX Design",
    category: "technology",
    description: "Research, design, and test digital products that are usable and intuitive.",
    overview:
      "A practical design program covering the end-to-end product design process: user research, wireframing, prototyping, and usability testing, using industry-standard design tools.",
    whatYouWillLearn: [
      "Conduct basic user research and translate it into design decisions",
      "Create wireframes and interactive prototypes",
      "Apply visual design and design systems thinking",
      "Test and iterate on designs based on user feedback",
    ],
    learningModes: ["physical", "online"],
    isActive: true,
  },
  {
    id: "prog-ai",
    slug: "artificial-intelligence",
    code: "AI",
    name: "Artificial Intelligence",
    category: "technology",
    description: "An introduction to practical AI and machine learning concepts and tools.",
    overview:
      "This program introduces the fundamentals of artificial intelligence and machine learning, with an emphasis on practical, applied use cases rather than pure theory.",
    whatYouWillLearn: [
      "Understand core machine learning concepts and workflows",
      "Work with data preparation and model training basics",
      "Apply pre-built AI tools and APIs to real problems",
      "Explore responsible, practical use of AI in projects",
    ],
    learningModes: ["physical", "online"],
    isActive: true,
  },

  // Digital Business
  {
    id: "prog-digital-marketing",
    slug: "digital-marketing-social-media",
    code: "DMSM",
    name: "Digital Marketing & Social Media Management",
    category: "digital_business",
    description: "Plan, run, and measure marketing campaigns across digital and social channels.",
    overview:
      "A practical program covering digital marketing strategy, content planning, and social media management, aimed at preparing learners to manage real online marketing campaigns.",
    whatYouWillLearn: [
      "Plan content and campaigns across social media platforms",
      "Apply core digital marketing and advertising concepts",
      "Use analytics to measure and adjust campaign performance",
      "Manage a brand's online presence and community",
    ],
    learningModes: ["physical", "online", "offsite"],
    featured: true,
    isActive: true,
  },

  // Creative Production
  {
    id: "prog-video-production",
    slug: "video-production",
    code: "VID",
    name: "Video Production",
    category: "creative_production",
    description: "Learn the full video production process, from planning to filming and editing.",
    overview:
      "A hands-on program covering pre-production planning, camera work, lighting, and editing, using real projects to build a practical production portfolio.",
    whatYouWillLearn: [
      "Plan and storyboard video projects",
      "Operate cameras and lighting for different production settings",
      "Edit footage using industry-standard editing software",
      "Deliver finished video projects from concept to final cut",
    ],
    learningModes: ["physical", "offsite"],
    featured: true,
    isActive: true,
  },
  {
    id: "prog-live-streaming",
    slug: "live-streaming",
    code: "LIVE",
    name: "Live Streaming",
    category: "creative_production",
    description: "Learn to plan, set up, and run live streamed events and broadcasts.",
    overview:
      "This program covers the technical and operational side of live streaming: equipment setup, streaming software, and running smooth live broadcasts for events and online audiences.",
    whatYouWillLearn: [
      "Set up cameras, audio, and streaming equipment",
      "Operate live streaming and switching software",
      "Manage live production workflow during a broadcast",
      "Troubleshoot common live streaming issues",
    ],
    learningModes: ["physical", "offsite"],
    isActive: true,
  },
  {
    id: "prog-photography",
    slug: "photography",
    code: "PHOTO",
    name: "Photography",
    category: "creative_production",
    description: "Build practical photography skills across studio, event, and outdoor settings.",
    overview:
      "A practical photography program covering camera fundamentals, lighting, composition, and post-processing, with hands-on shooting sessions in different settings.",
    whatYouWillLearn: [
      "Understand camera settings and exposure fundamentals",
      "Apply lighting and composition techniques",
      "Shoot in studio, event, and outdoor settings",
      "Edit and retouch photos using industry-standard software",
    ],
    learningModes: ["physical", "offsite"],
    isActive: true,
  },
  {
    id: "prog-animation",
    slug: "animation",
    code: "ANIM",
    name: "Animation",
    category: "creative_production",
    description: "Learn the fundamentals of animation and motion design.",
    overview:
      "This program introduces animation principles and workflows, guiding learners from basic motion concepts to producing short animated pieces using industry tools.",
    whatYouWillLearn: [
      "Apply core principles of motion and animation",
      "Work with animation and motion design software",
      "Storyboard and plan animated sequences",
      "Produce short animated projects",
    ],
    learningModes: ["physical", "online"],
    isActive: true,
  },
  {
    id: "prog-audio-production",
    slug: "audio-production",
    code: "AUDIO",
    name: "Audio Production",
    category: "creative_production",
    description: "Learn studio audio recording, editing, and mixing fundamentals.",
    overview:
      "A hands-on program covering the audio production workflow: recording, editing, mixing, and preparing final audio for release, using a working studio environment.",
    whatYouWillLearn: [
      "Set up and operate studio recording equipment",
      "Edit and clean up recorded audio",
      "Apply basic mixing techniques",
      "Prepare and export finished audio projects",
    ],
    learningModes: ["physical"],
    isActive: true,
  },
  {
    id: "prog-beat-making",
    slug: "beat-making-music-production",
    code: "BEAT",
    name: "Beat Making / Music Production",
    category: "creative_production",
    description: "Learn to produce original beats and instrumentals using modern production tools.",
    overview:
      "This program covers music production fundamentals: composing beats, working with production software, and arranging tracks from idea to finished instrumental.",
    whatYouWillLearn: [
      "Work with digital audio workstations and production software",
      "Compose and arrange original beats and instrumentals",
      "Apply basic sound design and sampling techniques",
      "Prepare tracks for mixing and release",
    ],
    learningModes: ["physical"],
    isActive: true,
  },
  {
    id: "prog-vocal-recording",
    slug: "vocal-recording-mixing",
    code: "VOCAL",
    name: "Vocal Recording & Mixing",
    category: "creative_production",
    description: "Learn professional vocal recording, editing, and mixing techniques.",
    overview:
      "A focused program on capturing and mixing vocal performances, covering microphone technique, recording workflow, and vocal mixing in a studio environment.",
    whatYouWillLearn: [
      "Apply proper microphone technique for vocal recording",
      "Record clean, usable vocal takes",
      "Edit and comp vocal recordings",
      "Apply basic vocal mixing techniques",
    ],
    learningModes: ["physical"],
    isActive: true,
  },

  // Professional Development
  {
    id: "prog-professional-skills",
    slug: "professional-skills-training",
    code: "PROF",
    name: "Professional Skills Training",
    category: "professional_development",
    description: "Build workplace-ready communication, teamwork, and professional development skills.",
    overview:
      "A practical program focused on the professional skills that support any career path: communication, workplace etiquette, teamwork, and personal effectiveness.",
    whatYouWillLearn: [
      "Apply effective workplace communication skills",
      "Build strong teamwork and collaboration habits",
      "Develop time management and personal effectiveness practices",
      "Prepare for job applications and interviews",
    ],
    learningModes: ["physical", "online"],
    featured: true,
    isActive: true,
  },
];

// Internal admin/student architecture data — not shown on public pages.
export const intakes: Intake[] = [
  {
    id: "intake-1",
    programId: "prog-fullstack",
    label: "Cohort A",
    status: "open",
    startDate: "2026-02-02",
    endDate: "2026-08-01",
    applicationDeadline: "2026-01-16",
  },
  {
    id: "intake-2",
    programId: "prog-uiux",
    label: "Cohort B",
    status: "upcoming",
    startDate: "2026-03-02",
    endDate: "2026-07-01",
    applicationDeadline: "2026-02-16",
  },
];

export const classGroups: ClassGroup[] = [
  {
    id: "class-1",
    intakeId: "intake-1",
    name: "FSD-2026-A",
    capacity: 25,
    status: "active",
    homeRoom: "Lab 3",
    staffLeadId: "staff-1",
  },
  {
    id: "class-2",
    intakeId: "intake-2",
    name: "UIUX-2026-A",
    capacity: 20,
    status: "upcoming",
    homeRoom: "Studio 1",
  },
];
