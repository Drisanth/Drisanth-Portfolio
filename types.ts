export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  metrics?: string;
  demoUrl?: string;
  repoUrl?: string;
  category: 'AI' | 'Web' | 'Hardware' | 'Security' | 'Productivity' | 'Blockchain' | 'Machine Learning';
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  score: string;
  details?: string;
}

export interface SkillNode {
  name: string;
  category: 'Frontend' | 'Backend' | 'AI' | 'Cloud';
  level: number;
}