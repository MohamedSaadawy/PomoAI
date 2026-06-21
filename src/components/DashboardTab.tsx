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
  ChevronRight,
  HelpCircle,
  CalendarDays
} from 'lucide-react';
import { Task, UserStats, Challenge, Achievement, Project } from '../types';
import { translations } from '../utils/translations';

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
  lang: 'en' | 'ar';
  appTheme: 'dark' | 'light';
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
  lang,
  appTheme
}: DashboardTabProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  
  // Compute greeting based on time of day
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting(lang === 'en' ? "Good morning" : "صباح الخير");
    } else if (hours < 18) {
      setGreeting(lang === 'en' ? "Good afternoon" : "طاب مساؤك");
    } else {
      setGreeting(lang === 'en' ? "Good evening" : "مساء الخير");
    }
  }, [lang]);

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
  const weeklyActivities = [25, 45, 0, 80, 50, 110, userStats.totalFocusMinutes];
  const weekDaysEn = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekDaysAr = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
  const weekDays = lang === 'en' ? weekDaysEn : weekDaysAr;
  const maxVal = Math.max(...weeklyActivities, 50);

  // Handle CSS presets depending on active appTheme
  const cardBgClass = appTheme === 'light' 
    ? 'bg-white border-slate-200 text-slate-800' 
    : 'bg-[#0b0f19]/60 border-white/5 text-slate-100';

  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const textTitleClass = appTheme === 'light' ? 'text-slate-900' : 'text-white';

  return (
    <div id="dashboard-tab" className="space-y-8 select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Greeting Panel */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 sm:p-8 rounded-2xl border relative overflow-hidden ${
        appTheme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b0f19]/40 border-white/5'
      }`}>
        {appTheme === 'dark' && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            {lang === 'en' ? 'Productivity Hub Ready' : 'نظام تشغيل الإنتاجية مُنشَّط'}
          </div>
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textTitleClass}`}>
            {greeting}، {t.pilotTitle}
          </h2>
          <p className={`text-xs sm:text-sm font-light max-w-xl ${textMutedClass}`}>
            {userStats.streak > 0 
              ? (lang === 'en' 
                  ? `You have maintained deep work for ${userStats.streak} days running. Keep the flame glowing!`
                  : `لقد حافظت على سلسلة إنجاز متواصلة لمدة ${userStats.streak} أيام متتالية. ابقِ الشعلة متقدة!`)
              : (lang === 'en' ? "Welcome to your high performance cockpit. Let's create an elegant focus block today." : "مرحبًا بك في لوحة القيادة. دعنا ننجز جلسة تركيز استثنائية اليوم.")}
          </p>
        </div>

        {/* Quick Start Trigger */}
        <button
          id="btn-dash-quickstart"
          onClick={onNavigateToTimer}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs transition-all shadow-md hover:shadow-cyan-500/10 flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
        >
          <Play className="w-3 h-3 fill-white text-white" />
          <span>{lang === 'en' ? 'Quick focus' : 'بدء التركيز السريع'}</span>
          <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Bento Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Bento */}
        <div className={`${cardBgClass} p-5 rounded-2xl flex items-center justify-between group hover:border-orange-500/20 transition-all border`}>
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{t.streakTitle}</p>
            <p className={`text-2xl font-extrabold font-mono ${textTitleClass}`}>{userStats.streak} {lang === 'en' ? 'Days' : 'أيام'}</p>
            <p className="text-[9px] text-orange-500 font-medium">{t.activeDailyStreak}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-orange-500/20" />
          </div>
        </div>

        {/* Focus Time Bento */}
        <div className={`${cardBgClass} p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/20 transition-all border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{lang === 'en' ? 'Today Focus' : 'تركيز اليوم'}</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-extrabold font-mono ${textTitleClass}`}>{userStats.totalFocusMinutes}</span>
                <span className="text-[10px] text-slate-500">/ {dailyTargetMinutes}{lang === 'en' ? 'm' : ' د'}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${appTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div 
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-500 text-right font-mono leading-none">{progressPercent}%</p>
          </div>
        </div>

        {/* Focus Score Bento */}
        <div className={`${cardBgClass} p-5 rounded-2xl flex items-center justify-between group hover:border-indigo-500/20 transition-all border relative`}>
          <div className="space-y-1 select-text">
            <div className="flex items-center gap-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{t.currentFocusScore}</p>
              <HelpCircle 
                className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-cyan-500 transition-colors"
                onClick={() => setShowScoreExplain(!showScoreExplain)}
              />
            </div>
            <p className={`text-2xl font-extrabold font-mono ${textTitleClass}`}>{focusScore}/100</p>
            <p className="text-[9px] text-cyan-500 font-bold cursor-pointer hover:underline" onClick={() => setShowScoreExplain(!showScoreExplain)}>
              {focusScore >= 90 ? (lang === 'en' ? 'Flow: Elite' : 'تدفق من النخبة') : focusScore >= 75 ? (lang === 'en' ? 'Flow: Stable' : 'أداء مستقر') : (lang === 'en' ? 'Calibrating...' : 'جاري المعايرة...')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>

          {/* Explanation Modal Drop */}
          {showScoreExplain && (
            <div className={`absolute top-full ${isRtl ? 'right-0' : 'left-0'} right-0 mt-2 p-4 border rounded-xl shadow-xl z-20 text-[11px] leading-relaxed space-y-2 select-text font-sans ${
              appTheme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <h5 className={`font-bold flex items-center gap-1 ${textTitleClass}`}>
                <Target className="w-3.5 h-3.5 text-indigo-500" /> {lang === 'en' ? 'Focus Calculation Details' : 'تفاصيل معدل الأداء والتركيز:'}
              </h5>
              <p>{scoreBreakdown}</p>
              <button 
                onClick={() => setShowScoreExplain(false)}
                className="text-[10px] text-cyan-500 font-bold uppercase hover:underline float-right mt-1 cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'إغلاق'}
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Gamification Level Bento */}
        <div className={`${cardBgClass} p-5 rounded-2xl flex flex-col justify-between hover:border-purple-500/20 transition-all border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{lang === 'en' ? 'XP Level Stand' : 'المستوى ورصيد النقاط'}</p>
              <p className={`text-2xl font-extrabold font-mono ${textTitleClass}`}>{t.level} {userStats.level}</p>
              <p className="text-[9px] text-purple-500 font-mono">{userStats.xp} XP total</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5 fill-purple-500/20" />
            </div>
          </div>
          {/* Level Progress */}
          <div className="space-y-1">
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${appTheme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(userStats.xp % 1000) / 10}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] text-slate-500 font-mono leading-none">
              <span>{userStats.xp % 1000} / 1000 XP</span>
              <span>{lang === 'en' ? 'Next' : 'التالي'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Layout: Tasks and Mini Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Work and active metrics */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`${cardBgClass} p-5 sm:p-6 rounded-2xl space-y-6 border`}>
            <div className="flex items-center justify-between border-b border-dashed border-slate-700/20 pb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-500" />
                <h3 className={`text-md font-bold ${textTitleClass}`}>{lang === 'en' ? 'Upcoming Priority Tasks' : 'قائمة المهام القادمة'}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${appTheme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'}`}>
                {tasks.filter(t => !t.completed).length} {lang === 'en' ? 'pending' : 'مهام معلقة'}
              </span>
            </div>

            {/* Selected Ongoing Spotlight Card */}
            {activeTask ? (
              <div className={`border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-cyan-500/20'
              }`}>
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 text-[8px] font-mono uppercase tracking-widest font-bold block w-max">
                    {lang === 'en' ? 'Target Spotlit Task' : 'المستهدفة والمسلط عليها الضوء'}
                  </span>
                  <h4 className={`text-sm font-bold ${textTitleClass}`}>{activeTask.title}</h4>
                  <p className={`text-xs font-light max-w-md ${textMutedClass}`}>
                    {activeTask.notes || (lang === 'en' ? 'No notes added. Head to the task tab to decompose target steps.' : 'لا توجد ملاحظات مضافة. تفضل بتبويب قائمة المهام لتفكيك الخطوات.')}
                  </p>
                </div>
                <button
                  id="btn-active-spotlight-start"
                  onClick={onNavigateToTimer}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
                >
                  <Play className="w-3" />
                  <span>{t.timer}</span>
                </button>
              </div>
            ) : pendingTasks.length > 0 ? (
              <div className={`p-4 rounded-xl text-center text-xs space-y-2 border ${
                appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a]/40 border-white/5'
              }`}>
                <p className={textMutedClass}>{lang === 'en' ? 'No spotlight focus target chosen.' : 'لم يتم تسليط الضوء على هدف مخصص حاليًا.'}</p>
                <button 
                  onClick={() => onSelectTask(pendingTasks[0])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    appTheme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  } transition-all cursor-pointer`}
                >
                  {lang === 'en' ? 'Focus on Primary:' : 'تسليط الضوء على:'} "{pendingTasks[0].title}"
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
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between hover:opacity-95 ${
                      activeTask?.id === task.id 
                        ? (appTheme === 'light' ? 'border-cyan-500 bg-cyan-50/20' : 'border-cyan-500/30 bg-[#0c1322]')
                        : (appTheme === 'light' ? 'border-slate-200 bg-slate-50/50 hover:bg-slate-50' : 'border-white/5 bg-slate-950/20 hover:bg-slate-950/30')
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <div>
                        <h4 className={`text-xs font-bold ${textTitleClass}`}>{task.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 leading-none">
                          <span className="font-mono">{lang === 'en' ? 'Pomos:' : 'دورات بومودورو:'} {task.actualPomodoros}/{task.estimatedPomodoros}</span>
                          {task.deadline && (
                            <span className="flex items-center gap-1 font-mono">
                              <Target className="w-3 h-3 text-indigo-500/80" /> {task.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
                  </div>
                ))
              ) : (
                <div className={`text-center py-6 border border-dashed rounded-xl text-xs ${appTheme === 'light' ? 'border-slate-300 text-slate-400' : 'border-slate-800 text-slate-500'}`}>
                  {lang === 'en' ? 'All milestones finalized! Add items to calendar or lists.' : 'قائمتك خالية من الأهداف المعلقة! تفضل بإضافتها.'}
                </div>
              )}
            </div>
          </div>

          {/* Focus Game Challenges */}
          <div className={`${cardBgClass} p-5 sm:p-6 rounded-2xl space-y-4 border`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                <h3 className={`text-md font-bold ${textTitleClass}`}>{t.todaysChallenges}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => {
                const percent = Math.min(Math.round((challenge.progress / challenge.target) * 100), 100);
                return (
                  <div key={challenge.id} className={`border p-4 rounded-xl flex flex-col justify-between h-28 hover:opacity-95 transition-all ${
                    appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/5'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-1.5 leading-none">
                        <span className={`text-xs font-bold ${textTitleClass} truncate`}>{challenge.title}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[8px] font-mono font-bold leading-none shrink-0">
                          +{challenge.targetXP} XP
                        </span>
                      </div>
                      <p className={`text-[10px] leading-relaxed font-light ${textMutedClass} line-clamp-2`}>{challenge.description}</p>
                    </div>

                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-[8px] font-mono text-slate-500 leading-none">
                        <span>{lang === 'en' ? 'Progress' : 'التقدم'} ({challenge.progress}/{challenge.target})</span>
                        <span>{percent}%</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${appTheme === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`}>
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
          <div className={`${cardBgClass} p-5 sm:p-6 rounded-2xl space-y-6 border`}>
            <div className="space-y-1">
              <h3 className={`text-xs font-bold leading-none flex items-center gap-1.5 ${textTitleClass}`}>
                <CalendarDays className="w-4 h-4 text-cyan-500" /> {t.weeklyTrend}
              </h3>
              <p className={`text-[10px] font-mono ${textMutedClass}`}>{lang === 'en' ? 'Minutes logged per day' : 'الدقائق المسجلة يوميًا'}</p>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-32 flex items-end justify-between px-2 pt-4 relative" dir="ltr">
              <div className="absolute top-0 left-0 right-0 border-b border-slate-700/10 pb-1 flex justify-between text-[8px] font-mono text-slate-500">
                <span>{maxVal}{lang === 'en' ? 'm peak' : ' د'}</span>
                <span>0</span>
              </div>
              {weeklyActivities.map((val, idx) => {
                const heightPercent = val > 0 ? (val / maxVal) * 100 : 8;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 w-[11%]">
                    <div className="w-full relative group">
                      <div 
                        className="bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-sm w-full group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all cursor-pointer relative"
                        style={{ height: `${heightPercent}px`, maxHeight: '100px' }}
                      >
                        {/* Hover utility tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 text-white font-mono text-[8px] px-1 py-0.5 rounded shadow border border-white/10 shrink-0 z-30 w-max">
                          {val}m
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{weekDays[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamified Achievements Spotlight Badge Collection */}
          <div className={`${cardBgClass} p-5 sm:p-6 rounded-2xl space-y-4 border`}>
            <div className="flex items-center justify-between leading-none">
              <h3 className={`text-xs font-bold flex items-center gap-1.5 ${textTitleClass}`}>
                <Award className="w-4 h-4 text-amber-500" /> {t.recentAchievements}
              </h3>
              <span className="text-[9px] font-mono text-slate-500">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </span>
            </div>

            <div className="space-y-3">
              {achievements.slice(0, 3).map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    badge.unlocked 
                      ? 'bg-amber-500/5 border-amber-500/20' 
                      : (appTheme === 'light' ? 'bg-slate-100/50 border-slate-200' : 'bg-slate-900/40 border-white/5 opacity-50')
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${badge.unlocked ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 max-w-[190px]">
                    <h5 className={`text-xs font-semibold ${badge.unlocked ? 'text-amber-500' : 'text-slate-400'}`}>{badge.title}</h5>
                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{badge.description}</p>
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
