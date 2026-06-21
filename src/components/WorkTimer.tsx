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
  CheckSquare, 
  Sparkles, 
  TreePine, 
  HelpCircle,
  VolumeX,
  Volume
} from 'lucide-react';
import { Task, TreeType } from '../types';
import { AUDIO_ALARMS } from '../utils/presets';

interface WorkTimerProps {
  activeTask: Task | null;
  onSessionComplete: (durationMinutes: number, workedTaskId?: string, treeSprouted?: TreeType) => void;
  onInterruptionLogged: () => void;
  onCompleteTask: (id: string) => void;
}

export default function WorkTimer({
  activeTask,
  onSessionComplete,
  onInterruptionLogged,
  onCompleteTask,
}: WorkTimerProps) {
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
        audio.play().catch(e => console.log("Audio play blocked by browser sandbox until click:", e));
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
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  // Synchronized countdown ticker
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Completed! Triggers callback
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
      dispatchNotification("Pomodoro session finalized!", `Sensational work studying. Sprouts 1 ${selectedTreeType} tree!`);
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
      dispatchNotification("Break finished!", "Time to return to deep flow state. Good luck!");
      setIsBreak(false);
      setTimeLeft(sessionLength * 60);
      if (autoSession) setIsRunning(true);
    }
  };

  // Pause tracking logs interruptions
  const toggleTimer = () => {
    if (isRunning) {
      // Log interruption count 
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

  // Update timeLeft when session/break lengths are slider-modified or edited
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isBreak ? breakLength * 60 : sessionLength * 60);
    }
  }, [sessionLength, breakLength, isBreak]);

  // Listen to keyboard hotkeys
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // ignore in form fields
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

  // Format YYYY-MM-DD helper for circular stroke percentage
  const totalDurationSeconds = isBreak ? breakLength * 60 : sessionLength * 60;
  const percentage = totalDurationSeconds > 0 ? (timeLeft / totalDurationSeconds) : 0;
  const strokeDashoffset = 2 * Math.PI * 90 * (1 - percentage);

  // Time formatting MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      id="timer-view-root"
      className={`relative rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#070a13] flex flex-col items-center justify-center border-none rounded-none' : 'bg-slate-900/40 p-6 sm:p-8'}`}
    >
      {/* Top action row */}
      <div className={`w-full flex items-center justify-between ${isFullscreen ? 'absolute top-6 left-0 px-8' : 'border-b border-white/5 pb-4 mb-8'}`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            {isBreak ? 'Ambient recovery block' : 'Active Flow Session'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Shortcuts Overlay Button */}
          <button
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className="p-2 rounded-xl bg-slate-800/60 border border-white/5 cursor-pointer hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Keyboard Shortcuts"
          >
            <span className="text-[10px] font-mono px-1">K</span> Keyboard
          </button>

          {/* Fullscreen Option */}
          <button
            id="btn-timer-fullscreen"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800/60 border border-white/5 cursor-pointer hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {showShortcutsHelp && (
        <div className="absolute top-16 right-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-30 space-y-2 text-xs font-mono text-slate-300 max-w-xs">
          <h5 className="font-bold text-white mb-2 font-sans">Quick Keys:</h5>
          <div className="flex justify-between"><span>[Space]</span> <span className="text-cyan-400 text-right">Play / Pause</span></div>
          <div className="flex justify-between"><span>[R]</span> <span className="text-cyan-400 text-right">Reset clock</span></div>
          <div className="flex justify-between"><span>[S]</span> <span className="text-pink-400 text-right">Skip block</span></div>
          <div className="flex justify-between"><span>[F]</span> <span className="text-cyan-400 text-right">Fullscreen toggle</span></div>
          <button 
            onClick={() => setShowShortcutsHelp(false)}
            className="mt-3 w-full py-1 bg-white/5 rounded text-center text-[10px] uppercase font-bold hover:bg-white/10"
          >
            Close
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-4xl mx-auto py-4">
        
        {/* Left Column: Preset controls (Only show when not in fullscreen mode to remove clutter) */}
        {!isFullscreen && (
          <div className="space-y-6 w-full lg:w-72 shrink-0">
            {/* Session Preset sliders */}
            <div className="space-y-4 bg-slate-950/30 p-5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Timer adjustments</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-light">
                  <span>Focus Block:</span>
                  <span className="font-bold text-white font-mono">{sessionLength} min</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="60" 
                  step="5"
                  value={sessionLength} 
                  disabled={isRunning}
                  onChange={(e) => setSessionLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-2 pb-2">
                <div className="flex justify-between text-xs text-slate-400 font-light">
                  <span>Break Period:</span>
                  <span className="font-bold text-white font-mono">{breakLength} min</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="30" 
                  step="1"
                  value={breakLength} 
                  disabled={isRunning}
                  onChange={(e) => setBreakLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              {/* Automatic sequences */}
              <div className="space-y-3 pt-2 border-t border-white/5 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={autoBreak} 
                    onChange={() => setAutoBreak(!autoBreak)}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-opacity-0 focus:ring-0 cursor-pointer"
                  />
                  <span>Launch break automatic</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={autoSession} 
                    onChange={() => setAutoSession(!autoSession)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-opacity-0 focus:ring-0 cursor-pointer"
                  />
                  <span>Launch countdown consecutive</span>
                </label>
              </div>
            </div>

            {/* Tree species chooser */}
            <div className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <TreePine className="w-4 h-4 text-emerald-400" /> Plant Selection
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {['sakura', 'pine', 'oak', 'maple', 'golden'].map((tree) => (
                  <button
                    key={tree}
                    onClick={() => setSelectedTreeType(tree as TreeType)}
                    className={`px-2.5 py-1.5 rounded-lg border text-center uppercase tracking-wider font-mono transition-all ${selectedTreeType === tree ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold' : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800'}`}
                  >
                    {tree}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 font-light italic text-center">Sprouts instantly inside Pomo Forest upon timer finalization.</p>
            </div>
          </div>
        )}

        {/* Central Circular Stage */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          
          <div className="relative w-80 h-80 flex items-center justify-center">
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
                className="stroke-slate-800" 
                strokeWidth="4" 
              />
              <motion.circle 
                cx="100" 
                cy="100" 
                r="90" 
                fill="transparent" 
                className={isBreak ? "stroke-indigo-400" : "stroke-cyan-400"}
                strokeWidth="5" 
                strokeDasharray={2 * Math.PI * 90}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "linear" }}
                strokeLinecap="round"
              />
            </svg>

            {/* Inside Time Displays */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className={`text-[10px] font-mono tracking-widest uppercase ${isBreak ? 'text-indigo-400 font-semibold' : 'text-cyan-400 font-bold'}`}>
                {isBreak ? 'Recovery' : 'Deep Focus'}
              </span>
              <h3 className="text-5xl font-extrabold font-mono text-white tracking-tighter select-text">
                {formatTime(timeLeft)}
              </h3>
              {activeTask ? (
                <div className="max-w-[190px] text-center select-text">
                  <p className="text-[10px] text-slate-400 truncate mt-1">🎯 {activeTask.title}</p>
                </div>
              ) : (
                <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Awaiting Spotlight</span>
              )}
            </div>
          </div>

          {/* Controls Toggles */}
          <div className="flex items-center gap-4 mt-8 bg-slate-950/25 p-3 px-6 rounded-full border border-white/5 shadow-xl">
            <button
              onClick={() => resetTimer()}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:text-white text-slate-400 transition-colors"
              title="Reset Timer Cycle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-timer-play"
              onClick={toggleTimer}
              className={`p-5 rounded-full transition-all shadow-lg shadow-cyan-500/10 ${isRunning ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400'}`}
              title={isRunning ? 'Pause Loop' : 'Execute Focus Countdown'}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
            </button>

            <button
              onClick={skipTimer}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 hover:text-pink-400 text-slate-400 transition-colors"
              title="Skip Session Cycle"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Audio settings / Notification permission trigger (Hidden in fullscreen) */}
        {!isFullscreen && (
          <div className="space-y-6 w-full lg:w-72 shrink-0">
            {/* Alarm selector */}
            <div className="p-5 bg-slate-950/30 border border-white/5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Volume2 className="w-4 h-4 text-cyan-400" /> Sound Alarm Sound
              </h4>
              
              <div className="space-y-1.5 text-xs">
                {AUDIO_ALARMS.map((alarm) => (
                  <button
                    key={alarm.id}
                    onClick={() => {
                      setActiveAlarm(alarm.id);
                      playAlarmSound(alarm.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl border flex items-center justify-between transition-colors ${activeAlarm === alarm.id ? 'bg-[#0f1d32] border-cyan-500/30 text-white font-semibold' : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800'}`}
                  >
                    <span>{alarm.name}</span>
                    <Play className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100" />
                  </button>
                ))}
              </div>

              {/* Volume scale config */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Sound volume</span>
                  <span>{Math.round(soundVolume * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-slate-600" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <Volume className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Notifications configuration */}
            <div className="p-4 bg-slate-100/5 hover:bg-slate-100/10 border border-white/5 rounded-2xl transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-white">Browser Notifications</h5>
                  <p className="text-[10px] text-slate-400 font-light leading-normal">Permit sound bells when countdown sessions finalize.</p>
                  
                  {hasNotificationPermission ? (
                    <span className="text-[10px] text-emerald-400 font-bold font-mono">✔️ Active Permissions</span>
                  ) : (
                    <button
                      onClick={requestNotificationPermission}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider block mt-1 hover:underline"
                    >
                      Authorize Permission
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
