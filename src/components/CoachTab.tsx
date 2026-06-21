import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  Zap,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { ChatMessage, Task, UserStats, CalendarEvent } from '../types';
import { translations } from '../utils/translations';

interface CoachTabProps {
  userStats: UserStats;
  tasks: Task[];
  focusScore: number;
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  onImportAITasks: (importedTasks: Omit<Task, 'id' | 'createdAt' | 'actualPomodoros'>[], offsetCalendarEvts: Omit<CalendarEvent, 'id'>[]) => void;
  onOptimizeTasksOrder: (sortedOrderIds: string[], insightText: string) => void;
  lang: 'en' | 'ar';
  appTheme: 'dark' | 'light';
}

export default function CoachTab({
  userStats,
  tasks,
  focusScore,
  chatHistory,
  onAddChatMessage,
  onImportAITasks,
  onOptimizeTasksOrder,
  lang,
  appTheme
}: CoachTabProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

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
      currentTaskTitle: tasks.filter(t => !t.completed)[0]?.title || "None selected",
      lang
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
      timestamp: new Date().toLocaleTimeString(lang)
    };
    onAddChatMessage(userMsg);
    setTypedMessage("");
    setChatLoading(true);

    try {
      const customApiKey = localStorage.getItem('pomo_custom_gemini_api_key') || '';
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(customApiKey ? { "X-Gemini-API-Key": customApiKey } : {})
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          context: getContextPayload(),
          lang
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
        text: data?.text || (lang === 'en' ? "The coach experienced a small latency. Please try again." : "واجه المدرب بعض التباطؤ في الاستجابة. يرجى المداورة مجددًا."),
        timestamp: new Date().toLocaleTimeString(lang)
      };
      onAddChatMessage(aiMsg);
    } catch (err: any) {
      console.error("Chat message processing error:", err);
      const aiMsg: ChatMessage = {
        id: `chat-ai-err-${Date.now()}`,
        sender: 'ai',
        text: lang === 'en' 
          ? `Error connecting to AI Coach: ${err.message || "Unspecified server error."}. Make sure your server is running and your GEMINI_API_KEY is active.`
          : `خطأ أثناء الاتصال بالمدرب الذكي: ${err.message || "خطأ مجهول في الخادم"}. يرجى التحقق من إعدادات مفتاح GEMINI_API_KEY الخاصة بك.`,
        timestamp: new Date().toLocaleTimeString(lang)
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
  const [plannerError, setPlannerError] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<{ tasks: any[]; advice: string } | null>(null);
  const [planImported, setPlanImported] = useState(false);

  const handleGenerateStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlannerError("");
    if (!examTopic.trim()) {
      setPlannerError(lang === 'en' ? "Please enter a subject topic name first." : "يرجى تحديد اسم الامتحان أو موضوع المنهج.");
      return;
    }

    setPlannerLoading(true);
    setGeneratedPlan(null);
    setPlanImported(false);

    try {
      const customApiKey = localStorage.getItem('pomo_custom_gemini_api_key') || '';
      const response = await fetch("/api/coach/plan", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(customApiKey ? { "X-Gemini-API-Key": customApiKey } : {})
        },
        body: JSON.stringify({
          examTopic: examTopic.trim(),
          daysLeft: daysRemaining,
          targetHoursPerDay: hoursPerDay,
          lang
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Server error ${response.status}`);
      }

      const data = await response.json();
      if (data && data.tasks) {
        setGeneratedPlan(data);
      } else {
        throw new Error("Unable to parse structured schedule tasks.");
      }
    } catch (err: any) {
      console.error("Failed study plan generation:", err);
      setPlannerError(lang === 'en' 
        ? `Syllabus Builder Error: ${err.message || "An issue occurred"}. Check server connection.`
        : `خطأ مخطط المنهج الدراسي: ${err.message || "تعذر التحليل"}. يرجى التحقق من الاتصال بالخادم.`);
    } finally {
      setPlannerLoading(false);
    }
  };

  const handleExecutePlanImport = () => {
    if (!generatedPlan || planImported) return;

    const importedTasksList = generatedPlan.tasks.map((pt, idx) => {
      const subtasks = (pt.subtasks || []).map((st: string, sIdx: number) => ({
        id: `imported-sub-${idx}-${sIdx}-${Date.now()}`,
        title: st,
        completed: false
      }));

      return {
        title: `${pt.title} [Day ${pt.dayOffset}]`,
        notes: lang === 'en' 
          ? `AI Coach syllabus item studying ${examTopic}. Generated duration: ${pt.durationMinutes}m.`
          : `مهمة مجدولة بنظام الذكاء الاصطناعي لموضوع ${examTopic}. المدة: ${pt.durationMinutes} دقيقة.`,
        priority: (pt.priority || 'medium') as any,
        tags: [examTopic.toLowerCase().replace(/\s+/g, '-'), 'syllabus'],
        projectId: 'inbox', 
        deadline: new Date(Date.now() + pt.dayOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        recurring: 'none' as const,
        estimatedPomodoros: Math.max(Math.round(pt.durationMinutes / 25), 1),
        subtasks
      };
    });

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
      const customApiKey = localStorage.getItem('pomo_custom_gemini_api_key') || '';
      const response = await fetch("/api/coach/optimize", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(customApiKey ? { "X-Gemini-API-Key": customApiKey } : {})
        },
        body: JSON.stringify({
          tasks: activeTasksPayload,
          focusHoursHistory: [60, 100, 25, 50],
          currentFocusScore: focusScore,
          lang
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

  // Dynamic Theme Colors
  const cardBgClass = appTheme === 'light' 
    ? 'bg-white border-slate-200 text-slate-800' 
    : 'bg-[#0b0f19]/60 border-white/5 text-slate-100';

  const textTitleClass = appTheme === 'light' ? 'text-slate-900' : 'text-white';
  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';

  const suggestedTopicsEn = [
    "Analyze my late night focus patterns",
    "Explain my focus score and how to optimize it",
    "Give me some hard motivation for my path tests",
    "How do my Daily challenges stats map out?"
  ];

  const suggestedTopicsAr = [
    "حلل عادات المذاكرة الليلية الخاصة بي واقترح أفكارًا لها",
    "اشرح لي معدل التركيز الحالي وكيف يمكنني الارتقاء به",
    "أعطني كلمات تحفيزية قوية للاستمرار في ذروة النشاط",
    "كيف تبدو إحصاءات تحديات الاسترجاع الإجمالية الخاصة بي؟"
  ];

  const suggestedTopics = lang === 'en' ? suggestedTopicsEn : suggestedTopicsAr;

  return (
    <div id="coach-view-hub" className="space-y-6 select-none animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sub tabs navigation */}
      <div className={`flex border-b pb-1 gap-6 text-xs sm:text-sm ${
        appTheme === 'light' ? 'border-slate-200' : 'border-white/5'
      }`}>
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`pb-3 font-semibold transition-all relative cursor-pointer ${
            activeSubTab === 'chat' 
              ? 'text-cyan-500 border-b-2 border-cyan-500' 
              : 'text-slate-500 hover:text-cyan-500'
          }`}
        >
          {lang === 'en' ? 'AI Interactive Chatbot' : 'المدرب المحاور الذكي'}
        </button>
        <button
          onClick={() => setActiveSubTab('planner')}
          className={`pb-3 font-semibold transition-all relative cursor-pointer ${
            activeSubTab === 'planner' 
              ? 'text-cyan-500 border-b-2 border-cyan-500' 
              : 'text-slate-500 hover:text-cyan-500'
          }`}
        >
          {lang === 'en' ? 'Syllabus Planner' : 'مخطط وباني المناهج والامتحانات'}
        </button>
        <button
          onClick={() => setActiveSubTab('optimizer')}
          className={`pb-3 font-semibold transition-all relative cursor-pointer ${
            activeSubTab === 'optimizer' 
              ? 'text-cyan-500 border-b-2 border-cyan-500' 
              : 'text-slate-500 hover:text-cyan-500'
          }`}
        >
          {lang === 'en' ? 'Tasks Optimizer' : 'مركّب وترتيب المهام الذكي'}
        </button>
      </div>

      {/* SUB-TAB 1: DYNAMIC CHAT COACH */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Chat Stream */}
          <div className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col h-[480px] justify-between ${cardBgClass}`}>
            
            {/* Conversations list area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 select-text scrollbar-none">
              
              {chatHistory.map((m) => (
                <div 
                  key={m.id}
                  className={`flex gap-3 max-w-xl ${m.sender === 'user' ? (isRtl ? 'mr-auto' : 'ml-auto') + ' flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.sender === 'user' 
                      ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500 font-bold' 
                      : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 font-bold'
                  }`}>
                    <span className="text-[10px] font-mono leading-none">{m.sender === 'user' ? (lang === 'en' ? 'ME' : 'أنا') : 'AI'}</span>
                  </div>

                  <div className={`p-4 rounded-2xl leading-relaxed text-xs ${
                    m.sender === 'user' 
                      ? 'bg-[#0f2139] border border-cyan-500/10 text-slate-200 rounded-tr-none' 
                      : (appTheme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950/40 border-slate-900 text-slate-300') + ' rounded-tl-none'
                  }`}>
                    <p>{m.text}</p>
                    <span className="text-[8px] font-mono text-slate-500 block mt-1.5 select-none">{m.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* Chat loader state spinner */}
              {chatLoading && (
                <div className="flex gap-3 max-w-xl">
                  <div className="w-8 h-8 rounded bg-indigo-550/10 border border-indigo-500/20 flex items-center justify-center animate-pulse shrink-0">
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  </div>
                  <div className={`p-4 rounded-xl text-xs italic ${
                    appTheme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-slate-950/35 text-slate-500 border border-slate-900'
                  }`}>
                    {lang === 'en' ? 'AI Coach compiles insights and prepares diagnostics...' : 'يقوم المدرب الذكي بتحليل أدائك وكتابة التوجيهات المناسبة...'}
                  </div>
                </div>
              )}

              <div ref={bottomChatRef} />
            </div>

            {/* Input triggers row */}
            <div className={`border-t pt-4 mt-4 flex gap-2 ${appTheme === 'light' ? 'border-slate-200' : 'border-slate-900'}`}>
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Ask anything: Assess metrics / motivation..." : "اكتب سؤالك هنا: حلل مستواي، أعطني تحفيزًا..."}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                className={`flex-1 border rounded-xl px-4 py-3 text-xs outline-none focus:ring-0 ${
                  appTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
              <button
                onClick={handleSendChatMessage}
                className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-5 rounded-2xl border ${cardBgClass} space-y-4 select-text`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${textTitleClass}`}>
                <HelpCircle className="w-4.5 h-4.5 text-cyan-500" /> 
                <span>{lang === 'en' ? 'Quick Coach Prompts' : 'محاور ونقاشات مجهزة'}</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                {lang === 'en' ? 'Instantly toggle productivity evaluation dialogs below:' : 'انقر فوق أي من المواضيع أدناه لتعديل نافذة البحث تلقائيًا:'}
              </p>
              
              <div className="space-y-2">
                {suggestedTopics.map((txt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetQuestion(txt)}
                    className={`w-full text-left p-2.5 rounded-xl text-[10px] sm:text-[11px] flex items-center justify-between transition-all group border cursor-pointer ${
                      appTheme === 'light' 
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                        : 'bg-slate-950/40 border-slate-900 text-slate-300 hover:bg-[#111c30] hover:border-cyan-500/25'
                    }`}
                  >
                    <span className="truncate flex-1">{txt}</span>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-5 rounded-2xl border text-xs leading-normal font-light ${
              appTheme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-gradient-to-br from-indigo-950/50 to-slate-900/60 border-indigo-550/20 text-indigo-200'
            }`}>
              <span className="flex items-center gap-1 font-bold text-indigo-500 font-mono text-[9px] uppercase mb-2 select-none">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" /> 
                {lang === 'en' ? 'Dynamic memory context loaded' : 'قراءة ذكية مستمرة وربط تفاعلي'}
              </span>
              {lang === 'en' 
                ? `AI reads your ${tasks.filter(t => !t.completed).length} pending tasks, active streak of ${userStats.streak} days, and Cognitive score of ${focusScore} instantly on each query.`
                : `يقرأ الذكاء الاصطناعي مهامك الـ ${tasks.filter(t => !t.completed).length} النشطة، وبطاقات إنجازك البالغة ${userStats.streak} أيام متواصلة لصياغة ردود ذكية غاية في الدقة ونصحك لتفوق مذهل.`}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SYLLABUS STUDY PLANNER */}
      {activeSubTab === 'planner' && (
        <div className="space-y-6">
          <div className={`p-5 sm:p-6 rounded-2xl border ${cardBgClass}`}>
            <form onSubmit={handleGenerateStudyPlan} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end select-text text-left">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Target Subject / Examination' : 'موضوع المذاكرة أو اسم الامتحان النهائي'}</label>
                <input 
                  type="text" 
                  placeholder={lang === 'en' ? "Ophthalmology Block / Machine Learning Final" : "مثال: امتحان تخصص الأطفال، مادة تشريح العصب"}
                  value={examTopic} 
                  onChange={(e) => setExamTopic(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan-500 ${
                    appTheme === 'light' ? 'border-slate-250 text-slate-800 bg-slate-50' : 'border-slate-850 text-slate-200 bg-transparent'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Days Remaining' : 'الأيام المتبقية للاستعداد'}</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="180" 
                    value={daysRemaining} 
                    onChange={(e) => setDaysRemaining(parseInt(e.target.value) || 1)}
                    className={`w-full border rounded px-3 py-2 text-xs font-mono outline-none ${
                      appTheme === 'light' ? 'border-slate-250 text-slate-800 bg-slate-50' : 'border-slate-850 text-slate-200 bg-transparent'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Hours / Day target' : 'ساعات المذاكرة المخصصة يوميًا'}</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    value={hoursPerDay} 
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 1)}
                    className={`w-full border rounded px-3 py-2 text-xs font-mono outline-none ${
                      appTheme === 'light' ? 'border-slate-250 text-slate-800 bg-slate-50' : 'border-slate-850 text-slate-200 bg-transparent'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={plannerLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 inline-block leading-none"
                >
                  {plannerLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> 
                      <span>{lang === 'en' ? 'Compiling syllabus...' : 'بناء الخطة والمقرر...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" /> 
                      <span>{lang === 'en' ? 'Construct syllabus map' : 'هيكلة وتوليد الخطة الدراسية بالـ AI'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            {plannerError && <p className="text-[10px] text-rose-500 font-bold mt-2 font-mono">{plannerError}</p>}
          </div>

          <AnimatePresence>
            {generatedPlan && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-text text-left"
              >
                {/* Result Tasks details */}
                <div className={`p-5 sm:p-6 rounded-2xl border lg:col-span-8 space-y-4 ${cardBgClass}`}>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-500/10 pb-3 flex-wrap gap-2">
                    <h4 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${textTitleClass}`}>
                      <BookOpen className="w-4.5 h-4.5 text-cyan-500" /> 
                      <span>{lang === 'en' ? 'Formulated syllabus intervals' : 'الفترات والمواضيع الدراسية المقترحة'}</span>
                    </h4>
                    
                    {!planImported ? (
                      <button
                        onClick={handleExecutePlanImport}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs cursor-pointer transition-all leading-none inline-block"
                      >
                        {lang === 'en' ? 'Schedule schedule directly' : 'إدراج الخطة فورًا وجدولتها'}
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 font-bold font-mono text-[9px] rounded border border-emerald-500/20 uppercase tracking-widest leading-none">
                        ✔️ {lang === 'en' ? 'ACTIVE' : 'مُدرَجة ونشطة'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
                    {generatedPlan.tasks.map((pt, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-900'
                      }`}>
                        <div className="space-y-1 flex-1">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-extrabold uppercase inline-block leading-none">
                            {lang === 'en' ? 'DAY OFFSET: DAY' : 'فارق النشوء: اليوم'} {pt.dayOffset}
                          </span>
                          <h5 className={`text-xs font-semibold ${textTitleClass}`}>{pt.title}</h5>
                          {pt.subtasks && pt.subtasks.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {pt.subtasks.map((sub: string, sIdx: number) => (
                                <span key={sIdx} className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-900 text-[8px] text-slate-500 rounded font-light block leading-none">
                                  • {sub}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 leading-none shrink-0">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> 
                          <span>{pt.durationMinutes} {lang === 'en' ? 'mins' : 'دقيقة'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advice summary */}
                <div className={`p-5 sm:p-6 rounded-2xl border lg:col-span-4 space-y-4 ${cardBgClass}`}>
                  <h4 className="text-xs font-semibold text-indigo-550 dark:text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-cyan-500" /> 
                    <span>{lang === 'en' ? 'Exam Success Strategy' : 'نصائح هامة لاكتساح المواد'}</span>
                  </h4>
                  <p className={`text-xs leading-relaxed font-light ${textMutedClass}`}>
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
        <div className={`p-6 sm:p-8 rounded-3xl border ${cardBgClass}`}>
          <div className="text-center select-text max-w-sm mx-auto space-y-3.5">
            <h4 className={`text-base sm:text-lg font-bold font-sans ${textTitleClass}`}>
              {lang === 'en' ? 'Dynamic prioritizer sequence matrix' : 'منظومة إعادة هيكلة وتسلسل المهام'}
            </h4>
            <p className={`text-xs font-light leading-relaxed ${textMutedClass}`}>
              {lang === 'en' 
                ? 'Rearranges study tasks systematically. Evaluates estimated focus sessions, deadline proximity, and pending project items automatically with AI.' 
                : 'يقوم الذكاء الاصطناعي بفرز وإعادة ترتيب كافة المهام قيد الانتظار استقصاءً لمقررات الامتحان، وتاريخ التسليم المقرب لبسط سيادتك الزمنية.'}
            </p>
            <button
              onClick={handleRunOptimizer}
              disabled={optimizeLoading || tasks.filter(t => !t.completed).length === 0}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer hover:opacity-90 active:scale-95 transition-all inline-block leading-none"
            >
              {optimizeLoading ? (lang === 'en' ? 'Running heuristics...' : 'تشغيل خوارزميات الفرز...') : (lang === 'en' ? 'Rearrange syllabus with AI' : 'تحسين ترتيب القائمة فورًا بالـ AI')}
            </button>
            {tasks.filter(t => !t.completed).length === 0 && (
              <p className="text-[9px] text-slate-500 font-mono select-none">
                {lang === 'en' ? 'No pending tasks found to optimize.' : 'يرجى إدراج بعض المهام في قائمة المهام أولاً للفحص.'}
              </p>
            )}
          </div>

          <AnimatePresence>
            {optimizeResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-5 rounded-2xl border mt-5 select-text ${
                  appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-900'
                }`}
              >
                <h5 className={`text-xs font-bold flex items-center gap-1.5 font-mono mb-2 ${textTitleClass}`}>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" /> 
                  <span>{lang === 'en' ? 'Optimized Study Strategy' : 'تقرير دمج وصياغة تسلسل المهام'}</span>
                </h5>
                <p className={`text-xs leading-relaxed font-light ${textMutedClass}`}>
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
