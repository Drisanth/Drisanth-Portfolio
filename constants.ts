import { Project, Experience, Education, SkillNode } from './types';

export const PROFILE = {
  name: "Drisanth M",
  tagline: "Interactive Developer & AI Engineer",
  about: "Motivated student eager to apply classroom knowledge to real-world experiences. Integrated M.Tech in CSE student with a passion for Full-Stack Development, AI-driven Systems, and Hardware-Software co-design.",
  email: "drisanth.m@example.com",
  github: "github.com/Drisanth",
  linkedin: "linkedin.com/in/drisanth"
};

export const PROJECTS: Project[] = [
  {
    id: "aura-system",
    title: "AURA: Multi-Agent Device Health",
    description: "Architected a multi-agent autonomous system to monitor device telemetry and predict hardware failures across IoT and mobile platforms. Designed hierarchical agent workflows reducing fault resolution time by 42%.",
    tech: ["Python", "TensorFlow", "PyTorch", "Gemini API", "Node.js", "React"],
    category: "AI",
    metrics: "42% faster resolution",
    repoUrl: "https://github.com/Drisanth/AURA"
  },
  {
    id: "phishtrac",
    title: "PhishTRac: Anti-Phishing System",
    description: "Adaptive multi-view phishing detection system using BERT-based NLP and domain reputation analysis. Features adaptive retraining via user feedback and a Chrome extension for real-time analytics.",
    tech: ["Python", "Flask", "BERT", "Scikit-learn", "JavaScript", "HTML/CSS"],
    category: "Security",
    metrics: "Real-time Analytics",
    repoUrl: "https://github.com/Drisanth/PhishShield",
    demoUrl: "#"
  },
  {
    id: "taskit",
    title: "TaskIt: Task Management App with Pomodoro & Google Integration",
    description: "TaskIt is a task management web application that helps users manage daily tasks, schedule events, and track focused work sessions using the Pomodoro technique. It integrates with Google Tasks and Google Calendar to provide seamless productivity management in one place.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "npm"],
    category: "Productivity",
    metrics: "Pomodoro Timer & Google Calendar Sync",
    repoUrl: "https://github.com/Drisanth/TaskIt",
    demoUrl: "https://task-it-beryl.vercel.app/"
  },
  {
    id: "decentralizedMessagingApp",
    title: "P2P Decentralized Messaging App",
    description: "A peer-to-peer decentralized messaging application focused on secure, private, and censorship-resistant communication using WebRTC, IPFS, libp2p, blockchain identity, and end-to-end encryption.",
    tech: ["JavaScript", "Solidity", "WebRTC", "libp2p", "IPFS", "Blockchain"],
    category: "Blockchain",
    metrics: "Secure P2P Messaging & Decentralized Identity",
    repoUrl: "https://github.com/Drisanth/Decentralized-Messaging-App",
    demoUrl: "#"
  },
  {
    id: "anveshipinKandethum",
    title: "Treassure Hunt Webapp (MERN Stack)",
    description: "A mobile-first, dynamic web application built for Padakkalam 2.0 in Gravitas'25 (Campus Tech Fest). A treassure hunt game with multiple progressive rounds with validation steps, hints, and admin analytics panel.",
    tech: ["Node.js", "Express.js", "MongoDB", "React", "TypeScript", "CSS"],
    category: "Web",
    metrics: "Team Progress Tracking & Admin Analytics",
    repoUrl: "https://github.com/Drisanth/AnveshipinKandethum",
    demoUrl: "https://anveshipin-kandethum.vercel.app/"
  },
  {
    id: "evRangeIntelligenceSystem",
    title: "EV Range Intelligence System: Confidence-Aware EV Range Prediction",
    description: "An AI-driven framework for predicting electric vehicle (EV) driving range with confidence bands (Safe, Expected, and Optimistic) using contextual factors like speed, battery state, temperature, and driver behavior to reduce range anxiety in EV users.",
    tech: ["Python", "scikit-learn", "pandas", "numpy", "Streamlit", "Jupyter Notebooks"],
    category: "Machine Learning",
    metrics: "Multi-Band Range Prediction & Range Anxiety Reduction",
    repoUrl: "https://github.com/Drisanth/EV-Range-Intelligence-System",
    demoUrl: "#"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "kennedys",
    role: "Web Development Intern",
    company: "Kennedys Kognitive Computing",
    period: "May 2025 – June 2025",
    location: "Thiruvananthapuram, India",
    description: [
      "Full-stack web development implementing frontend components and backend REST APIs in a MERN application.",
      "Implemented core functionality including frontend interfaces, backend REST endpoints, routing, middleware, and database integration.",
      "Gained practical exposure to the software development lifecycle through guided tasks, code reviews, and iterative improvements."
    ]
  }
];

export const EDUCATION: Education[] = [
  {
    institution: "Vellore Institute of Technology",
    degree: "Integrated M.Tech in CSE",
    period: "Sept 2022 – Present",
    score: "CGPA: 8.72 / 10.0"
  },
  {
    institution: "Kendriya Vidyalaya Kanjikode",
    degree: "High School",
    period: "Jun 2021 - Mar 2022",
    score: "88.8%"
  }
];

export const SKILLS: SkillNode[] = [
  { name: "React", category: "Frontend", level: 90 },
  { name: "TypeScript", category: "Frontend", level: 85 },
  { name: "Three.js", category: "Frontend", level: 75 },
  { name: "Node.js", category: "Backend", level: 80 },
  { name: "Python", category: "AI", level: 90 },
  { name: "TensorFlow", category: "AI", level: 70 },
  { name: "Gemini API", category: "AI", level: 85 },
  { name: "MongoDB", category: "Backend", level: 80 },
  { name: "Docker", category: "Cloud", level: 75 },
  { name: "AWS", category: "Cloud", level: 70 },
  { name: "Java", category: "Backend", level: 75 },
  { name: "C", category: "Backend", level: 70 }
];