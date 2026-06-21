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
  Dumbbell
} from 'lucide-react';

// Imports types & presets
import { Task, Project, PomodoroSession, UserStats, Challenge, Achievement, CalendarEvent, ChatMessage, TreeType } from './types';
import { INITIAL_PROJECTS, INITIAL_CHALLENGES, INITIAL_ACHIEVEMENTS, FOCUS_QUOTES } from './utils/presets';

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
  const [appTheme, setAppTheme] = useState<'dark-nord' | 'black-minimal'>('dark-nord');
  const [systemSounds, setSystemSounds] = useState(true);
  const [customGeminiKey, setCustomGeminiKey] = useState<string>(() => localStorage.getItem('pomo_custom_gemini_api_key') || '');
  const [showApiKey, setShowApiKey] = useState(false);

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

  // Render workspace menu sidebar options
  const menuItems = [
    { id: 'dashboard', label: 'Bento Dashboard', icon: Sparkles },
    { id: 'timer', label: 'Pomodoro Timer', icon: Timer },
    { id: 'tasks', label: 'Operational Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar Planner', icon: Calendar },
    { id: 'forest', label: 'Focus Forest', icon: TreePine },
    { id: 'analytics', label: 'Focus Analytics', icon: TrendingUp },
    { id: 'coach', label: 'AI Coach Hub', icon: Zap },
    { id: 'settings', label: 'OS Settings', icon: Settings }
  ];

  // Primary routing gate
  if (navigationView === 'landing') {
    return <LandingPage onLaunch={() => setNavigationView('workspace')} />;
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside 
        id="applet-sidebar"
        className={`bg-[#05080f] border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-40 shrink-0 ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="py-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Sidebar Logo */}
            <div className="px-6 pb-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center p-[1px]">
                  <div className="w-full h-full bg-[#05080f] rounded-[7px] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="text-sm font-extrabold tracking-tight text-white leading-tight">POMO OS</h1>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Workspace v1.2</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* User Account micro widget */}
            {sidebarOpen && (
              <div className="m-4 p-3 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Focus Pilot</h4>
                  <p className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider">Level {userStats.level} Ranger</p>
                </div>
              </div>
            )}

            {/* Menu options list */}
            <nav className="mt-6 px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${isActive ? 'bg-gradient-to-r from-cyan-500/10 via-[#0e172a] to-slate-950 border border-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-950/40 border border-transparent'}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick exit option */}
          <div className="px-3 border-t border-white/5 pt-4">
            <button
              onClick={() => setNavigationView('landing')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-500 hover:text-white hover:bg-rose-500/5 hover:border-rose-500/10 transition-all border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span>Exit Hub</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Operational View Stage */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Header Metrics Row */}
        <header className="bg-[#05080f]/40 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Workspace status:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono leading-none flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE
              </span>
            </div>

            {spotlitTaskObj && (
              <div className="hidden lg:flex items-center gap-2 bg-slate-950/40 border border-white/5 px-3 py-1.5 rounded-full">
                <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold">🎯 Spotlit Target:</span>
                <span className="text-xs text-slate-300 font-medium truncate max-w-sm">{spotlitTaskObj.title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Energy metrics visual ticks */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400">
              <Flame className="w-4 h-4" /> {userStats.streak} Day streak
            </div>
          </div>
        </header>

        {/* Dynamic Inner Viewport */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 relative">
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
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarTab 
                  tasks={tasks}
                  projects={projects}
                  calendarEvents={calendarEvents}
                  onAddCalendarEvent={handleAddCalendarEvent}
                />
              )}

              {activeTab === 'forest' && (
                <FocusForest 
                  completedSessions={completedSessions}
                  onClearForestData={handleClearForestData}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab 
                  completedSessions={completedSessions}
                  tasks={tasks}
                  focusScore={currentFocusScore}
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
                />
              )}

              {activeTab === 'settings' && (
                <div className="bg-slate-900/40 border border-white/5 p-6 sm:p-8 rounded-3xl space-y-8 select-text">
                  <div className="border-b border-white/5 pb-4 space-y-1">
                    <h3 className="text-lg font-bold text-white">Productivity Operating System Settings</h3>
                    <p className="text-xs text-slate-400 font-light">Configure look, audio cues, system permissions, or clear cache archives.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Visual Preferences */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold font-mono uppercase text-indigo-400">Workspace Customization</h4>
                      
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-500">Theme preset</label>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              onClick={() => setAppTheme('dark-nord')}
                              className={`p-3 rounded-xl border text-center uppercase font-bold transition-all ${appTheme === 'dark-nord' ? 'bg-[#0f2038] border-cyan-500/30 text-cyan-400' : 'bg-slate-950/40 border-white/5 text-slate-400'}`}
                            >
                              Cosmic Obsidian (Nord)
                            </button>
                            <button
                              onClick={() => setAppTheme('black-minimal')}
                              className={`p-3 rounded-xl border text-center uppercase font-bold transition-all ${appTheme === 'black-minimal' ? 'bg-[#0f2038] border-cyan-500/30 text-cyan-400' : 'bg-slate-950/40 border-white/5 text-slate-400'}`}
                            >
                              Organic Pitch Black
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-950/20 border border-slate-950 rounded-2xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-white">System notifications</h5>
                            <p className="text-[10px] text-slate-500 leading-none">Chimes when timers expire.</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={systemSounds} 
                            onChange={() => setSystemSounds(!systemSounds)}
                            className="rounded bg-slate-800 border-slate-700 text-cyan-400 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data exports and formatting */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold font-mono uppercase text-indigo-400">Google Gemini API Configuration</h4>
                      
                      <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                        <div className="space-y-1">
                          <h5 className="text-xs font-bold text-white">Custom Gemini API Key</h5>
                          <p className="text-[11px] text-slate-400 leading-normal font-light">
                            If your deployed server is missing the secret environment variable, you can paste your personal key here. It is saved in your browser's local storage and used directly/securely for AI Coaching features.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="relative">
                            <input
                              type={showApiKey ? "text" : "password"}
                              placeholder="Paste Gemini API Key here (AIzaSy...)"
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
                              className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute right-3 top-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-white"
                            >
                              {showApiKey ? "Hide" : "Show"}
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <a
                              href="https://aistudio.google.com/"
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                            >
                              Get a Free Gemini Key from Google AI Studio ↗
                            </a>
                            {customGeminiKey && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomGeminiKey('');
                                  localStorage.removeItem('pomo_custom_gemini_api_key');
                                }}
                                className="text-rose-400 hover:underline"
                              >
                                Clear Key
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 space-y-1">
                          <p>💡 <strong className="text-slate-400">Vercel Deployment tip:</strong> To avoid pasting keys, you can define a permanent environment variable on your Vercel Dashboard under <span className="text-slate-300">Project Settings &gt; Environment Variables</span>. Name it <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-400 font-mono">GEMINI_API_KEY</code>, then trigger a re-deployment!</p>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold font-mono uppercase text-rose-400">Sensitive formatting</h4>
                      
                      <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-3">
                        <h5 className="text-xs font-bold text-rose-300">Harsh formatting reset</h5>
                        <p className="text-[11px] text-slate-400 leading-normal font-light">
                          Clears all tasks, achievements, projects, growing forest parameters, and statistics persistently from local storage browser database.
                        </p>
                        
                        <button
                          onClick={handleFullAccountDeleteAndReset}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all uppercase tracking-wider"
                        >
                          Erase Operational Hub
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
