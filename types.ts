export interface Milestone {
  id: number;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: number;
  title: string; // Specific
  measurement: string; // Measurable
  achievability: string; // Achievable
  relevance: string; // Relevant
  deadline: string; // Time-bound
  milestones: Milestone[];
  createdAt: string;
}

export interface Resource {
  id: number;
  title: string;
  category: 'Career' | 'Health' | 'Education' | 'Personal';
  type: 'Article' | 'Video' | 'Podcast';
  link: string;
  description: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

export interface GoalSuggestion {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBoundDays: number;
}
