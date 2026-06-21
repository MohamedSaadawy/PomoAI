import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Timer, 
  CheckSquare, 
  Sparkles, 
  Calendar, 
  TreePine, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Flame, 
  Volume2, 
  Award, 
  User, 
  ChevronRight,
  Menu,
  X,
  Languages,
  BookOpen,
  Briefcase,
  Code2,
  Stethoscope,
  Dumbbell,
  Sun,
  Moon
} from 'lucide-react';

// Imports types & presets
import { Task, Project, PomodoroSession, UserStats, Challenge, Achievement, CalendarEvent, ChatMessage, TreeType } from './types';
import { INITIAL_PROJECTS, INITIAL_CHALLENGES, INITIAL_ACHIEVEMENTS, FOCUS_QUOTES } from './utils/presets';
import { translations } from './utils/translations';

// Sub components
import LandingPage from './components/LandingPage';
import DashboardTab from './components/DashboardTab';
import WorkTimer from './components/WorkTimer';
import TaskManager from './components/TaskManager';
import CalendarTab from './components/CalendarTab';
import FocusForest from './components/FocusForest';
import AnalyticsTab from './components/AnalyticsTab';
import CoachTab from './components/CoachTab';

export default function App() {
  // Navigation Flow State
  const [navigationView, setNavigationView] = useState<'landing' | 'workspace'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'timer' | 'tasks' | 'calendar' | 'forest' | 'analytics' | 'coach' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core Persistent States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [completedSessions, setCompletedSessions] = useState<PomodoroSession[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: "",
    totalSessions: 0,
    totalFocusMinutes: 0
  });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Interruption logged state (temp cached for focus score calculation)
  const [interruptionCount, setInterruptionCount] = useState(0);

  // Settings customizable fields
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    const cached = localStorage.getItem('pomo_lang');
    return (cached === 'ar' || cached === 'en') ? cached : 'en';
  });

  const [appTheme, setAppTheme] = useState<'dark' | 'light'>(() => {
    const cached = localStorage.getItem('pomo_theme');
    return (cached === 'light' || cached === 'dark') ? cached : 'dark';
  });

  const [systemSounds, setSystemSounds] = useState(true);
  const [customGeminiKey, setCustomGeminiKey] = useState<string>(() => localStorage.getItem('pomo_custom_gemini_api_key') || '');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    localStorage.setItem('pomo_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('pomo_theme', appTheme);
  }, [appTheme]);

  // Load state from local storage on mount
  useEffect(() => {
    const cachedTasks = localStorage.getItem('pomo_os_tasks');
    const cachedProjects = localStorage.getItem('pomo_os_projects');
    const cachedSessions = localStorage.getItem('pomo_os_sessions');
    const cachedStats = localStorage.getItem('pomo_os_stats');
    const cachedCal = localStorage.getItem('pomo_os_calendar');
    const cachedChallenges = localStorage.getItem('pomo_os_challenges');
    const cachedAchievements = localStorage.getItem('pomo_os_achievements');
    const cachedChat = localStorage.getItem('pomo_os_chat');
    const cachedTaskId = localStorage.getItem('pomo_os_active_task_id');

    if (cachedTasks) setTasks(JSON.parse(cachedTasks));
    else {
      // Setup some default demo tasks
      setTasks([
        {
          id: 'task-demo-1',
          title: 'Review medical cardiology flashcards',
          completed: false,
          projectId: 'proj-med',
          priority: 'high',
          tags: ['cardio', 'active-recall'],
          notes: 'Review high yield pathology details and standard diagnostic loops.',
          deadline: new Date().toISOString().split('T')[0],
          recurring: 'none',
          estimatedPomodoros: 4,
          actualPomodoros: 1,
          subtasks: [
            { id: 'sub-t1-1', title: 'Parse core valves symptoms', completed: true },
            { id: 'sub-t1-2', title: 'Complete spaced repetition mock quizzing', completed: false }
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 'task-demo-2',
          title: 'Draft full-stack Express API controller setups',
          completed: false,
          projectId: 'proj-prog',
          priority: 'medium',
          tags: ['typescript', 'backend'],
          notes: 'Prepare schema validators and mount custom Express routes securely.',
          deadline: new Date().toISOString().split('T')[0],
          recurring: 'none',
          estimatedPomodoros: 2,
          actualPomodoros: 0,
          subtasks: [
            { id: 'sub-t2-1', title: 'Review TypeScript tsconfig resolver mappings', completed: false }
          ],
          createdAt: new Date().toISOString()
        }
      ]);
    }

    if (cachedProjects) setProjects(JSON.parse(cachedProjects));
    else setProjects(INITIAL_PROJECTS);

    if (cachedSessions) setCompletedSessions(JSON.parse(cachedSessions));
    else {
      // Seed some mock sessions history
      setCompletedSessions([
        { id: 'sess-seed-1', durationMinutes: 25, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), interruptedCount: 0, completed: true, treeType: 'oak' },
        { id: 'sess-seed-2', durationMinutes: 25, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), interruptedCount: 1, completed: true, treeType: 'sakura' },
        { id: 'sess-seed-3', durationMinutes: 50, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), interruptedCount: 0, completed: true, treeType: 'pine' }
      ]);
    }

    if (cachedStats) setUserStats(JSON.parse(cachedStats));
    else {
      setUserStats({
        xp: 1350,
        level: 2,
        streak: 5,
        lastActiveDate: new Date().toISOString().split('T')[0],
        totalSessions: 3,
        totalFocusMinutes: 100
      });
    }

    if (cachedCal) setCalendarEvents(JSON.parse(cachedCal));
    else {
      setCalendarEvents([
        { id: 'cal-seed-1', title: 'AI Cardiology Review', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '09:50' },
        { id: 'cal-seed-2', title: 'Express System Setup', date: new Date().toISOString().split('T')[0], startTime: '14:30', endTime: '15:20' }
      ]);
    }

    if (cachedChallenges) setChallenges(JSON.parse(cachedChallenges));
    else setChallenges(INITIAL_CHALLENGES);

    if (cachedAchievements) setAchievements(JSON.parse(cachedAchievements));
    else setAchievements(INITIAL_ACHIEVEMENTS);

    if (cachedChat) setChatHistory(JSON.parse(cachedChat));
    else {
      setChatHistory([
        { id: 'chat-seed-1', sender: 'ai', text: "Hello Pilot! I am your AI Productivity Coach. I've analyzed your daily score metrics. Tap suggested topics to inspect workflows or let's start a Pomodoro!", timestamp: new Date().toLocaleTimeString() }
      ]);
    }

    if (cachedTaskId) setActiveTaskId(cachedTaskId);
  }, []);

  // Save changes callback loops
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('pomo_os_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('pomo_os_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (completedSessions.length > 0) localStorage.setItem('pomo_os_sessions', JSON.stringify(completedSessions));
  }, [completedSessions]);

  useEffect(() => {
    localStorage.setItem('pomo_os_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    if (calendarEvents.length > 0) localStorage.setItem('pomo_os_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    if (challenges.length > 0) localStorage.setItem('pomo_os_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    if (achievements.length > 0) localStorage.setItem('pomo_os_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    if (chatHistory.length > 0) localStorage.setItem('pomo_os_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (activeTaskId) localStorage.setItem('pomo_os_active_task_id', activeTaskId);
    else localStorage.removeItem('pomo_os_active_task_id');
  }, [activeTaskId]);

  // -------------------------------------------------------------
  // Dynamic Score Formula Generation
  // -------------------------------------------------------------
  const calculateDailyFocusScore = () => {
    let score = 100;
    
    // 1. Deduct 3 points for each incomplete High Priority task
    const highPriorityIncomp = tasks.filter(t => !t.completed && t.priority === 'high').length;
    score -= highPriorityIncomp * 3;

    // 2. Deduct 2 points for each recorded interruption pause
    const totalsInterrupted = completedSessions.reduce((sum, s) => sum + s.interruptedCount, 0);
    score -= totalsInterrupted * 2;

    // 3. Consistency bonus: Increase by 2 points for each day of streak (capped at +10)
    score += Math.min(userStats.streak * 2, 10);

    // 4. Achievement bonus: Increase by 2 points for each unlocked badge
    const badgeUnlocksCount = achievements.filter(a => a.unlocked).length;
    score += badgeUnlocksCount * 2;

    // Boundary constraint check
    score = Math.max(score, 45); // lower limit safety
    score = Math.min(score, 100); // upper cap safety

    // Reason phrase constructor
    let breakdown = `Your Focus Score is ${score}/100. `;
    if (highPriorityIncomp > 0) breakdown += `Deducted ${highPriorityIncomp * 3}pts due to ${highPriorityIncomp} incomplete High Priority tasks. `;
    if (totalsInterrupted > 0) breakdown += `Deducted ${totalsInterrupted * 2}pts for manual countdown pauses. `;
    if (userStats.streak > 0) breakdown += `Earned +${Math.min(userStats.streak * 2, 10)}pts consistency streak bonus. `;
    if (badgeUnlocksCount > 0) breakdown += `Unlocking achievements added +${badgeUnlocksCount * 2} bonus points.`;

    return { score, breakdown };
  };

  const { score: currentFocusScore, breakdown: currentScoreExplanation } = calculateDailyFocusScore();

  // -------------------------------------------------------------
  // State Handlers & Callbacks
  // -------------------------------------------------------------

  const handleAddTask = (taskInput: Omit<Task, 'id' | 'createdAt' | 'actualPomodoros'>) => {
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}`,
      actualPomodoros: 0,
      createdAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    if (!activeTaskId) setActiveTaskId(newTask.id);

    // Update Sunasama Challenge metrics
    const updatedChallenges = challenges.map(ch => {
      if (ch.id === 'ch-3') {
        const nextProgress = Math.min(ch.progress + 1, ch.target);
        return {
          ...ch,
          progress: nextProgress,
          completed: nextProgress === ch.target
        };
      }
      return ch;
    });
    setChallenges(updatedChallenges);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const handleSelectTask = (task: Task) => {
    setActiveTaskId(task.id);
  };

  const handleInterruptionLogged = () => {
    setInterruptionCount(prev => prev + 1);
  };

  // Triggers once Pomodoro countdown completes successfully
  const handleSessionComplete = (
    durationMinutes: number, 
    workedTaskId?: string, 
    treeSprouted?: TreeType
  ) => {
    const timestampISO = new Date().toISOString();
    const newSession: PomodoroSession = {
      id: `sess-${Date.now()}`,
      taskId: workedTaskId,
      durationMinutes,
      timestamp: timestampISO,
      interruptedCount: interruptionCount,
      completed: true,
      treeType: treeSprouted || 'sakura'
    };

    setCompletedSessions([newSession, ...completedSessions]);
    setInterruptionCount(0); // reset temp interrupt ticker

    // Task Pomodoro update
    if (workedTaskId) {
      setTasks(tasks.map(t => {
        if (t.id === workedTaskId) {
          return { ...t, actualPomodoros: t.actualPomodoros + 1 };
        }
        return t;
      }));
    }

    // Award XP (+100 XP per completed block)
    const baseXPGranted = 150;
    const finalXP = userStats.xp + baseXPGranted;
    let finalLevel = userStats.level;
    
    // Level up calculation (threshold: 1000 XP per level)
    if (finalXP >= finalLevel * 1000) {
      finalLevel += 1;
      // System popup/notification triggered gracefully index
    }

    setUserStats(prev => ({
      ...prev,
      xp: finalXP,
      level: finalLevel,
      totalSessions: prev.totalSessions + 1,
      totalFocusMinutes: prev.totalFocusMinutes + durationMinutes
    }));

    // Perform game-challenges progress update
    const updatedChallenges = challenges.map(ch => {
      // Complete 2 focus sessions today
      if (ch.id === 'ch-1') {
        const nextProg = Math.min(ch.progress + 1, ch.target);
        return { ...ch, progress: nextProg, completed: nextProg === ch.target };
      }
      // Accumulate 100 minutes focus
      if (ch.id === 'ch-2') {
        const nextMinutes = Math.min(ch.progress + durationMinutes, ch.target);
        return { ...ch, progress: nextMinutes, completed: nextMinutes === ch.target };
      }
      return ch;
    });
    setChallenges(updatedChallenges);

    // Achievements unlocked checks
    setAchievements(achievements.map(ach => {
      // First session initiate
      if (ach.id === 'ach-first' && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
      }
      // Grown 5 mature trees forest
      if (ach.id === 'ach-forest' && !ach.unlocked && completedSessions.length + 1 >= 5) {
        return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
      }
      return ach;
    }));
  };

  const handleAddCalendarEvent = (evtInput: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...evtInput,
      id: `cal-evt-${Date.now()}`
    };
    setCalendarEvents([newEvt, ...calendarEvents]);
  };

  const handleClearForestData = () => {
    // Keep raw stats, but clear visible coordinates mapped sessions
    setCompletedSessions(completedSessions.map(s => ({ ...s, completed: false })));
  };

  // AI syllabus planners bulk tasks and events importer
  const handleImportAITasks = (
    importedTasks: Omit<Task, 'id' | 'createdAt' | 'actualPomodoros'>[],
    offsetCalendarEvts: Omit<CalendarEvent, 'id'>[]
  ) => {
    const formattedTasks: Task[] = importedTasks.map((t, idx) => ({
      ...t,
      id: `imported-task-${idx}-${Date.now()}`,
      actualPomodoros: 0,
      createdAt: new Date().toISOString()
    }));

    const formattedEvents: CalendarEvent[] = offsetCalendarEvts.map((e, idx) => ({
      ...e,
      id: `imported-cal-${idx}-${Date.now()}`
    }));

    setTasks([...formattedTasks, ...tasks]);
    setCalendarEvents([...formattedEvents, ...calendarEvents]);
    alert(`AI Study Planner successfully booked and imported ${formattedTasks.length} tasks and synchronized calendar blocks!`);
  };

  // Schedule optimizer bulk order mapper
  const handleOptimizeTasksOrder = (sortedOrderIds: string[], insightText: string) => {
    if (!sortedOrderIds || sortedOrderIds.length === 0) return;

    // Create a lookup weights table based on returned AI sequence index
    const orderMap = new Map(sortedOrderIds.map((id, index) => [id, index]));
    const sortedTasks = [...tasks].sort((a, b) => {
      const idxA = orderMap.get(a.id);
      const idxB = orderMap.get(b.id);
      if (idxA !== undefined && idxB !== undefined) return idxA - idxB;
      if (idxA !== undefined) return -1;
      if (idxB !== undefined) return 1;
      return 0; // maintain original
    });

    setTasks(sortedTasks);
    // Print notification log
    setChatHistory([
      ...chatHistory,
      {
        id: `chat-optimize-${Date.now()}`,
        sender: 'ai',
        text: `🤖 AI Optimal Schedule Sorted! Explanation: ${insightText}`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleAddChatMessage = (msg: ChatMessage) => {
    setChatHistory([...chatHistory, msg]);
  };

  const handleFullAccountDeleteAndReset = () => {
    localStorage.clear();
    setTasks([]);
    setProjects(INITIAL_PROJECTS);
    setCompletedSessions([]);
    setUserStats({
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: "",
      totalSessions: 0,
      totalFocusMinutes: 0
    });
    setCalendarEvents([]);
    setChallenges(INITIAL_CHALLENGES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setChatHistory([]);
    setActiveTaskId(null);
    alert("Operational Hub data successfully formatted and reset!");
    setNavigationView('landing');
  };

  // Find active spotlit task title
  const spotlitTaskObj = tasks.find(t => t.id === activeTaskId) || null;

  const t = translations[lang];

  // Render workspace menu sidebar options
  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: Sparkles },
    { id: 'timer', label: t.timer, icon: Timer },
    { id: 'tasks', label: t.tasks, icon: CheckSquare },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'forest', label: t.forest, icon: TreePine },
    { id: 'analytics', label: t.analytics, icon: TrendingUp },
    { id: 'coach', label: t.coach, icon: Zap },
    { id: 'settings', label: t.settings, icon: Settings }
  ];

  // Primary routing gate
  if (navigationView === 'landing') {
    return (
      <LandingPage 
        onLaunch={() => {
          setNavigationView('workspace');
          // Start with sidebar closed on mobile screens to save space
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }} 
        lang={lang}
        setLang={setLang}
        appTheme={appTheme}
        setAppTheme={setAppTheme}
      />
    );
  }

  // Adaptive theme utility classes
  const themeBgClass = appTheme === 'light' 
    ? 'bg-slate-50 text-slate-800' 
    : 'bg-[#070a13] text-slate-100';

  const sidebarBgClass = appTheme === 'light'
    ? 'bg-white border-r border-slate-205 text-slate-800'
    : 'bg-[#05080f] border-r border-white/5 text-slate-100';

  const headerBgClass = appTheme === 'light'
    ? 'bg-white border-b border-slate-205 text-slate-850'
    : 'bg-[#05080f]/40 border-b border-white/5 text-slate-100';

  const textTitleClass = appTheme === 'light' ? 'text-slate-900 border-slate-200' : 'text-white border-slate-850';
  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-200 ${themeBgClass}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Mobile Sidebar backdrop overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        id="applet-sidebar"
        className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} lg:static flex flex-col justify-between transition-all duration-300 z-50 shrink-0 ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        } ${sidebarBgClass}`}
      >
        <div className="py-6 flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Sidebar Logo */}
            <div className={`px-6 pb-6 border-b flex items-center justify-between ${appTheme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center p-[1px]">
                  <div className={`w-full h-full rounded-[7px] flex items-center justify-center ${appTheme === 'light' ? 'bg-white' : 'bg-[#05080f]'}`}>
                    <Zap className="w-4 h-4 text-cyan-505" />
                  </div>
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className={`text-sm font-extrabold tracking-tight leading-tight ${textTitleClass}`}>POMO OS</h1>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Workspace v1.2</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-1 rounded cursor-pointer lg:hidden border ${
                  appTheme === 'light' 
                    ? 'bg-slate-50 border-slate-205 text-slate-500 hover:text-slate-800' 
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Account micro widget */}
            {sidebarOpen && (
              <div className={`m-4 p-3 border rounded-2xl flex items-center gap-3 ${
                appTheme === 'light' ? 'bg-slate-100/50 border-slate-200' : 'bg-slate-950/40 border-white/5'
              }`}>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${textTitleClass}`}>{lang === 'en' ? 'Focus Pilot' : 'طيار التركيز'}</h4>
                  <p className="text-[9px] font-mono text-indigo-500 uppercase tracking-wider">{lang === 'en' ? `Level ${userStats.level} Ranger` : `المستوى ${userStats.level}`}</p>
                </div>
              </div>
            )}

            {/* Menu options list */}
            <nav className="mt-6 px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                const activeStyle = isActive 
                  ? appTheme === 'light'
                    ? 'bg-cyan-50 border border-cyan-200 text-cyan-600 font-bold'
                    : 'bg-gradient-to-r from-cyan-500/10 via-[#0e172a] to-slate-950 border border-cyan-500/20 text-cyan-400 font-bold'
                  : appTheme === 'light'
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                    : 'text-slate-400 hover:text-white hover:bg-slate-950/40 border border-transparent';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      // Close sidebar automatically on mobile after tab select
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeStyle}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-500' : 'text-slate-500 group-hover:text-amber-500'}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick exit option */}
          <div className={`px-3 border-t pt-4 ${appTheme === 'light' ? 'border-slate-105' : 'border-white/5'}`}>
            <button
              onClick={() => setNavigationView('landing')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span>{t.exitHub || 'Exit Hub'}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Operational View Stage */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header Metrics Row */}
        <header className={`px-4 sm:px-8 py-4 flex items-center justify-between shrink-0 relative z-35 backdrop-blur-md ${headerBgClass}`}>
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded cursor-pointer transition-all border ${
                appTheme === 'light' 
                  ? 'bg-slate-50 border-slate-205 text-slate-650 hover:bg-slate-100' 
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
              }`}
              title={lang === 'en' ? 'Toggle Navigation Menu' : 'تبديل القائمة'}
            >
              <Menu className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-mono hidden xs:inline">{t.online}:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono leading-none flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> {lang === 'en' ? 'ONLINE' : 'نشط'}
              </span>
            </div>

            {spotlitTaskObj && (
              <div className={`hidden lg:flex items-center gap-2 border px-3 py-1.5 rounded-full ${
                appTheme === 'light' ? 'bg-slate-50 border-slate-150' : 'bg-slate-950/40 border-white/5'
              }`}>
                <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-500 font-bold">{t.spotlightTarget || '🎯 Target'}:</span>
                <span className={`text-xs font-medium truncate max-w-sm ${textTitleClass}`}>{spotlitTaskObj.title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={() => {
                const nextLang = lang === 'en' ? 'ar' : 'en';
                setLang(nextLang);
              }}
              className={`px-3 py-1.5 rounded cursor-pointer text-xs font-mono font-medium flex items-center gap-1 border transition-all ${
                appTheme === 'light' 
                  ? 'bg-slate-50 border-slate-205 text-slate-600 hover:bg-slate-100' 
                  : 'bg-slate-900 border-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                const nextTheme = appTheme === 'light' ? 'dark' : 'light';
                setAppTheme(nextTheme);
              }}
              className={`p-2 rounded cursor-pointer border transition-all ${
                appTheme === 'light' 
                  ? 'bg-slate-50 border-slate-205 text-slate-600 hover:bg-slate-105' 
                  : 'bg-slate-900 border-white/5 text-slate-300 hover:text-white'
              }`}
              title={lang === 'en' ? 'Toggle theme' : 'تغيير المظهر'}
            >
              {appTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Streak metrics */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-505">
              <Flame className="w-4 h-4" /> {userStats.streak} {lang === 'en' ? 'Days' : 'أيام'}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Viewport */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-6xl mx-auto pb-12"
            >
              {activeTab === 'dashboard' && (
                <DashboardTab 
                  userStats={userStats}
                  tasks={tasks}
                  projects={projects}
                  activeTask={spotlitTaskObj}
                  onSelectTask={handleSelectTask}
                  onNavigateToTimer={() => setActiveTab('timer')}
                  challenges={challenges}
                  achievements={achievements}
                  focusScore={currentFocusScore}
                  scoreBreakdown={currentScoreExplanation}
                  lang={lang}
                  appTheme={appTheme}
                />
              )}

              {activeTab === 'timer' && (
                <WorkTimer 
                  activeTask={spotlitTaskObj}
                  onSessionComplete={handleSessionComplete}
                  onInterruptionLogged={handleInterruptionLogged}
                  onCompleteTask={(id) => {
                    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t));
                    if (activeTaskId === id) setActiveTaskId(null);
                  }}
                  lang={lang}
                  appTheme={appTheme}
                />
              )}

              {activeTab === 'tasks' && (
                <TaskManager 
                  tasks={tasks}
                  projects={projects}
                  activeTaskId={activeTaskId || undefined}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onSelectTask={handleSelectTask}
                  lang={lang}
                  appTheme={appTheme}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarTab 
                  tasks={tasks}
                  projects={projects}
                  calendarEvents={calendarEvents}
                  onAddCalendarEvent={handleAddCalendarEvent}
                  lang={lang}
                  appTheme={appTheme}
                />
              )}

              {activeTab === 'forest' && (
                <FocusForest 
                  completedSessions={completedSessions}
                  onClearForestData={handleClearForestData}
                  lang={lang}
                  appTheme={appTheme}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab 
                  completedSessions={completedSessions}
                  tasks={tasks}
                  focusScore={currentFocusScore}
                  lang={lang}
                  appTheme={appTheme}
                />
              )}

              {activeTab === 'coach' && (
                <CoachTab 
                  userStats={userStats}
                  tasks={tasks}
                  focusScore={currentFocusScore}
                  chatHistory={chatHistory}
                  onAddChatMessage={handleAddChatMessage}
                  onImportAITasks={handleImportAITasks}
                  onOptimizeTasksOrder={handleOptimizeTasksOrder}
                  lang={lang}
                  appTheme={appTheme}
                />
              )}

              {activeTab === 'settings' && (
                <div className={`border p-6 sm:p-8 rounded-3xl space-y-8 select-text transition-all ${
                  appTheme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/40 border-white/5 text-slate-105'
                }`}>
                  <div className={`border-b pb-4 space-y-1 ${appTheme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                    <h3 className={`text-lg font-bold ${textTitleClass}`}>{lang === 'en' ? 'Productivity Operating System Settings' : 'إعدادات نظام تشغيل الإنتاجية'}</h3>
                    <p className={`text-xs font-light ${textMutedClass}`}>{lang === 'en' ? 'Configure look, theme modes, language parameters, and API credentials.' : 'تخصيص المظهر، اللغات، المعلمات ومفاتيح الربط البرمجية.'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visual Preferences */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold font-mono uppercase text-indigo-500">{lang === 'en' ? 'Workspace Customization' : 'تخصيص مساحة العمل'}</h4>
                      
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-400">{lang === 'en' ? 'Theme preset' : 'نمط المظهر الكلي'}</label>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              onClick={() => setAppTheme('dark')}
                              className={`p-3 rounded-xl border text-center uppercase font-bold transition-all ${appTheme === 'dark' ? 'bg-slate-900 border-cyan-500/30 text-cyan-400' : 'bg-slate-100/50 border-slate-205 text-slate-500 hover:bg-slate-100'}`}
                            >
                              🚀 Dark Mode
                            </button>
                            <button
                              onClick={() => setAppTheme('light')}
                              className={`p-3 rounded-xl border text-center uppercase font-bold transition-all ${appTheme === 'light' ? 'bg-cyan-50 border-cyan-200 text-cyan-600' : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-800'}`}
                            >
                              ☀️ Light Mode
                            </button>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                          appTheme === 'light' ? 'bg-slate-50 border-slate-150' : 'bg-slate-950/20 border-slate-900'
                        }`}>
                          <div className="space-y-0.5">
                            <h5 className={`text-xs font-bold ${textTitleClass}`}>{lang === 'en' ? 'System notifications' : 'إشعارات النظام'}</h5>
                            <p className="text-[10px] text-slate-500 leading-none">{lang === 'en' ? 'Chimes when timers expire.' : 'رنين وتنبيه مع تصفير العداد.'}</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={systemSounds} 
                            onChange={() => setSystemSounds(!systemSounds)}
                            className="rounded bg-slate-800 border-slate-700 text-cyan-505 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data exports and formatting */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold font-mono uppercase text-indigo-500">{lang === 'en' ? 'Google Gemini API Configuration' : 'تهيئة مفاتيح غوغل جيميناي ذكاء اصطناعي'}</h4>
                      
                      <div className={`p-5 rounded-2xl space-y-4 border ${
                        appTheme === 'light' ? 'bg-slate-50 border-slate-205' : 'bg-slate-950/40 border-white/5'
                      }`}>
                        <div className="space-y-1">
                          <h5 className={`text-xs font-bold ${textTitleClass}`}>{lang === 'en' ? 'Custom Gemini API Key' : 'مفتاح الربط لجيميناي الخاص بك'}</h5>
                          <p className={`text-[11px] leading-normal font-light ${textMutedClass}`}>
                            {lang === 'en' 
                              ? 'If your deployed server is missing the secret environment variable, you can paste your personal key here. It is saved in your browser\'s local storage and used directly/securely for AI Coaching features.'
                              : 'في حال عدم تهيئة خادم الويب بمفتاح تشغيل رئيسي، يمكنك تزويدنا بمفتاحك الشخصي هنا ليخزن محليًا بمتصفحك فقط بغرض توفير مزايا التدريب بالذكاء الاصطناعي.'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="relative">
                            <input
                              type={showApiKey ? "text" : "password"}
                              placeholder={lang === 'en' ? "Paste Gemini API Key here (AIzaSy...)" : "أدخل مفتاح غوغل جيميناي هنا..."}
                              value={customGeminiKey}
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                setCustomGeminiKey(val);
                                if (val) {
                                  localStorage.setItem('pomo_custom_gemini_api_key', val);
                                } else {
                                  localStorage.removeItem('pomo_custom_gemini_api_key');
                                }
                              }}
                              className={`w-full border rounded-xl px-4 py-3 text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 font-mono ${
                                lang === 'ar' ? 'pl-12 pr-4' : 'pr-12 pl-4'
                              } ${
                                appTheme === 'light' ? 'bg-white border-slate-250 text-slate-900' : 'bg-slate-950/60 border-white/10 text-white'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className={`absolute top-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-white ${
                                lang === 'ar' ? 'left-3' : 'right-3'
                              }`}
                            >
                              {showApiKey ? (lang === 'en' ? "Hide" : "إخفاء") : (lang === 'en' ? "Show" : "إظهار")}
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <a
                              href="https://aistudio.google.com/"
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-500 hover:underline inline-flex items-center gap-1 font-bold"
                            >
                              {lang === 'en' ? 'Get a Free Gemini Key from Google AI Studio ↗' : 'احصل على مفتاح جيميناي مجاني من غوغل ↗'}
                            </a>
                            {customGeminiKey && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomGeminiKey('');
                                  localStorage.removeItem('pomo_custom_gemini_api_key');
                                }}
                                className="text-rose-500 hover:underline font-bold"
                              >
                                {lang === 'en' ? 'Clear Key' : 'مسح المفتاح'}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={`pt-2 border-t border-dashed text-[10px] ${appTheme === 'light' ? 'border-slate-200 text-slate-500' : 'border-slate-500/10 text-slate-400'}`}>
                          <p>⭐ {lang === 'en' ? 'Custom client credentials are saved locally in private cookies/localStorage structure.' : 'يتم حفظ معطيات ومفاتيح التشغيل داخليًا في متصفحك بشكل آمن وخاص.'}</p>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold font-mono uppercase text-rose-500">{lang === 'en' ? 'Sensitive formatting' : 'خيارات حساسة'}</h4>
                      
                      <div className={`p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-3`}>
                        <h5 className="text-xs font-bold text-rose-500">{lang === 'en' ? 'Harsh formatting reset' : 'إعادة ضبط المصنع الكاملة'}</h5>
                        <p className={`text-[11px] leading-normal font-light ${textMutedClass}`}>
                          {lang === 'en' 
                            ? 'Clears all tasks, achievements, projects, growing forest parameters, and statistics persistently from local storage browser database.'
                            : 'سيقوم هذا الخيار بحذف كافة المهام، الإنجازات، المشاريع، وبيانات الغابات المحفوظة محليًا بمتصفحك بشكل دائم ولا يمكن التراجع عنه.'}
                        </p>
                        
                        <button
                          onClick={handleFullAccountDeleteAndReset}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-505 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                        >
                          {lang === 'en' ? 'Erase Operational Hub' : 'مسح مخزن العمليات'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
