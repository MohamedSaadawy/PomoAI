import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Calendar, 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  ListRestart, 
  Activity, 
  Zap,
  MessageCircle,
  CalendarDays,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { ChatMessage, Task, UserStats, CalendarEvent } from '../types';

interface CoachTabProps {
  userStats: UserStats;
  tasks: Task[];
  focusScore: number;
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  onImportAITasks: (importedTasks: Omit<Task, 'id' | 'createdAt' | 'actualPomodoros'>[], offsetCalendarEvts: Omit<CalendarEvent, 'id'>[]) => void;
  onOptimizeTasksOrder: (sortedOrderIds: string[], insightText: string) => void;
}

export default function CoachTab({
  userStats,
  tasks,
  focusScore,
  chatHistory,
  onAddChatMessage,
  onImportAITasks,
  onOptimizeTasksOrder,
}: CoachTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'planner' | 'optimizer'>('chat');

  // 1. AI Chat Coach variables
  const [typedMessage, setTypedMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomChatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomChatRef.current) {
      bottomChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  // Context gathering
  const getContextPayload = () => {
    return {
      xp: userStats.xp,
      level: userStats.level,
      streak: userStats.streak,
      totalSessions: userStats.totalSessions,
      totalFocusMinutes: userStats.totalFocusMinutes,
      focusScore: focusScore,
      projectsCount: 6,
      currentTaskTitle: tasks.filter(t => !t.completed)[0]?.title || "None selected"
    };
  };

  const handleSendChatMessage = async () => {
    const textToSend = typedMessage.trim();
    if (!textToSend) return;

    // Create intermediate User message
    const userMsg: ChatMessage = {
      id: `chat-usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    onAddChatMessage(userMsg);
    setTypedMessage("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          context: getContextPayload()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `chat-ai-${Date.now()}`,
        sender: 'ai',
        text: data?.text || "The coach experienced a small sync lag. Please rephrase your target.",
        timestamp: new Date().toLocaleTimeString()
      };
      onAddChatMessage(aiMsg);
    } catch (err: any) {
      console.error("Chat message processing error:", err);
      const aiMsg: ChatMessage = {
        id: `chat-ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Error connecting to AI Coach: ${err.message || "An unexpected issue occurred."}. Make sure your server is running and your GEMINI_API_KEY is active.`,
        timestamp: new Date().toLocaleTimeString()
      };
      onAddChatMessage(aiMsg);
    } finally {
      setChatLoading(false);
    }
  };

  const handlePresetQuestion = (promptText: string) => {
    setTypedMessage(promptText);
  };

  // 2. Syllabus study planner variables
  const [examTopic, setExamTopic] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{ tasks: any[]; advice: string } | null>(null);
  const [planImported, setPlanImported] = useState(false);

  const handleGenerateStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTopic.trim()) {
      alert("Please enter the study target or exam name!");
      return;
    }

    setPlannerLoading(true);
    setGeneratedPlan(null);
    setPlanImported(false);

    try {
      const response = await fetch("/api/coach/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examTopic: examTopic.trim(),
          daysLeft: daysRemaining,
          targetHoursPerDay: hoursPerDay
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.tasks) {
        setGeneratedPlan(data);
      } else {
        throw new Error("Unable to parse structured schedule tasks.");
      }
    } catch (err: any) {
      console.error("Failed study plan generation:", err);
      alert(`AI Study Planner Error: ${err.message || "An expected server error occurred."}. Please check your connection and GEMINI_API_KEY settings.`);
    } finally {
      setPlannerLoading(false);
    }
  };

  const handleExecutePlanImport = () => {
    if (!generatedPlan || planImported) return;

    // Map plan's generated tasks formatted as:
    // title, durationMinutes, priority, dayOffset, subtasks
    const importedTasksList = generatedPlan.tasks.map((pt, idx) => {
      const subtasks = (pt.subtasks || []).map((st: string, sIdx: number) => ({
        id: `imported-sub-${idx}-${sIdx}-${Date.now()}`,
        title: st,
        completed: false
      }));

      return {
        title: `${pt.title} [Syllabus Offset: Day ${pt.dayOffset}]`,
        notes: `AI Coach syllabus item studying ${examTopic}. Generated duration: ${pt.durationMinutes}m.`,
        priority: (pt.priority || 'medium') as any,
        tags: [examTopic.toLowerCase().replace(/\s+/g, '-'), 'syllabus'],
        projectId: 'proj-med', // default assign to medical school or inbox
        deadline: new Date(Date.now() + pt.dayOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recurring: 'none' as const,
        estimatedPomodoros: Math.max(Math.round(pt.durationMinutes / 25), 1),
        subtasks
      };
    });

    // Map plan's calendar events
    const importedCalendarEvts = generatedPlan.tasks.map((pt) => {
      const dateToRun = new Date(Date.now() + pt.dayOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return {
        title: `AI: ${pt.title}`,
        date: dateToRun,
        startTime: "10:00",
        endTime: pt.durationMinutes === 50 ? "10:50" : "10:25"
      };
    });

    onImportAITasks(importedTasksList, importedCalendarEvts);
    setPlanImported(true);
  };

  // 3. Schedule Optimizer variables
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<string | null>(null);

  const handleRunOptimizer = async () => {
    setOptimizeLoading(true);
    setOptimizeResult(null);

    const activeTasksPayload = tasks.filter(t => !t.completed);

    try {
      const response = await fetch("/api/coach/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: activeTasksPayload,
          focusHoursHistory: [60, 100, 25, 50],
          currentFocusScore: focusScore
        })
      });
      const data = await response.json();
      if (data && data.optimizedSequence) {
        onOptimizeTasksOrder(data.optimizedSequence, data.insight);
        setOptimizeResult(data.insight);
      }
    } catch (err) {
      console.error("Optimize schedule error:", err);
    } finally {
      setOptimizeLoading(false);
    }
  };


  return (
    <div id="coach-view-hub" className="space-y-6 select-none">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-white/5 pb-1 gap-6 text-sm">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`pb-3 font-semibold transition-all relative ${activeSubTab === 'chat' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
        >
          AI Conversation Chatbot
        </button>
        <button
          onClick={() => setActiveSubTab('planner')}
          className={`pb-3 font-semibold transition-all relative ${activeSubTab === 'planner' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
        >
          Study Syllabus Planner
        </button>
        <button
          onClick={() => setActiveSubTab('optimizer')}
          className={`pb-3 font-semibold transition-all relative ${activeSubTab === 'optimizer' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
        >
          Schedule Optimizer
        </button>
      </div>

      {/* SUB-TAB 1: DYNAMIC CHAT COACH */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Chat Stream */}
          <div className="lg:col-span-8 bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col h-[480px] justify-between">
            {/* Conversations list area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 select-text scrollbar-none">
              
              {chatHistory.map((m) => (
                <div 
                  key={m.id}
                  className={`flex gap-3 max-w-xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${m.sender === 'user' ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400' : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'}`}>
                    <span className="text-[10px] font-mono leading-none">{m.sender === 'user' ? 'ME' : 'AI'}</span>
                  </div>

                  <div className={`p-4 rounded-2xl leading-relaxed text-xs ${m.sender === 'user' ? 'bg-[#0f2139] border border-cyan-500/10 rounded-tr-none text-slate-200' : 'bg-slate-950/40 border border-slate-900 rounded-tl-none text-slate-300'}`}>
                    <p>{m.text}</p>
                    <span className="text-[8px] font-mono text-slate-600 block mt-1.5 select-none">{m.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* Chat loader state spinner */}
              {chatLoading && (
                <div className="flex gap-3 max-w-xl">
                  <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  </div>
                  <div className="bg-slate-950/20 border border-slate-900 p-4 rounded-2xl rounded-tl-none text-slate-500 text-xs italic">
                    AI Coach analyzing stats and writing response...
                  </div>
                </div>
              )}

              {/* anchor block */}
              <div ref={bottomChatRef} />
            </div>

            {/* Input triggers row */}
            <div className="border-t border-slate-900 pt-4 mt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask your Coach e.g., Analyze my productivity parameters / Streak tips..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:ring-0"
              />
              <button
                onClick={handleSendChatMessage}
                className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Sidebar: Preset questions list & Quick stats preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 space-y-4 font-sans select-text">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <HelpCircle className="w-4.5 h-4.5 text-cyan-400" /> Suggested coach topics
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal">Select a prompt below to evaluate state parameters with the AI:</p>
              
              <div className="space-y-2">
                {[
                  "Analyze my late night focus patterns",
                  "Explain my focus score and how to optimize it",
                  "Give me some hard motivation for my path tests",
                  "How do my Daily challenges stats map out?"
                ].map((txt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetQuestion(txt)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/40 border border-slate-900 text-[11px] text-slate-300 hover:bg-[#111c30] hover:border-cyan-500/25 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate">{txt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900/60 p-5 rounded-3xl border border-indigo-500/25 text-xs text-indigo-200 leading-normal">
              <span className="flex items-center gap-1 font-bold text-indigo-300 font-mono text-[10px] uppercase mb-2"><Zap className="w-4 h-4" /> Real-time state syncing active</span>
              The Coach reads your currently scheduled <strong>{tasks.filter(t => !t.completed).length} tasks</strong>, active streak <strong>{userStats.streak} days</strong>, level Lvl {userStats.level}, and focus score of {focusScore} during prompt compilation.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SYLLABUS STUDY PLANNER */}
      {activeSubTab === 'planner' && (
        <div className="space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5">
            <form onSubmit={handleGenerateStudyPlan} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end select-text">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">Exam / Target Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g., Ophthalmology Medical Final Exam / Machine Learning Syllabus"
                  value={examTopic} 
                  onChange={(e) => setExamTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase block">Days left</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="180" 
                    value={daysRemaining} 
                    onChange={(e) => setDaysRemaining(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase block">Expected Study hours/Day</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    value={hoursPerDay} 
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={plannerLoading}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded shadow flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {plannerLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Compiling Study Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" /> Construct Study Syllabus
                  </>
                )}
              </button>
            </form>
          </div>

          <AnimatePresence>
            {generatedPlan && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-text"
              >
                {/* Result Tasks details */}
                <div className="lg:col-span-8 bg-slate-900/20 p-6 rounded-3xl border border-slate-850 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <BookOpen className="w-4.5 h-4.5 text-cyan-400" /> Formulated Syllabus milestones
                    </h4>
                    
                    {!planImported ? (
                      <button
                        onClick={handleExecutePlanImport}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold text-xs text-slate-950 flex items-center gap-1.5 transition-colors"
                      >
                        <CalendarDays className="w-3.5 h-3.5" /> Schedule Plan Directly
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-slate-900 text-emerald-400 font-bold font-mono text-[10px] rounded border border-emerald-500/10">
                        ✔️ ACTIVE IN CALENDAR & TASKS
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
                    {generatedPlan.tasks.map((pt, idx) => (
                      <div key={idx} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono leading-none tracking-wider font-semibold block w-max">
                            DAY OFFSET: DAY {pt.dayOffset}
                          </span>
                          <h5 className="text-xs font-bold text-white">{pt.title}</h5>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {(pt.subtasks || []).map((sub: string, sIdx: number) => (
                              <span key={sIdx} className="px-1.5 py-0.5 bg-slate-900 text-[8px] text-slate-400 rounded">
                                • {sub}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-600" /> {pt.durationMinutes}m duration
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advice summary */}
                <div className="lg:col-span-4 bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-4 height-max">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Activity className="w-4.5 h-4.5" /> Exam Pass Strategy
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light select-text">
                    {generatedPlan.advice}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* SUB-TAB 3: SCHEDULE OPTIMIZER */}
      {activeSubTab === 'optimizer' && (
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="text-center py-6 select-text max-w-sm mx-auto space-y-3">
            <h4 className="text-lg font-bold text-white font-sans">Sequence Algorithmic optimizer</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Reorders your active tasks list based on strict priority factors, estimated Pomodoro times, focus histories, and upcoming deadlines automatically.
            </p>
            <button
              onClick={handleRunOptimizer}
              disabled={optimizeLoading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-xs rounded-full shadow-lg shadow-cyan-500/10 active:scale-95 transition-all text-center"
            >
              {optimizeLoading ? 'Running algorithm...' : 'Rearrange with AI'}
            </button>
          </div>

          <AnimatePresence>
            {optimizeResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-2 select-text"
              >
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Optimization Report Generated
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {optimizeResult}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
