import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Clock, 
  Target, 
  Flame, 
  TrendingUp, 
  Award, 
  Zap, 
  Play, 
  CheckSquare, 
  CheckCircle2, 
  ChevronRight,
  HelpCircle,
  Hourglass,
  CalendarDays
} from 'lucide-react';
import { Task, UserStats, Challenge, Achievement, Project } from '../types';

interface DashboardTabProps {
  userStats: UserStats;
  tasks: Task[];
  projects: Project[];
  activeTask: Task | null;
  onSelectTask: (task: Task) => void;
  onNavigateToTimer: () => void;
  challenges: Challenge[];
  achievements: Achievement[];
  focusScore: number;
  scoreBreakdown: string;
}

export default function DashboardTab({
  userStats,
  tasks,
  projects,
  activeTask,
  onSelectTask,
  onNavigateToTimer,
  challenges,
  achievements,
  focusScore,
  scoreBreakdown,
}: DashboardTabProps) {
  // Compute greeting based on time of day
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const [showScoreExplain, setShowScoreExplain] = useState(false);

  // Focus progress percentages
  const dailyTargetMinutes = 100;
  const progressPercent = Math.min(
    Math.round((userStats.totalFocusMinutes / dailyTargetMinutes) * 100),
    100
  );

  // Filter pending tasks
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  // SVG parameters for miniature chart
  const weeklyActivities = [25, 50, 0, 75, 50, 100, userStats.totalFocusMinutes];
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const maxVal = Math.max(...weeklyActivities, 50);

  return (
    <div id="dashboard-tab" className="space-y-8 select-none">
      {/* Top Greeting Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            Productivity Workspace Initialized
          </div>
          <h2 className="text-3xl font-extrabold font-sans text-white tracking-tight">
            {greeting}, Focus Pilot
          </h2>
          <p className="text-sm text-slate-400 font-light max-w-xl">
            {userStats.streak > 0 
              ? `You've maintained deep work for ${userStats.streak} days running. Keep the flame glowing!`
              : "Welcome to your high performance cockpit. Let's create an elegant focus block today."}
          </p>
        </div>

        {/* Quick Start Trigger */}
        <button
          id="btn-dash-quickstart"
          onClick={onNavigateToTimer}
          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-500/15 hover:shadow-cyan-500/30 flex items-center gap-2 group shrink-0 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          Start Quick Session
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Bento Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Bento */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-orange-500/20 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Streak</p>
            <p className="text-3xl font-extrabold text-white font-mono">{userStats.streak} Days</p>
            <p className="text-[10px] text-orange-400/80 font-sans">Consistency bonus multiplier</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 fill-orange-500/30" />
          </div>
        </div>

        {/* Focus Time Bento */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl flex flex-col justify-between hover:border-cyan-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Today Focus</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-white font-mono">{userStats.totalFocusMinutes}</span>
                <span className="text-xs text-slate-400">/ {dailyTargetMinutes}m</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-500 text-right font-mono">{progressPercent}% complete</p>
          </div>
        </div>

        {/* Focus Score Bento */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-indigo-500/20 transition-all relative">
          <div className="space-y-1 select-text">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Focus Score</p>
              <HelpCircle 
                className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors"
                onClick={() => setShowScoreExplain(!showScoreExplain)}
              />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{focusScore}/100</p>
            <p className="text-[10px] text-cyan-400 select-none font-bold cursor-pointer hover:underline" onClick={() => setShowScoreExplain(!showScoreExplain)}>
              {focusScore >= 90 ? 'Dynamic: Elite Flow' : focusScore >= 75 ? 'Dynamic: Stable Pacing' : 'Dynamic: Setup Required'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>

          {/* Explanation Modal Drop */}
          {showScoreExplain && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl z-20 text-xs text-slate-300 leading-relaxed space-y-2 select-text font-sans">
              <h5 className="font-bold text-white text-xs flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Focus Score Breakdown:
              </h5>
              <p>{scoreBreakdown}</p>
              <button 
                onClick={() => setShowScoreExplain(false)}
                className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider hover:underline float-right mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Gamification Level Bento */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-3xl flex flex-col justify-between hover:border-purple-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Core Energy Level</p>
              <p className="text-3xl font-extrabold text-white font-mono">Lvl {userStats.level}</p>
              <p className="text-[10px] text-purple-400/80 font-mono">{userStats.xp} XP total earned</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-6 h-6 fill-purple-500/30" />
            </div>
          </div>
          {/* Level Progress */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(userStats.xp % 1000) / 10}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>{userStats.xp % 1000} / 1000 XP</span>
              <span>Next Lvl</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Layout: Tasks and Mini Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Work and active metrics */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Upcoming Tasks</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                {tasks.filter(t => !t.completed).length} items pending
              </span>
            </div>

            {/* Selected Ongoing Spotlight Card */}
            {activeTask ? (
              <div className="bg-gradient-to-r from-slate-900 via-[#0e1627] to-slate-900 border border-cyan-500/20 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-mono uppercase tracking-widest font-semibold block w-max">
                    Target Spotlit Task
                  </span>
                  <h4 className="text-sm font-bold text-white">{activeTask.title}</h4>
                  <p className="text-xs text-slate-400 font-light max-w-md">
                    {activeTask.notes || 'No notes added yet click task below or jump to timer to record poms.'}
                  </p>
                </div>
                <button
                  id="btn-active-spotlight-start"
                  onClick={onNavigateToTimer}
                  className="px-4 py-2.5 rounded-full bg-cyan-500 text-[#0b0f19] hover:bg-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-center"
                >
                  <Play className="w-3 h-3 fill-current" /> Focus Timer
                </button>
              </div>
            ) : pendingTasks.length > 0 ? (
              <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl text-center text-xs text-slate-400 space-y-2">
                <p>No spotlight focus target chosen.</p>
                <button 
                  onClick={() => onSelectTask(pendingTasks[0])}
                  className="px-3 py-1.5 rounded-full bg-white/5 text-xs text-slate-200 border border-white/10 hover:bg-white/10"
                >
                  Spotlight First Pending Task: "{pendingTasks[0].title}"
                </button>
              </div>
            ) : null}

            {/* Pending Checklists */}
            <div className="space-y-3">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between hover:bg-slate-900/50 ${activeTask?.id === task.id ? 'border-cyan-500/30 bg-[#0c1322]' : 'border-white/5 bg-slate-9e0/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{task.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                          <span className="font-mono">Pomos: {task.actualPomodoros}/{task.estimatedPomodoros}</span>
                          {task.deadline && (
                            <span className="flex items-center gap-1 font-mono">
                              <Target className="w-3 h-3 text-indigo-400/80" /> {task.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  All clear! Add structured items inside the task planner.
                </div>
              )}
            </div>
          </div>

          {/* Daily Active Challenges */}
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Focus Game Challenges</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">XP reward payouts inside</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => {
                const percent = Math.min(Math.round((challenge.progress / challenge.target) * 100), 100);
                return (
                  <div key={challenge.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between h-28 hover:bg-[#111827] transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white tracking-tight">{challenge.title}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[8px] font-mono font-semibold uppercase tracking-wider">
                          +{challenge.targetXP} XP
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">{challenge.description}</p>
                    </div>

                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-[8px] font-mono text-slate-500">
                        <span>Progress ({challenge.progress}/{challenge.target})</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percent === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Progress Graph & AI Assistant Coach segment */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly SVG Chart Card */}
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-cyan-400" /> Weekly focus tracking
              </h3>
              <p className="text-xs text-slate-400 font-light">Minutes logged daily</p>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-32 flex items-end justify-between px-2 pt-4 relative">
              <div className="absolute top-0 left-0 right-0 border-b border-slate-800/60 pb-1 flex justify-between text-[8px] font-mono text-slate-600">
                <span>{maxVal}m peak</span>
                <span>0m</span>
              </div>
              {weeklyActivities.map((val, idx) => {
                const heightPercent = val > 0 ? (val / maxVal) * 100 : 8;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 w-[11%]">
                    <div className="w-full relative group">
                      <div 
                        className="bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-sm w-full group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all cursor-pointer relative"
                        style={{ height: `${heightPercent}px`, maxHeight: '100px' }}
                      >
                        {/* Hover utility tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 text-white font-mono text-[8px] px-1 py-0.5 rounded shadow border border-white/10 shrink-0 z-10 w-max">
                          {val} mins
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{weekDays[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamified Achievements Spotlight Badge Collection */}
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-yellow-400" /> Locked achievements
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                {achievements.filter(a => a.unlocked).length}/{achievements.length} Badges
              </span>
            </div>

            <div className="space-y-3">
              {achievements.slice(0, 3).map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${badge.unlocked ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900/40 border-white/5 opacity-50'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badge.unlocked ? 'bg-amber-500/15 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 max-w-[190px]">
                    <h5 className={`text-xs font-bold ${badge.unlocked ? 'text-amber-300' : 'text-slate-400'}`}>{badge.title}</h5>
                    <p className="text-[9px] text-slate-500 leading-snug">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
