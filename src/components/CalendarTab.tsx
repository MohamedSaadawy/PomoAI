import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Check, 
  MapPin, 
  BookOpen, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Task, Project, CalendarEvent } from '../types';

interface CalendarTabProps {
  tasks: Task[];
  projects: Project[];
  calendarEvents: CalendarEvent[];
  onAddCalendarEvent: (evt: Omit<CalendarEvent, 'id'>) => void;
}

export default function CalendarTab({
  tasks,
  projects,
  calendarEvents,
  onAddCalendarEvent,
}: CalendarTabProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Adding events state dialog
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("09:00");
  const [eventEndTime, setEventEndTime] = useState("09:50");
  const [associatedTaskId, setAssociatedTaskId] = useState("");

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) return;

    onAddCalendarEvent({
      title: eventTitle.trim(),
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      taskId: associatedTaskId || undefined
    });

    setEventTitle("");
    setEventDate("");
    setEventStartTime("09:00");
    setEventEndTime("09:50");
    setAssociatedTaskId("");
    setShowAddEvent(false);
  };

  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();

  const handleNextRange = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handlePrevRange = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'month') prev.setMonth(prev.getMonth() - 1);
    else if (viewMode === 'week') prev.setDate(prev.getDate() - 7);
    else prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  // Helper arrays for calendar generation
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Year Month specifications
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonthIdx = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysCount = getDaysInMonth(currentYear, currentMonthIdx);
  const startOffset = getFirstDayOfMonthIdx(currentYear, currentMonthIdx);

  // Month days sequence index
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysCount; i++) {
    daysArray.push(i);
  }

  // Format date digits e.g. "2026-06-12"
  const formatDateString = (year: number, monthIdx: number, dayNum: number) => {
    const mStr = (monthIdx + 1).toString().padStart(2, '0');
    const dStr = dayNum.toString().padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  return (
    <div id="calendar-view-panel" className="space-y-6 select-none">
      
      {/* Top Header Selector Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-6 rounded-3xl border border-white/5">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-cyan-400" /> Dynamic scheduler
          </h2>
          <p className="text-xs text-slate-400 font-light">Schedule Pomodoro tasks, view study milestones, or sync structured milestones.</p>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v as any)}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${viewMode === v ? 'bg-slate-800 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation and Actions */}
      <div className="flex justify-between items-center bg-slate-950/20 p-4 rounded-2xl border border-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <button 
              onClick={handlePrevRange}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextRange}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-sm font-bold text-white select-text font-mono">
            {viewMode === 'month' && `${monthNames[currentMonthIdx]} ${currentYear}`}
            {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString()}`}
            {viewMode === 'day' && currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>

        <button
          onClick={() => {
            setEventDate(new Date().toISOString().split('T')[0]);
            setShowAddEvent(true);
          }}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-slate-200 font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Book Block
        </button>
      </div>

      {/* Booking Form Overlay */}
      {showAddEvent && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold font-mono uppercase text-indigo-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Schedule Focus Session Event
          </h4>
          <form onSubmit={handleCreateEventSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">Event Title</label>
              <input 
                type="text" 
                placeholder="Study cardiology slides / complete task..."
                value={eventTitle} 
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-xs text-slate-200 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">Map Task</label>
              <select
                value={associatedTaskId}
                onChange={(e) => setAssociatedTaskId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300"
              >
                <option value="">None Selected</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title} ({t.priority})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">Date</label>
                <input 
                  type="date" 
                  value={eventDate} 
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">Start & End Hours</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="09:00" 
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                  />
                  <input 
                    type="text" 
                    placeholder="09:50" 
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-1/2 bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200" 
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddEvent(false)}
                className="px-4 py-2 bg-slate-800 text-xs font-semibold rounded text-slate-400"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded"
              >
                Schedule Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Calendar Render Area */}

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-7 gap-2 bg-slate-900/10 p-3 rounded-3xl border border-white/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] uppercase font-bold tracking-wider font-mono text-slate-500 py-1">{day}</div>
          ))}

          {daysArray.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-24 bg-slate-950/10 rounded-xl" />;
            }

            const checkDateStr = formatDateString(currentYear, currentMonthIdx, day);
            const items = calendarEvents.filter(e => e.date === checkDateStr);

            return (
              <div 
                key={index} 
                onDoubleClick={() => {
                  setEventDate(checkDateStr);
                  setShowAddEvent(true);
                }}
                className="h-24 bg-slate-950/40 border border-white/5 p-2 rounded-2xl flex flex-col justify-between hover:bg-slate-900/40 hover:border-slate-800 cursor-pointer transition-all"
                title="Double click to book focus period"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>{day}</span>
                  {items.length > 0 && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 mt-1 scrollbar-none">
                  {items.map((it) => (
                    <div 
                      key={it.id} 
                      className="bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-300 p-1 rounded-md leading-tight truncate select-text"
                    >
                      <span className="font-mono text-[8px] font-bold block">{it.startTime}</span>
                      {it.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WEEK VIEW TIMELINE */}
      {viewMode === 'week' && (
        <div className="bg-slate-900/10 p-4 rounded-3xl border border-white/5 space-y-3">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest italic text-center">Continuous Hour timeline spanning 7 active days. Select day to add slots.</p>
          <div className="grid grid-cols-7 gap-3">
            {[0, 1, 2, 3, 4, 5, 6].map(offset => {
              const d = new Date(currentDate);
              d.setDate(currentDate.getDate() - currentDate.getDay() + offset);
              const dateStr = d.toISOString().split('T')[0];
              const dayOfWeek = d.toLocaleDateString(undefined, { weekday: 'short' });
              const dateDigit = d.getDate();
              const items = calendarEvents.filter(e => e.date === dateStr);

              return (
                <div 
                  key={offset} 
                  onDoubleClick={() => {
                    setEventDate(dateStr);
                    setShowAddEvent(true);
                  }}
                  className="bg-slate-950/30 border border-white/5 p-3 rounded-2xl h-[340px] flex flex-col hover:border-indigo-500/20 cursor-pointer"
                >
                  <div className="text-center border-b border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">{dayOfWeek}</span>
                    <span className="text-sm font-bold text-white font-mono">{dateDigit}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1.5 select-text">
                    {items.length > 0 ? (
                      items.map(it => (
                        <div key={it.id} className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-cyan-500/10 p-2 rounded-xl text-[9px] text-slate-300 leading-normal">
                          <span className="font-mono text-[8px] text-cyan-400 block mb-0.5">{it.startTime} - {it.endTime}</span>
                          <strong>{it.title}</strong>
                        </div>
                      ))
                    ) : (
                      <span className="text-[8px] text-slate-600 block text-center mt-12 italic">Empty</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SINGLE DAY DETAILS VIEW */}
      {viewMode === 'day' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/10 p-6 rounded-3xl border border-white/5">
          {/* Hour slots details list */}
          <div className="md:col-span-8 space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-white/5">Event Schedule log for today:</h4>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto select-text">
              {calendarEvents.filter(e => e.date === currentDate.toISOString().split('T')[0]).length > 0 ? (
                calendarEvents
                  .filter(e => e.date === currentDate.toISOString().split('T')[0])
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(evt => (
                    <div key={evt.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
                          <Clock className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{evt.title}</h5>
                          <p className="text-[10px] text-slate-500 font-mono">{evt.startTime} - {evt.endTime}</p>
                        </div>
                      </div>
                      
                      <div className="px-2.5 py-1 rounded bg-slate-900 text-[9px] font-mono text-slate-400 uppercase">
                        Booked Block
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-16 text-xs text-slate-600 border border-dashed border-slate-800 rounded-2xl italic">
                  No focus periods scheduled or allocated for this date. Double click to add!
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-950/30 p-5 rounded-2xl border border-slate-900 h-max space-y-3">
            <h5 className="text-xs font-bold text-white flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Coach Advice</h5>
            <p className="text-[11px] text-slate-400 leading-normal font-light select-text">
              "Tomorrow holds multiple intense deadline objectives. I advise scheduling two 50-minute studying slots between 10 AM and 1 PM, right when your analytical energy level reaches maximum peak."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
