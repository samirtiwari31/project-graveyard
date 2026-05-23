
export type ProjectCategory = 'Code' | 'Literature' | 'Design' | 'Hardware' | 'Music';

export interface ChatMessage {
  role: 'user' | 'ghost';
  text: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  joinedDate: string;
  rank: string;
  location: string;
  skills: string[];
  profileImage?: string;
}

export interface Project {
  id: string;
  title: string;
  author: string;
  authorEmail?: string;
  category: ProjectCategory;
  description: string;
  content: string;
  abandonedDate: string;
  reasonForAbandonment: string;
  adoptions: number;
  tags: string[];
  status: 'buried' | 'resurrected' | 'adopting';
  aiAutopsy?: string;
  epitaph?: string;
  chatHistory?: ChatMessage[];
}

export interface StatsData {
  category: string;
  count: number;
}
