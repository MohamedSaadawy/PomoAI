import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Calendar, 
  Tag, 
  Clock, 
  ListTodo, 
  CheckCircle2, 
  Pin
} from 'lucide-react';
import { Task, Project, SubTask } from '../types';
import { translations } from '../utils/translations';

interface TaskManagerProps {
  tasks: Task[];
  projects: Project[];
  activeTaskId?: string;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'actualPomodoros'>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
  lang: 'en' | 'ar';
  appTheme: 'dark' | 'light';
}

export default function TaskManager({
  tasks,
  projects,
  activeTaskId,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onSelectTask,
  lang,
  appTheme
}: TaskManagerProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Navigation filters
  const [filterProject, setFilterProject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCompleted, setFilterCompleted] = useState('pending'); // pending, completed, all

  // Creating state form
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("inbox");
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [tagsInput, setTagsInput] = useState("");
  
  // Create Checklist items on add
  const [subtasksList, setSubtasksList] = useState<string[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  // AI Breakdown state indicators
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErrorMsg, setAiErrorMsg] = useState("");

  // Triggering the Gemini-AI breakdown endpoint
  const handleAIBreakdownOfTitle = async () => {
    setAiErrorMsg("");
    if (!title.trim()) {
      setAiErrorMsg(lang === 'en' ? "Please type a title for Gemini to disassemble first." : "يرجى كتابة عنوان للمهمة ليقوم الذكاء الاصطناعي بتفكيكها.");
      return;
    }

    setAiLoading(true);
    try {
      const customApiKey = localStorage.getItem('pomo_custom_gemini_api_key') || '';
      const res = await fetch("/api/coach/breakdown", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(customApiKey ? { "X-Gemini-API-Key": customApiKey } : {})
        },
        body: JSON.stringify({ taskTitle: title, lang })
      });
      const data = await res.json();
      if (res.status === 200 && data && data.subtasks) {
        setSubtasksList(data.subtasks);
      } else {
        setAiErrorMsg(lang === 'en' ? "Disassembling unsuccessful. Using basic plan." : "تعذر التفكيك. يرجى إدخال النقاط يدويًا.");
      }
    } catch (err) {
      console.error("Failed breakdown api query:", err);
      setAiErrorMsg(lang === 'en' ? "Failed to communicate with AI Coach." : "تعذر الاتصال بمركز التدريب الذكي.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const subtasks: SubTask[] = subtasksList.map((stTxt, idx) => ({
      id: `sub-${idx}-${Date.now()}`,
      title: stTxt,
      completed: false
    }));

    onAddTask({
      title,
      completed: false,
      projectId,
      priority,
      tags,
      notes,
      deadline: deadline || new Date().toISOString().split('T')[0],
      recurring,
      estimatedPomodoros,
      subtasks
    });

    // Reset fields
    setTitle("");
    setProjectId("inbox");
    setPriority("medium");
    setEstimatedPomodoros(2);
    setNotes("");
    setDeadline("");
    setRecurring("none");
    setTagsInput("");
    setSubtasksList([]);
    setShowAddForm(false);
  };

  const handleAddSubTaskText = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasksList([...subtasksList, newSubtaskText.trim()]);
    setNewSubtaskText("");
  };

  const handleRemoveSubtaskItem = (idx: number) => {
    setSubtasksList(subtasksList.filter((_, i) => i !== idx));
  };

  // Toggle subtask status in real-time
  const toggleSubTask = (task: Task, subId: string) => {
    const updatedSubtasks = task.subtasks.map(st => {
      if (st.id === subId) return { ...st, completed: !st.completed };
      return st;
    });
    
    onEditTask({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  // Filter tasks based on settings
  const filteredTasks = tasks.filter(task => {
    const matchesProj = filterProject === 'all' || task.projectId === filterProject;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = 
      filterCompleted === 'all' || 
      (filterCompleted === 'completed' && task.completed) ||
      (filterCompleted === 'pending' && !task.completed);
    return matchesProj && matchesPriority && matchesStatus;
  });

  // Color Styles depending on appTheme
  const cardBgClass = appTheme === 'light' 
    ? 'bg-white border-slate-200 text-slate-800' 
    : 'bg-[#0b0f19]/60 border-white/5 text-slate-100';

  const widgetBgClass = appTheme === 'light' ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/30 border-white/5';
  const textTitleClass = appTheme === 'light' ? 'text-slate-900' : 'text-white';
  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const inputBgClass = appTheme === 'light' ? 'bg-slate-50 border-slate-250 text-slate-850 focus:border-cyan-500' : 'bg-slate-955/60 border-slate-800 focus:border-cyan-500';

  return (
    <div id="task-manager-view" className="space-y-6 select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header and Add Task */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${textTitleClass}`}>
            <ListTodo className="w-6 h-6 text-cyan-500" /> 
            <span>{lang === 'en' ? 'Task & Syllabus Planner' : 'قائمة المهام والخطط الدراسية'}</span>
          </h2>
          <p className={`text-xs ${textMutedClass} font-light`}>
            {lang === 'en' ? 'Divide larger tasks into atomic chunks manually or with the AI disassembled planner.' : 'قسّم المهام المعقدة وشيد مسارات دراسية دقيقة بنفسك أو بمساعدة الذكاء الاصطناعي.'}
          </p>
        </div>

        <button
          id="btn-task-trigger-showform"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 cursor-pointer leading-none shrink-0"
        >
          <Plus className="w-4 h-4" /> 
          <span>{showAddForm ? (lang === 'en' ? 'Hide Form' : 'إخفاء الحقول') : (lang === 'en' ? 'Add study task' : 'مهمة دراسية جديدة')}</span>
        </button>
      </div>

      {/* Add Task Form Dialog Drawer layout */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border p-5 rounded-2xl overflow-hidden shadow-sm ${
              appTheme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b0f19]/80 border-cyan-500/10'
            }`}
          >
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Core Fields */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Task Title' : 'عنوان الدرس أو المهمة'}</label>
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder={lang === 'en' ? "e.g., Final cardiology review cards" : "مثال: مراجعة بطاقات استذكار قسم الكارديو"}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full bg-transparent border rounded-xl py-3 text-xs outline-none focus:ring-0 ${isRtl ? 'pl-28 pr-4' : 'pr-28 pl-4'} ${
                        appTheme === 'light' ? 'border-slate-200 text-slate-800' : 'border-slate-800 text-slate-200'
                      }`}
                    />
                    
                    {/* Real-time AI breakdown helper button */}
                    <button
                      type="button"
                      onClick={handleAIBreakdownOfTitle}
                      disabled={aiLoading}
                      className={`absolute ${isRtl ? 'left-2' : 'right-2'} px-3 py-1.5 rounded-lg border text-[9px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                        appTheme === 'light' 
                          ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-cyan-500 animate-pulse" />
                      <span>{aiLoading ? (lang === 'en' ? 'Decomposing...' : 'تفكيك...') : (lang === 'en' ? 'AI Division' : 'تفكيك ذكي')}</span>
                    </button>
                  </div>
                  {aiErrorMsg && <p className="text-[10px] text-rose-500 font-medium">{aiErrorMsg}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Details / Objectives' : 'أهداف ومنهجية المذاكرة'}</label>
                  <textarea 
                    rows={2.5}
                    placeholder={lang === 'en' ? "Study links, flashcard objectives, pages to parse..." : "رابط المحاضرة، الأفكار الأساسية، الصفحات المشمولة..."}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`w-full bg-transparent border rounded-xl px-4 py-3 text-xs outline-none focus:ring-0 resize-none ${
                      appTheme === 'light' ? 'border-slate-200 text-slate-850' : 'border-slate-800 text-slate-200'
                    }`}
                  />
                </div>

                {/* Subtask checklist builder */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Custom Subtask Milestones' : 'النقاط الفرعية للمهمة'}</label>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder={lang === 'en' ? "Add custom study checkpoint item..." : "أضف خطوة فرعية مخصصة..."}
                      value={newSubtaskText}
                      onChange={(e) => setNewSubtaskText(e.target.value)}
                      className={`flex-1 bg-transparent border rounded-xl px-3 py-2 text-xs outline-none ${
                        appTheme === 'light' ? 'border-slate-200 text-slate-850' : 'border-slate-800 text-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddSubTaskText}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold leading-none cursor-pointer shrink-0"
                    >
                      {lang === 'en' ? 'Add' : 'إضافة'}
                    </button>
                  </div>

                  {/* Built steps checklist progress */}
                  {subtasksList.length > 0 && (
                    <div className={`p-3 rounded-xl border text-xs gap-2 space-y-1.5 ${
                      appTheme === 'light' ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-950/20 border-slate-800'
                    }`}>
                      {subtasksList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            <span className={appTheme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{item}</span>
                          </span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSubtaskItem(idx)}
                            className="text-rose-500 hover:text-rose-400 text-[10px] font-medium tracking-tight cursor-pointer"
                          >
                            {lang === 'en' ? 'Delete' : 'حذف'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Metadata Filters */}
              <div className={`md:col-span-4 p-4 rounded-xl border space-y-4 ${
                appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'
              }`}>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Project Category' : 'مجلد التخصص'}</label>
                  <select 
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                      appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-300'
                    }`}
                  >
                    <option value="inbox">📥 {lang === 'en' ? 'Inbox Tasks' : 'صندوق الوارد عمومی'}</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Priority' : 'مستوى الأهمية'}</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                        appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-200'
                      }`}
                    >
                      <option value="high">🔴 {lang === 'en' ? 'High' : 'قصوى'}</option>
                      <option value="medium">🟡 {lang === 'en' ? 'Medium' : 'متوسطة'}</option>
                      <option value="low">🟢 {lang === 'en' ? 'Low' : 'هادئة'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Target Pomos' : 'دورة تركيز تقديرية'}</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={estimatedPomodoros}
                      onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
                      className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                        appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Deadline Date' : 'تاريخ التسليم النهائي'}</label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`w-full border rounded-lg p-2 text-xs bg-transparent font-mono ${
                      appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-200'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Interval Loop' : 'تكرار الدورة'}</label>
                  <select 
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value as any)}
                    className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                      appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-200'
                    }`}
                  >
                    <option value="none">{lang === 'en' ? 'None' : 'مرة واحدة'}</option>
                    <option value="daily">{lang === 'en' ? 'Daily' : 'يوميًا'}</option>
                    <option value="weekly">{lang === 'en' ? 'Weekly' : 'أسبوعيًا'}</option>
                    <option value="monthly">{lang === 'en' ? 'Monthly' : 'شهريًا'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Tags (comma split)' : 'الوسوم (مفصولة بفاصلة)'}</label>
                  <input 
                    type="text" 
                    placeholder="anatomy, clinic, swift"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                      appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-200'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all hover:opacity-90 leading-none"
                >
                  {lang === 'en' ? 'Schedule task now' : 'جدولة السجل ودعم القائمة'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Hub Row */}
      <div className={`p-4 rounded-2xl border flex flex-wrap gap-4 items-center justify-between text-xs font-medium ${
        appTheme === 'light' ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#0b0f19]/60 border-white/5 text-slate-400'
      }`}>
        <div className="flex gap-4 flex-wrap items-center">
          {/* Project filtering drop */}
          <div className="flex items-center gap-1.5">
            <span>{lang === 'en' ? 'Category:' : 'مجلد المشروع:'}</span>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className={`border rounded px-2.5 py-1 outline-none text-xs bg-transparent ${
                appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-250'
              }`}
            >
              <option value="all">{lang === 'en' ? 'All Projects' : 'جميع التصنيفات'}</option>
              <option value="inbox">📥 {lang === 'en' ? 'Inbox only' : 'الوارد فقط'}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span>{lang === 'en' ? 'Priority:' : 'الأولويات:'}</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`border rounded px-2.5 py-1 outline-none text-xs bg-transparent ${
                appTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-250'
              }`}
            >
              <option value="all">{lang === 'en' ? 'All priorities' : 'كافة الأولويات'}</option>
              <option value="high">{lang === 'en' ? 'High' : 'قصوى'}</option>
              <option value="medium">{lang === 'en' ? 'Medium' : 'متوسطة'}</option>
              <option value="low">{lang === 'en' ? 'Low' : 'هادئة'}</option>
            </select>
          </div>
        </div>

        {/* Completed toggle pills */}
        <div className={`p-1 rounded-xl flex items-center gap-1 shrink-0 ${appTheme === 'light' ? 'bg-slate-100' : 'bg-slate-950'}`}>
          {['pending', 'completed', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterCompleted(status)}
              className={`px-3 py-1 text-[9px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                filterCompleted === status 
                  ? 'bg-cyan-500 text-white font-extrabold shadow-sm' 
                  : 'text-slate-400 hover:text-cyan-500'
              }`}
            >
              {status === 'pending' ? (lang === 'en' ? 'Pending' : 'قيد العمل') : status === 'completed' ? (lang === 'en' ? 'Done' : 'مكتملة') : (lang === 'en' ? 'All' : 'الكل')}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table list output */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const projectObj = projects.find(p => p.id === task.projectId);
            const isSpotlit = activeTaskId === task.id;
            
            return (
              <motion.div
                key={task.id}
                layoutId={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSpotlit 
                    ? (appTheme === 'light' ? 'border-cyan-500 bg-cyan-50/10 shadow-sm' : 'border-cyan-500/30 bg-[#0a111e]') 
                    : (appTheme === 'light' ? 'border-slate-200 bg-white hover:bg-slate-50/50 hover:shadow-xs' : 'border-white/5 bg-[#0b0f19]/30 hover:border-slate-800')
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Title and details column */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onEditTask({ ...task, completed: !task.completed })}
                        className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${task.completed ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-400 hover:border-cyan-500'}`}
                      >
                        {task.completed && <Check className="w-3" />}
                      </button>
                      
                      <h4 className={`text-xs sm:text-sm font-bold select-text ${
                        task.completed 
                          ? 'line-through text-slate-400 opacity-60' 
                          : textTitleClass
                      }`}>
                        {task.title}
                      </h4>
 
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase leading-none ${
                        task.priority === 'high' ? 'bg-rose-500/15 text-rose-500' : task.priority === 'medium' ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'
                      }`}>
                        {task.priority === 'high' ? (lang === 'en' ? 'High' : 'قصوى') : task.priority === 'medium' ? (lang === 'en' ? 'Med' : 'متوسطة') : (lang === 'en' ? 'Low' : 'هادئة')}
                      </span>

                      {projectObj && (
                        <span 
                          className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold leading-none"
                          style={{ borderColor: `${projectObj.color}30`, backgroundColor: `${projectObj.color}10`, color: projectObj.color, borderWidth: '1px' }}
                        >
                          {projectObj.name}
                        </span>
                      )}

                      {task.recurring !== 'none' && (
                        <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[8px] font-mono text-indigo-400 leading-none">
                          🔁 {task.recurring === 'daily' ? (lang === 'en' ? 'Daily' : 'يومي') : task.recurring === 'weekly' ? (lang === 'en' ? 'Weekly' : 'أسبوعي') : (lang === 'en' ? 'Monthly' : 'شهري')}
                        </span>
                      )}
                    </div>

                    {task.notes && (
                      <p className={`text-xs font-light select-text leading-relaxed ${textMutedClass}`}>
                        {task.notes}
                      </p>
                    )}

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap gap-4 items-center text-[10px] text-slate-500 font-mono leading-none">
                      <span className="flex items-center gap-1 select-none">
                        <Clock className="w-3.5 h-3.5" /> 
                        <span>{lang === 'en' ? 'Pomos:' : 'دورات بومودورو:'} {task.actualPomodoros}/{task.estimatedPomodoros}</span>
                      </span>
                      
                      {task.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" /> 
                          <span>{lang === 'en' ? 'Deadline:' : 'التسليم:'} {task.deadline}</span>
                        </span>
                      )}

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" /> 
                          <span className="text-[9px] text-slate-400">{task.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!task.completed && (
                      <button
                        onClick={() => onSelectTask(task)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                          isSpotlit 
                            ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-600 dark:text-cyan-300' 
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 dark:border-white/5 hover:text-slate-800 dark:hover:text-white border'
                        }`}
                      >
                        <Pin className="w-3 h-3" /> 
                        <span>{isSpotlit ? (lang === 'en' ? 'Spotlit' : 'مُحدَّد') : (lang === 'en' ? 'Spotlight' : 'تحديد كشعلة')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer ${
                        appTheme === 'light' 
                          ? 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-400' 
                          : 'bg-slate-800/60 border-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'
                      }`}
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Checklist subtasks dropdown state details */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-500/10 space-y-2 select-text">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{lang === 'en' ? 'Subtask Milestones:' : 'محطات فرعية متبقية:'}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {task.subtasks.map((st) => (
                        <div 
                          key={st.id} 
                          onClick={() => toggleSubTask(task, st.id)}
                          className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors text-xs ${
                            appTheme === 'light' 
                              ? 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50' 
                              : 'bg-[#05080f]/50 border-white/5 hover:bg-slate-900/50'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${st.completed ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-300 bg-transparent'}`}>
                            {st.completed && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className={`text-[11px] truncate ${st.completed ? 'line-through text-slate-400' : appTheme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                            {st.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className={`text-center py-16 border border-dashed rounded-2xl space-y-2 ${
            appTheme === 'light' ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/5'
          }`}>
            <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className={`font-bold text-sm ${textTitleClass}`}>{lang === 'en' ? 'All clear inside filters' : 'القائمة خالية في هذا التصنيف'}</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {lang === 'en' ? "Create a study task or try changing priority filter levels above." : "لا داعي للقلق! ابدأ بكتابة مهمتك الأولى واضغط على زر الإنشاء بالاستمارة."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
