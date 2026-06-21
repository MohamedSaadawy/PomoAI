import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Sparkles, 
  Calendar, 
  Flag, 
  Tag, 
  Clock, 
  ListTodo, 
  CheckCircle2, 
  HelpCircle,
  Pin,
  ChevronDown,
  Play
} from 'lucide-react';
import { Task, Project, SubTask } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  projects: Project[];
  activeTaskId?: string;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'actualPomodoros'>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
}

export default function TaskManager({
  tasks,
  projects,
  activeTaskId,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onSelectTask,
}: TaskManagerProps) {
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

  // Triggering the Gemini-AI breakdown endpoint
  const handleAIBreakdownOfTitle = async () => {
    if (!title.trim()) {
      alert("Provide a task title first so the AI Coach can analyze and break it down!");
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
        body: JSON.stringify({ taskTitle: title })
      });
      const data = await res.json();
      if (data && data.subtasks) {
        setSubtasksList(data.subtasks);
      }
    } catch (err) {
      console.error("Failed breakdown api query:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const subtasks: SubTask[] = subtasksList.map((t, idx) => ({
      id: `sub-${idx}-${Date.now()}`,
      title: t,
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

  return (
    <div id="task-manager-view" className="space-y-6 select-none">
      
      {/* Header and Add Task */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold font-sans text-white tracking-tight flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-cyan-400" /> Operational Task list
          </h2>
          <p className="text-xs text-slate-400 font-light">Directly schedule, prioritize, and subdivide tasks with integrated AI help.</p>
        </div>

        <button
          id="btn-task-trigger-showform"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/10 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Custom Task
        </button>
      </div>

      {/* Add Task Form Dialog Drawer layout */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-6 rounded-3xl border border-cyan-500/10 overflow-hidden"
          >
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Core Fields */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Task Title</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g., Summarize ophthalmology page 112"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950/40 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-slate-200 text-xs focus:ring-0 outline-none"
                    />
                    
                    {/* Real-time AI breakdown helper button */}
                    <button
                      type="button"
                      onClick={handleAIBreakdownOfTitle}
                      disabled={aiLoading}
                      className="absolute right-2.5 top-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 text-indigo-400 text-[10px] font-mono flex items-center gap-1 transition-colors"
                      title="Generate study milestones automatically"
                    >
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      {aiLoading ? 'Breaking...' : 'AI Breakdown'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Context notes & description</label>
                  <textarea 
                    rows={3}
                    placeholder="Enter study links, flashcard objectives, or reference syllabus goals here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-slate-200 text-xs focus:ring-0 outline-none resize-none"
                  />
                </div>

                {/* Subtask checklist builder */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Subtasks Checklist</label>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add sub-phase sequence item..."
                      value={newSubtaskText}
                      onChange={(e) => setNewSubtaskText(e.target.value)}
                      className="flex-1 bg-slate-950/40 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubTaskText}
                      className="px-4 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
                    >
                      Add
                    </button>
                  </div>

                  {/* Built steps checklist progress */}
                  {subtasksList.length > 0 && (
                    <div className="space-y-2 bg-slate-950/20 p-4 rounded-xl border border-slate-800 text-xs">
                      {subtasksList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            {item}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSubtaskItem(idx)}
                            className="text-rose-500 hover:text-rose-400"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Metadata Filters */}
              <div className="md:col-span-4 bg-slate-950/20 p-5 rounded-2xl border border-slate-900 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Assign Project</label>
                  <select 
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                  >
                    <option value="inbox">📥 Inbox (No Project)</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Priority</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Estimated Pomos</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={estimatedPomodoros}
                      onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Deadline Date</label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Recurring Interval</label>
                  <select 
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily Loop</option>
                    <option value="weekly">Weekly Loop</option>
                    <option value="monthly">Monthly Loop</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="anatomy, clinical, coding"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-[#0b0f19] font-bold text-xs rounded-xl shadow mt-2 transition-colors"
                >
                  Confirm Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Hub Row */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex flex-wrap gap-4 items-center justify-between text-xs text-slate-400">
        <div className="flex gap-4 flex-wrap">
          {/* Project filtering drop */}
          <div className="flex items-center gap-1.5">
            <span>Project:</span>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 outline-none"
            >
              <option value="all">All Projects</option>
              <option value="inbox">Inbox</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Completed toggle pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
          {['pending', 'completed', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterCompleted(status)}
              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${filterCompleted === status ? 'bg-slate-800 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              {status}
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
                className={`glass-panel p-5 rounded-3xl border transition-all ${isSpotlit ? 'border-cyan-500/40 bg-[#0a111e]' : 'border-white/5 bg-slate-900/10 hover:border-slate-800'}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Title and details column */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onEditTask({ ...task, completed: !task.completed })}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${task.completed ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700 hover:border-cyan-400'}`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      
                      <h4 className={`text-sm font-bold select-text text-white ${task.completed ? 'line-through text-slate-500 opacity-60' : ''}`}>
                        {task.title}
                      </h4>

                      {/* Priorities badges */}
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest ${task.priority === 'high' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10' : task.priority === 'medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10'}`}>
                        {task.priority}
                      </span>

                      {/* Project identity badge */}
                      {projectObj && (
                        <span 
                          className="px-2 py-0.5 rounded text-[8px] font-mono font-bold text-white border"
                          style={{ borderColor: `${projectObj.color}30`, backgroundColor: `${projectObj.color}15` }}
                        >
                          {projectObj.name}
                        </span>
                      )}

                      {/* Recur flag */}
                      {task.recurring !== 'none' && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] font-mono text-indigo-300">
                          🔁 {task.recurring}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl select-text font-light">
                      {task.notes}
                    </p>

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap gap-4 items-center text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-600" /> Pomos: {task.actualPomodoros}/{task.estimatedPomodoros}
                      </span>
                      
                      {task.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400/80" /> Deadline: {task.deadline}
                        </span>
                      )}

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-slate-600" /> 
                          <span className="text-[9px] text-slate-400">{task.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Spotlight Select */}
                    {!task.completed && (
                      <button
                        onClick={() => onSelectTask(task)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-1 transition-all ${isSpotlit ? 'bg-cyan-500/25 border border-cyan-500/40 text-cyan-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/5'}`}
                      >
                        <Pin className="w-3 h-3" /> {isSpotlit ? 'Spotlit' : 'Spotlight'}
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 rounded-lg bg-slate-800/60 border border-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Checklist subtasks dropdown state details */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-900/60 space-y-2 select-text">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Procedural Checkpoints:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {task.subtasks.map((st) => (
                        <div 
                          key={st.id} 
                          onClick={() => toggleSubTask(task, st.id)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/20 border border-slate-950 hover:bg-slate-950/40 cursor-pointer transition-colors text-xs"
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${st.completed ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-800 bg-slate-900'}`}>
                            {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className={`text-[11px] truncate ${st.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
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
          <div className="text-center py-16 border border-dashed border-slate-800 bg-slate-900/5 rounded-3xl text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-700 mx-auto" />
            <h4 className="font-bold text-sm text-slate-400">All clear inside category</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">No pending items found matching filters. Tap the 'Create Custom Task' button to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
