import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  BookOpen, 
  Calendar,
  Zap
} from 'lucide-react';
import { Task, Project, CalendarEvent } from '../types';
import { translations } from '../utils/translations';

interface CalendarTabProps {
  tasks: Task[];
  projects: Project[];
  calendarEvents: CalendarEvent[];
  onAddCalendarEvent: (evt: Omit<CalendarEvent, 'id'>) => void;
  lang: 'en' | 'ar';
  appTheme: 'dark' | 'light';
}

export default function CalendarTab({
  tasks,
  projects,
  calendarEvents,
  onAddCalendarEvent,
  lang,
  appTheme
}: CalendarTabProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

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

  // Month Names Translation Dictionary
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesAr = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  const monthNames = lang === 'en' ? monthNamesEn : monthNamesAr;

  const weekdaysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdaysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const weekdays = lang === 'en' ? weekdaysEn : weekdaysAr;
  
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonthIdx = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysCount = getDaysInMonth(currentYear, currentMonthIdx);
  const startOffset = getFirstDayOfMonthIdx(currentYear, currentMonthIdx);

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysCount; i++) {
    daysArray.push(i);
  }

  const formatDateString = (year: number, monthIdx: number, dayNum: number) => {
    const mStr = (monthIdx + 1).toString().padStart(2, '0');
    const dStr = dayNum.toString().padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  // Styling presets with respect to theme
  const cardBgClass = appTheme === 'light' 
    ? 'bg-white border-slate-200 text-slate-800' 
    : 'bg-[#0b0f19]/60 border-white/5 text-slate-100';

  const widgetBgClass = appTheme === 'light' ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/30 border-white/5';
  const textTitleClass = appTheme === 'light' ? 'text-slate-900' : 'text-white';
  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div id="calendar-view-panel" className="space-y-6 select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Header Selector Row */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${cardBgClass}`}>
        <div className="space-y-1">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${textTitleClass}`}>
            <CalendarDays className="w-6 h-6 text-cyan-500" />
            <span>{lang === 'en' ? 'Study Scheduler & Calendar' : 'مخطط وجدول المذاكرة'}</span>
          </h2>
          <p className={`text-xs ${textMutedClass} font-light`}>
            {lang === 'en' ? 'Visual representation of scheduled focus slots, deadlines, and milestones.' : 'منظور بصري زمني لجلسات المذاكرة المجدولة ومهام التسليم المقررة.'}
          </p>
        </div>

        {/* View Mode Pills */}
        <div className={`p-1 rounded-xl flex items-center gap-1 ${appTheme === 'light' ? 'bg-slate-100' : 'bg-slate-950'}`}>
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v as any)}
              className={`px-3 py-1.5 text-[9px] uppercase font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                viewMode === v ? 'bg-cyan-500 text-white font-extrabold' : 'text-slate-500 hover:text-cyan-500'
              }`}
            >
              {v === 'month' ? (lang === 'en' ? 'Month' : 'شهر') : v === 'week' ? (lang === 'en' ? 'Week' : 'أسبوع') : (lang === 'en' ? 'Day' : 'يوم')}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation and Actions */}
      <div className={`p-4 rounded-xl border flex justify-between items-center ${
        appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <button 
              onClick={handlePrevRange}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                appTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-350'
              }`}
            >
              <ChevronLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180': ''}`} />
            </button>
            <button 
              onClick={handleNextRange}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                appTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-350'
              }`}
            >
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180': ''}`} />
            </button>
          </div>

          <h3 className={`text-xs sm:text-sm font-bold font-mono ${textTitleClass}`}>
            {viewMode === 'month' && `${monthNames[currentMonthIdx]} ${currentYear}`}
            {viewMode === 'week' && `${lang === 'en' ? 'Week of' : 'أسبوع'} ${currentDate.toLocaleDateString(lang)}`}
            {viewMode === 'day' && currentDate.toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>

        <button
          onClick={() => {
            setEventDate(new Date().toISOString().split('T')[0]);
            setShowAddEvent(true);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            appTheme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" /> 
          <span>{lang === 'en' ? 'Book event' : 'جدولة موعد'}</span>
        </button>
      </div>

      {/* Booking Form Overlay */}
      {showAddEvent && (
        <div className={`p-5 rounded-2xl border ${
          appTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        } space-y-4 shadow-lg`}>
          <h4 className={`text-xs font-bold font-mono uppercase flex items-center gap-1.5 ${textTitleClass}`}>
            <BookOpen className="w-4 h-4 text-indigo-500" /> 
            <span>{lang === 'en' ? 'Schedule study event block' : 'حجز فترة تركيز وجدولة موعد في التقييم'}</span>
          </h4>
          <form onSubmit={handleCreateEventSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Event Title' : 'عنوان الموعد'}</label>
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Study cardiology chapter" : "اكتب عنوان الفترة المجدولة"}
                value={eventTitle} 
                onChange={(e) => setEventTitle(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-xs bg-transparent outline-none focus:border-cyan-500 ${
                  appTheme === 'light' ? 'border-slate-250 text-slate-800' : 'border-slate-800 text-slate-200'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Relate with active task' : 'ربطها بمهمة حالية'}</label>
              <select
                value={associatedTaskId}
                onChange={(e) => setAssociatedTaskId(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-xs bg-transparent outline-none ${
                  appTheme === 'light' ? 'border-slate-250 text-slate-700' : 'border-slate-800 text-slate-300'
                }`}
              >
                <option value="">{lang === 'en' ? 'None Select' : 'مستقلة (دون ربط)'}</option>
                {tasks.map(tTask => (
                  <option key={tTask.id} value={tTask.id}>{tTask.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Date' : 'تاريخ الموعد'}</label>
                <input 
                  type="date" 
                  value={eventDate} 
                  onChange={(e) => setEventDate(e.target.value)}
                  className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                    appTheme === 'light' ? 'border-slate-250 text-slate-700' : 'border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'Start hour' : 'ساعة البدء'}</label>
                <input 
                  type="time" 
                  value={eventStartTime} 
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                    appTheme === 'light' ? 'border-slate-250 text-slate-700' : 'border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-slate-500 uppercase block">{lang === 'en' ? 'End hour' : 'ساعة الانتهاء'}</label>
                <input 
                  type="time" 
                  value={eventEndTime} 
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className={`w-full border rounded-lg p-2 text-xs bg-transparent ${
                    appTheme === 'light' ? 'border-slate-250 text-slate-700' : 'border-slate-800 text-slate-200'
                  }`}
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddEvent(false)}
                className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:underline ${textMutedClass}`}
              >
                {lang === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors leading-none"
              >
                {lang === 'en' ? 'Confirm Slot' : 'تأكيد الحجز والجدولة'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid Render container */}
      {viewMode === 'month' && (
        <div className={`border p-4 rounded-2xl ${cardBgClass}`}>
          {/* Days labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] uppercase text-slate-500 pb-2 border-b border-slate-500/10">
            {weekdays.map((d, index) => (
              <div key={index}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-3">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-16 opacity-0" />;
              }

              const targetStr = formatDateString(currentYear, currentMonthIdx, day);
              const dayEvents = calendarEvents.filter(e => e.date === targetStr);

              return (
                <div 
                  key={`day-${day}`}
                  className={`h-16 p-1.5 border rounded-xl flex flex-col justify-between align-top overflow-hidden transition-all ${
                    dayEvents.length > 0
                      ? 'bg-cyan-500/5 border-cyan-500/25'
                      : (appTheme === 'light' ? 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/50' : 'bg-[#05080f]/40 border-white/5 hover:bg-slate-900/30')
                  }`}
                >
                  <span className={`text-[10px] font-bold font-mono block ${textTitleClass}`}>{day}</span>
                  
                  {dayEvents.length > 0 && (
                    <div className="space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 2).map((e) => (
                        <div key={e.id} className="bg-cyan-500 text-[8px] text-white font-semibold flex items-center gap-1 leading-none rounded-sm p-0.5 truncate leading-none">
                          <Clock className="w-2 h-2 shrink-0" />
                          <span>{e.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode !== 'month' && (
        <div className={`p-4 rounded-xl text-center text-xs space-y-4 border ${cardBgClass}`}>
          <Calendar className="w-8 h-8 text-indigo-400 mx-auto" />
          <h4 className={textTitleClass}>{lang === 'en' ? 'Interactive view active' : 'عرض مخصص تفاعلي'}</h4>
          <p className={`${textMutedClass} max-w-sm mx-auto font-light`}>
            {lang === 'en' ? 'Dynamic agenda active:' : 'تم تفعيل أجندة المهام:'} {calendarEvents.length} {lang === 'en' ? 'total schedule clocks matched.' : 'مواعيد إجمالية مسجلة.'}
          </p>
          <div className="space-y-2.5 max-w-md mx-auto">
            {calendarEvents.map((e) => (
              <div key={e.id} className={`p-3 border rounded-xl flex justify-between items-center text-left ${
                appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
              }`} dir={isRtl ? 'rtl' : 'ltr'}>
                <div>
                  <h5 className={`font-bold text-xs ${textTitleClass}`}>{e.title}</h5>
                  <span className="text-[10px] font-mono text-slate-500">{e.date} @ {e.startTime} - {e.endTime}</span>
                </div>
                <div className="flex items-center gap-1 bg-cyan-500/10 text-cyan-500 text-[8px] font-bold uppercase tracking-wider font-mono px-1.5 py-0.5 rounded leading-none shrink-0 border border-cyan-500/20">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{lang === 'en' ? 'Scheduled' : 'مُجدوَل'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
