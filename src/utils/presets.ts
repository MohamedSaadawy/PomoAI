import { Project, Challenge, Achievement } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-med',
    name: 'Medical School',
    color: '#ef4444', // red-500
    icon: 'Stethoscope',
    deadline: '2026-12-15',
    description: 'Pathology cards, diagnostic techniques and anatomy syllabus study.'
  },
  {
    id: 'proj-prog',
    name: 'Programming',
    color: '#06b6d4', // cyan-500
    icon: 'Code2',
    deadline: '2026-08-30',
    description: 'TypeScript architectural setups, backend systems and full-stack engineering.'
  },
  {
    id: 'proj-gym',
    name: 'Gym & Health',
    color: '#22c55e', // green-500
    icon: 'Dumbbell',
    deadline: '2026-11-01',
    description: 'Strength training loops, macro logging, and physical conditioning sessions.'
  },
  {
    id: 'proj-biz',
    name: 'Business Strategy',
    color: '#eab308', // yellow-500
    icon: 'Briefcase',
    deadline: '2026-09-01',
    description: 'SaaS product roadmaps, active pitch updates and client reports.'
  },
  {
    id: 'proj-read',
    name: 'Reading & Growth',
    color: '#a855f7', // purple-500
    icon: 'BookOpen',
    deadline: '2026-12-31',
    description: 'Reading tech biographies and executive psychology volumes.'
  },
  {
    id: 'proj-lang',
    name: 'Languages',
    color: '#f97316', // orange-500
    icon: 'Languages',
    deadline: '2026-10-10',
    description: 'Daily spaced repetition, active vocabulary training & listening exercises.'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Flow Catalyst',
    description: 'Complete 2 full focus sessions today',
    targetXP: 100,
    isDaily: true,
    progress: 0,
    target: 2,
    completed: false
  },
  {
    id: 'ch-2',
    title: 'Anatomy of Focus',
    description: 'Accumulate 100 minutes of deep study',
    targetXP: 250,
    isDaily: true,
    progress: 0,
    target: 100,
    completed: false
  },
  {
    id: 'ch-3',
    title: 'Sunsama Disciple',
    description: 'Clear or schedule 5 upcoming tasks',
    targetXP: 150,
    isDaily: true,
    progress: 0,
    target: 5,
    completed: false
  },
  {
    id: 'ch-4',
    title: 'Deep Work Elite',
    description: 'Log 15 focus blocks in a single week',
    targetXP: 500,
    isDaily: false,
    progress: 0,
    target: 15,
    completed: false
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first',
    title: 'Deep Work Initiate',
    description: 'Successfully lock in your first 25-minute Pomodoro focus block',
    badgeIcon: 'Flame',
    unlocked: false
  },
  {
    id: 'ach-streak',
    title: 'Consistency Master',
    description: 'Maintain a 5-day active focus session streak',
    badgeIcon: 'Zap',
    unlocked: false
  },
  {
    id: 'ach-forest',
    title: 'Forest Ranger',
    description: 'Grow five mature trees in your Focus Forest',
    badgeIcon: 'Trees',
    unlocked: false
  },
  {
    id: 'ach-score',
    title: 'Flawless Mind',
    description: 'Attain a daily Focus Score of 95 or higher',
    badgeIcon: 'Award',
    unlocked: false
  },
  {
    id: 'ach-multi',
    title: 'Polymath Focus',
    description: 'Log sessions across three different projects',
    badgeIcon: 'Layers',
    unlocked: false
  }
];

export const AUDIO_ALARMS = [
  { id: 'bell', name: 'Standard Bell', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav' },
  { id: 'digital', name: 'Digital Blip', url: 'https://assets.mixkit.co/active_storage/sfx/911/911-84.wav' },
  { id: 'chime', name: 'Zen Chime', url: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav' },
  { id: 'forest', name: 'Gentle Breeze', url: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-84.wav' }
];

export const FOCUS_QUOTES = [
  "Focus is a muscle, and you are building a temple of devotion today.",
  "Deep Work is the currency of the modern intellectual economy.",
  "The trees you plant are symbols of hours you owned, not simulated in noise.",
  "One block at a time. The rest is simply draft outline.",
  "Your attention is the most valuable asset you have. Invest it, don't spend it."
];
