import { useState } from 'react';
import { 
  Database,
  BarChart,
  Grid,
  Download,
  Activity,
  Sparkles,
  Target,
  Clock
} from 'lucide-react';
import { PomodoroSession, Task } from '../types';
import { translations } from '../utils/translations';

interface AnalyticsTabProps {
  completedSessions: PomodoroSession[];
  tasks: Task[];
  focusScore: number;
  lang: 'en' | 'ar';
  appTheme: 'dark' | 'light';
}

export default function AnalyticsTab({
  completedSessions,
  tasks,
  focusScore,
  lang,
  appTheme
}: AnalyticsTabProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const totalSessions = completedSessions.length;
  const totalCompletedMinutes = completedSessions.reduce((sum, s) => sum + (s.completed ? s.durationMinutes : 0), 0);
  const averageSessionLength = totalSessions > 0 ? Math.round(totalCompletedMinutes / totalSessions) : 0;

  const getPeakFocusHour = () => {
    if (completedSessions.length === 0) {
      return lang === 'en' ? "8:00 PM - 10:00 PM" : "8:00 م - 10:00 م";
    }
    const hourCounts: Record<number, number> = {};
    completedSessions.forEach(s => {
      const hour = new Date(s.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let peakHour = 20; 
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hr, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hr);
      }
    });

    const formatHour = (h: number) => {
      if (lang === 'ar') {
        const suite = h >= 12 ? 'م' : 'ص';
        const formatted = h % 12 === 0 ? 12 : h % 12;
        return `${formatted} ${suite}`;
      } else {
        const suite = h >= 12 ? 'PM' : 'AM';
        const formatted = h % 12 === 0 ? 12 : h % 12;
        return `${formatted} ${suite}`;
      }
    };

    return `${formatHour(peakHour)} - ${formatHour((peakHour + 2) % 24)}`;
  };

  const handleExportCSVReport = () => {
    if (completedSessions.length === 0) {
      alert(lang === 'en' ? "Please complete focus sessions first to generate logs!" : "يرجى إكمال دورة تركيز واحدة أولاً لتوليد التقارير!");
      return;
    }

    const headers = ["Session ID", "Task ID", "Project ID", "Duration Minutes", "Date / Timestamp", "Interrupted Count", "Success Status"];
    const rows = completedSessions.map(s => [
      s.id,
      s.taskId || "None",
      s.projectId || "None",
      s.durationMinutes,
      s.timestamp,
      s.interruptedCount,
      s.completed ? "SUCCESS" : "INTERRUPTED"
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AI_PomoOS_FocusReport_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSONData = () => {
    const rawData = {
      pomoLogs: completedSessions,
      associatedTasks: tasks,
      metrics: {
        totalMinutes: totalCompletedMinutes,
        totalCycles: totalSessions,
        focusScore: focusScore,
        createdAt: new Date().toISOString()
      }
    };

    const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PomoOS_SyncBackup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const heatmapCells = Array.from({ length: 35 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - idx));
    const comparisonDateStr = d.toISOString().split('T')[0];
    
    const countSessionsSelected = completedSessions.filter(s => {
      const sessionDateStr = new Date(s.timestamp).toISOString().split('T')[0];
      return sessionDateStr === comparisonDateStr && s.completed;
    }).length;

    return {
      date: comparisonDateStr,
      count: countSessionsSelected,
      level: countSessionsSelected === 0 ? 0 : countSessionsSelected === 1 ? 1 : countSessionsSelected === 2 ? 2 : 3
    };
  });

  // Dynamic Theme Colors
  const cardBgClass = appTheme === 'light' 
    ? 'bg-white border-slate-200 text-slate-800 animate-fadeIn' 
    : 'bg-[#0b0f19]/60 border-white/5 text-slate-100 animate-fadeIn';

  const widgetBgClass = appTheme === 'light' ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/30 border-white/5';
  const textTitleClass = appTheme === 'light' ? 'text-slate-900' : 'text-white';
  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div id="analytics-view-panel" className="space-y-6 select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Top Banner Filter */}
      <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${cardBgClass}`}>
        <div className="space-y-1">
          <h2 className={`text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${textTitleClass}`}>
            <BarChart className="w-6 h-6 text-cyan-500" /> 
            <span>{lang === 'en' ? 'Core Focus Analytics' : 'تحليلات الأداء والتركيز'}</span>
          </h2>
          <p className={`text-xs ${textMutedClass} font-light`}>
            {lang === 'en' ? 'Track cognitive stamina, trace daily work trends, and export backup logs.' : 'تتبع القدرة الإدراكية، واستخلص عادات وساعات المذاكرة المفضلة لديك.'}
          </p>
        </div>

        {/* Action Export Button rows */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSVReport}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              appTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5'
            }`}
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-cyan-500" /> 
            <span>{lang === 'en' ? 'CSV Report' : 'تقرير Excel'}</span>
          </button>
          
          <button
            onClick={handleExportJSONData}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              appTheme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5'
            }`}
            title="Download JSON Database"
          >
            <Database className="w-3.5 h-3.5 text-indigo-550" /> 
            <span>{lang === 'en' ? 'JSON Sync' : 'نسخة احتياطية'}</span>
          </button>
        </div>
      </div>

      {/* Metrics bento row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Core total */}
        <div className={`p-4 border rounded-2xl ${
          appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'
        }`}>
          <p className="text-[10px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Total Hours Logged' : 'إجمالي ساعات التركيز'}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${textTitleClass}`}>
              {Math.round(totalCompletedMinutes / 60 * 10) / 10}
            </span>
            <span className="text-xs text-slate-500">{lang === 'en' ? 'hours' : 'ساعة'}</span>
          </div>
          <p className="text-[9px] text-slate-400 font-mono mt-1">
            {lang === 'en' ? 'From' : 'من خلال'} {totalSessions} {lang === 'en' ? 'seeds grown' : 'بذرة مزروعة'}
          </p>
        </div>

        {/* average block */}
        <div className={`p-4 border rounded-2xl ${
          appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'
        }`}>
          <p className="text-[10px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Avg Block Duration' : 'معدل طول الدورة الواحد'}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-500 font-mono">{averageSessionLength}</span>
            <span className="text-xs text-slate-500">{lang === 'en' ? 'mins' : 'دقيقة'}</span>
          </div>
          <p className="text-[9px] text-slate-400 font-mono mt-1">
            {lang === 'en' ? '25-min traditional standard' : 'مقارنة بمعيار 25 دقيقة التقليدي'}
          </p>
        </div>

        {/* peak hour */}
        <div className={`p-4 border rounded-2xl ${
          appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'
        }`}>
          <p className="text-[10px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Peak Focus Energy' : 'فترة النشاط والإنجاز القوى'}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm sm:text-base font-extrabold text-indigo-500 font-mono">{getPeakFocusHour()}</span>
          </div>
          <p className="text-[9px] text-slate-400 font-mono mt-1">
            {lang === 'en' ? 'Calculated dynamic high activity window' : 'تم احتسابها من واقع أوقات نقرات البدء'}
          </p>
        </div>

        {/* goal rates */}
        <div className={`p-4 border rounded-2xl ${
          appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'
        }`}>
          <p className="text-[10px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Syllabus Finish Rate' : 'معدل إنجاز المهام الكلية'}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
              {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
            </span>
          </div>
          <p className="text-[9px] text-slate-400 font-mono mt-1">
            {tasks.filter(t => t.completed).length} {lang === 'en' ? 'of' : 'من أصل'} {tasks.length} {lang === 'en' ? 'tasks done' : 'مهمة مضافة'}
          </p>
        </div>
      </div>

      {/* Focus Heatmap Contribution Grid */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${cardBgClass}`}>
        <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-500/10 flex-wrap gap-2">
          <div className="space-y-0.5">
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${textTitleClass}`}>
              <Grid className="w-4 h-4 text-emerald-500" /> 
              <span>{lang === 'en' ? 'Stamina Grid Activity' : 'شبكة معدل النشاط اليومي'}</span>
            </h3>
            <p className="text-[10px] text-slate-500">
              {lang === 'en' ? 'Hourly session frequency for the last 35 active calendar days.' : 'مستوى الكثافة الدراسية على مدار الـ 35 يومًا الماضية.'}
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono select-none">
            <span>{lang === 'en' ? 'Less' : 'أقل'}</span>
            <div className={`w-2 h-2 rounded ${appTheme === 'light' ? 'bg-slate-200' : 'bg-slate-950'}`} />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/15" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/40" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/70" />
            <div className="w-2.5 h-2.5 rounded bg-cyan-400" />
            <span>{lang === 'en' ? 'More' : 'أكثر'}</span>
          </div>
        </div>

        {/* Heatmap Layout with hover tools */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 py-4 justify-center">
          {heatmapCells.map((cell, idx) => {
            const levelClass = 
              cell.level === 0 ? (appTheme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-900') :
              cell.level === 1 ? 'bg-emerald-500/15 border-emerald-500/10 text-emerald-600' :
              cell.level === 2 ? 'bg-emerald-500/40 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
              'bg-[#06b6d4] border-[#22d3ee] text-white font-black';

            return (
              <div
                key={idx}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex flex-col justify-between items-center p-1 cursor-pointer transition-all hover:scale-110 relative group ${levelClass}`}
              >
                <span className="text-[7px] font-mono opacity-55 block leading-none">{cell.date.split('-')[2]}</span>
                <span className="text-[10px] font-bold font-mono leading-none">{cell.count}</span>

                {/* Grid Hover tooltip popup */}
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block rounded p-2 text-[9px] font-mono shadow-xl z-20 w-max pointer-events-none ${
                  appTheme === 'light' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white border border-slate-850'
                }`}>
                  <p className="font-bold text-cyan-400">{cell.date}</p>
                  <p>{cell.count} {lang === 'en' ? 'completed focus cycles' : 'دورات تركيز مكتملة'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Insights Sidebar layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
        <div className={`p-5 sm:p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${textTitleClass}`}>
            <Activity className="w-4.5 h-4.5 text-cyan-500" /> 
            <span>{lang === 'en' ? 'Flow Interruption Analysis' : 'مؤشر تشتيت الانتباه وعثرات التركيز'}</span>
          </h4>
          <p className={`text-xs ${textMutedClass} leading-relaxed font-light`}>
            {lang === 'en' 
              ? 'Pausing during focus blocks harms long-term memory formation. Seamless sessions yield a high dynamic score penalty offset calculation.' 
              : 'يسجل النظام عدد مرات المقاطعة أو النقر على الإيقاف المؤقت أثناء الجلسات. تجنب التوقف المتكرر يحافظ على كفاءة ذروتك الذهنية.'}
          </p>
          <div className={`p-4 rounded-xl border text-xs ${
            appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/30 border-slate-900'
          }`}>
            <div className="flex justify-between font-mono text-slate-500 border-b border-slate-500/10 pb-1.5">
              <span>{lang === 'en' ? 'Metric Category' : 'معيار القياس'}</span>
              <span className="text-right">{lang === 'en' ? 'Record value' : 'قيمة السجل الحالي'}</span>
            </div>
            <div className="flex justify-between pt-2.5">
              <span className="text-slate-500">{lang === 'en' ? 'Focus Pauses logged:' : 'إيقافات عشوائية مسجلة:'}</span>
              <span className={`font-mono text-right font-bold ${textTitleClass}`}>
                {completedSessions.reduce((sum, s) => sum + s.interruptedCount, 0)} {lang === 'en' ? 'pauses' : 'نقرة تشتيت'}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">{lang === 'en' ? 'Stamina Points penalty:' : 'عقوبة خفض النقاط:'}</span>
              <span className="font-mono text-rose-500 text-right font-bold">
                -{completedSessions.reduce((sum, s) => sum + s.interruptedCount, 0) * 2} pts
              </span>
            </div>
          </div>
        </div>

        <div className={`p-5 sm:p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1 text-indigo-500 ${textTitleClass}`}>
            <Sparkles className="w-4.5 h-4.5 animate-pulse" /> 
            <span>{lang === 'en' ? 'AI Coach Insights' : 'إرشادات مركز التدريب الذكي AI'}</span>
          </h4>
          <p className={`text-xs ${textMutedClass} leading-relaxed font-light`}>
            {lang === 'en' 
              ? 'Your focus levels are high in late afternoon, and research tasks have a 25% lower interruption rate than dry lecture reading blocks. Recommend allocating challenging syllabus materials during active evening energy zones.'
              : 'عاشق النجاح المبهر! تدل المؤشرات البيانية أن ذروة أدائك الدراسي تتصاعد نسبيًا في الساعات المتأخرة من اليوم. ننصحك بمعالجة الفصول الصعبة في ذلك الوقت.'}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-cyan-500 font-mono font-bold leading-none select-none">
            <Target className="w-4 h-4" /> 
            <span>{lang === 'en' ? 'Goal Recommendation: Evening peak allocation' : 'توصية الذكاء الاصطناعي: المذاكرة المسائية'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
