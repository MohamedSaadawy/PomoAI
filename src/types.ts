export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId: string; // can be empty "inbox"
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  notes: string;
  deadline: string; // YYYY-MM-DD
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  estimatedPomodoros: number;
  actualPomodoros: number;
  subtasks: SubTask[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string; // tailwind color configuration e.g. "red" / "teal"
  icon: string; // lucide icon name
  deadline: string; // YYYY-MM-DD
  description: string;
}

export type TreeType = 'oak' | 'pine' | 'sakura' | 'maple' | 'golden';

export interface PomodoroSession {
  id: string;
  taskId?: string;
  projectId?: string;
  durationMinutes: number;
  timestamp: string; // ISO string
  interruptedCount: number;
  completed: boolean;
  treeType: TreeType;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalSessions: number;
  totalFocusMinutes: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetXP: number;
  isDaily: boolean;
  progress: number;
  target: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  taskId?: string;
  projectId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
