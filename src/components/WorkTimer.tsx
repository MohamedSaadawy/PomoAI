import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  Bell, 
  Maximize2, 
  Minimize2, 
  TreePine, 
  VolumeX, 
  Volume
} from 'lucide-react';
import { Task, TreeType } from '../types';
import { AUDIO_ALARMS } from '../utils/presets';
import { translations } from '../utils/translations';

interface WorkTimerProps {
  activeTask: Task | null;
  onSessionComplete: (durationMinutes: number, workedTaskId?: string, treeSprouted?: TreeType) => void;
  onInterruptionLogged: () => void;
  onCompleteTask: (id: string) => void;
  lang: 'en' | 'ar';
  appTheme: 'dark' | 'light';
}

export default function WorkTimer({
  activeTask,
  onSessionComplete,
  onInterruptionLogged,
  onCompleteTask,
  lang,
  appTheme
}: WorkTimerProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Preset States
  const [sessionLength, setSessionLength] = useState(25); // minutes
  const [breakLength, setBreakLength] = useState(5); // minutes
  const [isBreak, setIsBreak] = useState(false);

  // Timer Variables
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  
  // Custom Controls
  const [autoBreak, setAutoBreak] = useState(true);
  const [autoSession, setAutoSession] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.4);
  const [activeAlarm, setActiveAlarm] = useState('chime');
  const [selectedTreeType, setSelectedTreeType] = useState<TreeType>('sakura');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Sound Alarm preview player
  const playAlarmSound = (soundId: string) => {
    const soundObj = AUDIO_ALARMS.find(a => a.id === soundId);
    if (soundObj) {
      try {
        const audio = new Audio(soundObj.url);
        audio.volume = soundVolume;
        audio.play().catch(e => console.log("Audio play blocked until click interaction", e));
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }
  };

  // Browser system notifications check
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  useEffect(() => {
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setHasNotificationPermission(permission === 'granted');
      });
    }
  };

  const dispatchNotification = (title: string, body: string) => {
    if (hasNotificationPermission && 'Notification' in window) {
      new Notification(title, { body });
    }
  };

  // Synchronized countdown ticker
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            handleCycleFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isBreak, timeLeft]);

  // Handle completed pomodoros or breaks
  const handleCycleFinished = () => {
    playAlarmSound(activeAlarm);
    
    if (!isBreak) {
      // Completed Focus Session!
      dispatchNotification(
        lang === 'en' ? "Pomodoro session finalized!" : "اكتملت دورة التركيز بومودورو!", 
        lang === 'en' 
          ? `Sensational work studying. Sprouts 1 ${selectedTreeType} tree!`
          : `عمل مذهل وبديع. تم زراعة شجرة ${selectedTreeType} في غابتك!`
      );
      // Trigger global state callback
      onSessionComplete(sessionLength, activeTask?.id, selectedTreeType);
      
      if (autoBreak) {
        setIsBreak(true);
        setTimeLeft(breakLength * 60);
        if (autoSession) setIsRunning(true);
      } else {
        resetTimer(false);
      }
    } else {
      // Completed break!
      dispatchNotification(
        lang === 'en' ? "Break finished!" : "انتهت فترة الاستراحة!", 
        lang === 'en' ? "Time to return to deep flow state. Good luck!" : "حان الوقت للعودة إلى ذروة التركيز. بالتوفيق!"
      );
      setIsBreak(false);
      setTimeLeft(sessionLength * 60);
      if (autoSession) setIsRunning(true);
    }
  };

  // Pause tracking logs interruptions
  const toggleTimer = () => {
    if (isRunning) {
      onInterruptionLogged();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = (keepStatus = true) => {
    setIsRunning(false);
    if (!keepStatus) setIsBreak(false);
    setTimeLeft(isBreak ? breakLength * 60 : sessionLength * 60);
  };

  const skipTimer = () => {
    setIsRunning(false);
    handleCycleFinished();
  };

  // Update timeLeft when sliders are customized
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isBreak ? breakLength * 60 : sessionLength * 60);
    }
  }, [sessionLength, breakLength, isBreak]);

  // Keyboard hotkeys listening
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const key = e.key.toLowerCase();
      if (key === ' ') {
        e.preventDefault();
        toggleTimer();
      } else if (key === 'r') {
        resetTimer();
      } else if (key === 's') {
        skipTimer();
      } else if (key === 'f') {
        setIsFullscreen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isRunning, isBreak, selectedTreeType, timeLeft, sessionLength, breakLength]);

  const totalDurationSeconds = isBreak ? breakLength * 60 : sessionLength * 60;
  const percentage = totalDurationSeconds > 0 ? (timeLeft / totalDurationSeconds) : 0;
  const strokeDashoffset = 2 * Math.PI * 90 * (1 - percentage);

  // Time formatting MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // CSS Styles
  const cardBgClass = appTheme === 'light' 
    ? 'bg-white border-slate-200 text-slate-800' 
    : 'bg-[#0b0f19]/60 border-white/5 text-slate-100';

  const widgetBgClass = appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/30 border-white/5';
  const textTitleClass = appTheme === 'light' ? 'text-slate-900' : 'text-white';
  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div 
      id="timer-view-root"
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative rounded-3xl border transition-all duration-300 ${
        isFullscreen 
          ? `fixed inset-0 z-50 flex flex-col items-center justify-center border-none rounded-none ${appTheme === 'light' ? 'bg-slate-50' : 'bg-[#070a13]'}` 
          : `${cardBgClass} p-6 sm:p-8`
      }`}
    >
      {/* Top action row */}
      <div className={`w-full flex items-center justify-between ${isFullscreen ? 'absolute top-6 left-0 px-8' : 'border-b border-dashed border-slate-700/20 pb-4 mb-8'}`}>
        <div className="flex items-center gap-2">
          {!isBreak ? (
            <>
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-mono text-cyan-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Active Focus Period' : 'فترة التركيز النشطة'}
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-mono text-indigo-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Recovery Break Period' : 'فترة الاستراحة والاستشفاء'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Shortcuts Overlay Button */}
          <button
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
              appTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
            }`}
            title="Keyboard Shortcuts"
          >
            <span>{lang === 'en' ? 'Keyboard' : 'لوحة المفاتيح'}</span>
          </button>

          {/* Fullscreen Option */}
          <button
            id="btn-timer-fullscreen"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-xl border cursor-pointer transition-colors ${
              appTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {showShortcutsHelp && (
        <div className={`absolute top-16 ${isRtl ? 'left-6' : 'right-6'} p-4 border rounded-2xl shadow-2xl z-30 space-y-2 text-xs font-mono max-w-xs ${
          appTheme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <h5 className={`font-bold mb-1.5 font-sans ${textTitleClass}`}>{lang === 'en' ? 'Hotkeys:' : 'مفاتيح سريعة:'}</h5>
          <div className="flex justify-between border-b border-slate-500/10 py-1"><span>[Space]</span> <span className="text-cyan-500 text-right">{lang === 'en' ? 'Start / Pause' : 'بدء / إيقاف مؤقت'}</span></div>
          <div className="flex justify-between border-b border-slate-500/10 py-1"><span>[R]</span> <span className="text-cyan-500 text-right">{lang === 'en' ? 'Reset Clock' : 'إعادة ضبط'}</span></div>
          <div className="flex justify-between border-b border-slate-500/10 py-1"><span>[S]</span> <span className="text-pink-500 text-right">{lang === 'en' ? 'Skip block' : 'تخطي الاستراحة/الدورة'}</span></div>
          <div className="flex justify-between py-1"><span>[F]</span> <span className="text-cyan-500 text-right">{lang === 'en' ? 'Fullscreen' : 'النمط الكامل'}</span></div>
          <button 
            onClick={() => setShowShortcutsHelp(false)}
            className="mt-3 w-full py-1.5 bg-cyan-500 text-white rounded-lg text-center text-[10px] uppercase font-bold hover:bg-cyan-600 cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'إغلاق'}
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-4xl mx-auto py-4">
        
        {/* Left Column: Preset controls (Only show when not in fullscreen mode) */}
        {!isFullscreen && (
          <div className="space-y-6 w-full lg:w-72 shrink-0">
            {/* Session Preset sliders */}
            <div className={`p-5 rounded-2xl border ${widgetBgClass} space-y-4`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${textTitleClass}`}>
                {lang === 'en' ? 'Timer calibration' : 'معايرة المدة الزمنية'}
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-light">
                  <span className={textMutedClass}>{lang === 'en' ? 'Focus Duration:' : 'فترة التركيز:'}</span>
                  <span className={`font-bold font-mono ${textTitleClass}`}>{sessionLength} {lang === 'en' ? 'min' : 'دقيقة'}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  step="5"
                  value={sessionLength} 
                  disabled={isRunning}
                  onChange={(e) => setSessionLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-2 pb-2">
                <div className="flex justify-between text-xs font-light">
                  <span className={textMutedClass}>{lang === 'en' ? 'Break Duration:' : 'فترة الاستراحة:'}</span>
                  <span className={`font-bold font-mono ${textTitleClass}`}>{breakLength} {lang === 'en' ? 'min' : 'دقيقة'}</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="30" 
                  step="1"
                  value={breakLength} 
                  disabled={isRunning}
                  onChange={(e) => setBreakLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Automatic sequences */}
              <div className="space-y-3 pt-3 border-t border-dashed border-slate-700/20 text-xs">
                <label className={`flex items-center gap-2 cursor-pointer transition-colors ${textMutedClass} hover:text-cyan-500`}>
                  <input 
                    type="checkbox" 
                    checked={autoBreak} 
                    onChange={() => setAutoBreak(!autoBreak)}
                    className="rounded border-slate-300 dark:border-slate-700 bg-transparent text-cyan-500 focus:ring-opacity-0 focus:ring-0 cursor-pointer"
                  />
                  <span>{lang === 'en' ? 'Start break automatically' : 'بدء الاستراحة تلقائيًا'}</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer transition-colors ${textMutedClass} hover:text-indigo-500`}>
                  <input 
                    type="checkbox" 
                    checked={autoSession} 
                    onChange={() => setAutoSession(!autoSession)}
                    className="rounded border-slate-300 dark:border-slate-700 bg-transparent text-indigo-500 focus:ring-opacity-0 focus:ring-0 cursor-pointer"
                  />
                  <span>{lang === 'en' ? 'Start next session automatically' : 'تكرار الدورات تلقائيًا'}</span>
                </label>
              </div>
            </div>

            {/* Tree species chooser */}
            <div className={`p-4 border rounded-2xl space-y-3 ${widgetBgClass}`}>
              <h5 className={`text-xs font-bold flex items-center gap-1.5 font-mono ${textTitleClass}`}>
                <TreePine className="w-4 h-4 text-emerald-500" /> 
                <span>{lang === 'en' ? 'Sprouter Seed Selection' : 'فصيل البذرة المزرعة'}</span>
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {['sakura', 'pine', 'oak', 'maple', 'golden'].map((tree) => (
                  <button
                    key={tree}
                    onClick={() => setSelectedTreeType(tree as TreeType)}
                    className={`px-2 py-1.5 rounded-lg border text-center uppercase tracking-wider font-mono transition-all cursor-pointer ${
                      selectedTreeType === tree 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold' 
                        : 'bg-[#0b0f19]/30 border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tree}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 font-light italic text-center">
                {lang === 'en' ? 'Sprouts automatically inside Forest upon timer expiry.' : 'ستنمو كشجرة جديدة بغابتك عند انقضاء مدة المؤقت.'}
              </p>
            </div>
          </div>
        )}

        {/* Central Circular Stage */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Animated Pulsing Halo under active loading */}
            <AnimatePresence>
              {isRunning && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0.1 }}
                  animate={{ scale: 1.05, opacity: [0.1, 0.2, 0.1] }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/5 via-indigo-500/5 to-purple-500/5 blur-md"
                />
              )}
            </AnimatePresence>

            {/* SVG Progress Circle Ring */}
            <svg className="w-full h-full transform -rotate-90 select-none pointer-events-none" viewBox="0 0 200 200">
              <circle 
                cx="100" 
                cy="100" 
                r="90" 
                fill="transparent" 
                className={appTheme === 'light' ? 'stroke-slate-200' : 'stroke-slate-800'} 
                strokeWidth="4" 
              />
              <motion.circle 
                cx="100" 
                cy="100" 
                r="90" 
                fill="transparent" 
                className={isBreak ? "stroke-indigo-400" : "stroke-cyan-500"}
                strokeWidth="5" 
                strokeDasharray={2 * Math.PI * 90}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "linear" }}
                strokeLinecap="round"
              />
            </svg>

            {/* Inside Time Displays */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className={`text-[10px] font-mono tracking-widest uppercase ${isBreak ? 'text-indigo-500 font-semibold' : 'text-cyan-500 font-bold'}`}>
                {isBreak ? (lang === 'en' ? 'Recovery' : 'استرخاء واستراحة') : (lang === 'en' ? 'Deep Focus' : 'مرحلة التركيز')}
              </span>
              <h3 className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tighter select-text ${textTitleClass}`}>
                {formatTime(timeLeft)}
              </h3>
              {activeTask ? (
                <div className="max-w-[190px] text-center select-text">
                  <p className="text-[10px] text-slate-500 truncate mt-1">🎯 {activeTask.title}</p>
                </div>
              ) : (
                <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none mt-1">
                  {lang === 'en' ? 'Awaiting Target' : 'بانتظار تحديد هدف'}
                </span>
              )}
            </div>
          </div>

          {/* Controls Toggles */}
          <div className={`flex items-center gap-4 mt-8 p-2.5 px-5 rounded-full border shadow-md ${
            appTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950/25 border-white/5'
          }`}>
            <button
              onClick={() => resetTimer()}
              className={`p-3 rounded-full border cursor-pointer transition-colors ${
                appTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-950' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-timer-play"
              onClick={toggleTimer}
              className={`p-4 hover:scale-105 rounded-full transition-all shadow-md text-white cursor-pointer ${
                isRunning ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-600'
              }`}
              title={isRunning ? 'Pause' : 'Start'}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={skipTimer}
              className={`p-3 rounded-full border cursor-pointer transition-colors ${
                appTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-600 hover:text-rose-600' : 'bg-white/5 border-white/5 text-slate-400 hover:text-pink-400'
              }`}
              title="Skip Session Cycle"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Audio settings / Notification permissions (Hidden in fullscreen) */}
        {!isFullscreen && (
          <div className="space-y-6 w-full lg:w-72 shrink-0">
            {/* Alarm selector */}
            <div className={`p-4 border rounded-2xl space-y-3 ${widgetBgClass}`}>
              <h4 className={`text-xs font-bold flex items-center gap-1.5 font-mono ${textTitleClass}`}>
                <Volume2 className="w-4 h-4 text-cyan-500" /> 
                <span>{lang === 'en' ? 'Chimes & Alarm Audio' : 'نغمة انتهاء المؤقت'}</span>
              </h4>
              
              <div className="space-y-1 text-xs">
                {AUDIO_ALARMS.map((alarm) => (
                  <button
                    key={alarm.id}
                    onClick={() => {
                      setActiveAlarm(alarm.id);
                      playAlarmSound(alarm.id);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
                      activeAlarm === alarm.id 
                        ? 'bg-[#0f1d32]/10 border-cyan-500/40 text-cyan-600 dark:text-cyan-400 font-bold' 
                        : 'bg-[#0b0f19]/30 border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{alarm.name}</span>
                    <Play className="w-2.5 h-2.5 opacity-40" />
                  </button>
                ))}
              </div>

              {/* Volume scale config */}
              <div className="space-y-2 pt-2 border-t border-dashed border-slate-700/20">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>{lang === 'en' ? 'Volume strength' : 'مستوى الصوت'}</span>
                  <span>{Math.round(soundVolume * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <Volume className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Notifications configuration */}
            <div className={`p-4 border rounded-2xl transition-all ${widgetBgClass}`}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-500 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className={`text-xs font-bold ${textTitleClass}`}>{lang === 'en' ? 'System Alerts' : 'تنبيهات النظام'}</h5>
                  <p className="text-[10px] text-slate-500 font-light leading-snug">
                    {lang === 'en' ? 'Alert sound chimes' : 'تنبيهات المتصفح الصوتية فور انتهاء الوقت.'}
                  </p>
                  
                  {hasNotificationPermission ? (
                    <span className="text-[9px] text-emerald-500 font-bold font-mono">✔️ {lang === 'en' ? 'Active Alerts' : 'منشطة ومفعَّلة'}</span>
                  ) : (
                    <button
                      onClick={requestNotificationPermission}
                      className="text-[9px] text-indigo-500 hover:underline font-bold uppercase tracking-wider block mt-1 cursor-pointer"
                    >
                      {lang === 'en' ? 'Authorize' : 'تفعيل الإذن'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
