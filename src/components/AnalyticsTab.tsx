import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Activity, 
  Grid, 
  Download, 
  ChevronRight,
  Database,
  BarChart,
  Target,
  Sparkles
} from 'lucide-react';
import { PomodoroSession, Task } from '../types';

interface AnalyticsTabProps {
  completedSessions: PomodoroSession[];
  tasks: Task[];
  focusScore: number;
}

export default function AnalyticsTab({
  completedSessions,
  tasks,
  focusScore,
}: AnalyticsTabProps) {
  const [activeRange, setActiveRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Parse analytics parameters
  const totalSessions = completedSessions.length;
  const totalCompletedMinutes = completedSessions.reduce((sum, s) => sum + (s.completed ? s.durationMinutes : 0), 0);
  const averageSessionLength = totalSessions > 0 ? Math.round(totalCompletedMinutes / totalSessions) : 0;

  // Most productive hour analysis (simulate based on timestamps or default)
  const getPeakFocusHour = () => {
    if (completedSessions.length === 0) return "8:00 PM - 10:00 PM";
    // Tally based on session timestamps
    const hourCounts: Record<number, number> = {};
    completedSessions.forEach(s => {
      const hour = new Date(s.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let peakHour = 20; // default 8pm
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hr, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hr);
      }
    });

    const formatHour = (h: number) => {
      const suite = h >= 12 ? 'PM' : 'AM';
      const formatted = h % 12 === 0 ? 12 : h % 12;
      return `${formatted} ${suite}`;
    };

    return `${formatHour(peakHour)} - ${formatHour((peakHour + 2) % 24)}`;
  };

  // CSV Report exporter helper
  const handleExportCSVReport = () => {
    if (completedSessions.length === 0) {
      alert("No focus logs found! Plant some seeds or complete timers to generate a CSV report.");
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
    
    // Auto-download behavior
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AI_PomoOS_FocusReport_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON raw database
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

  // Process Heatmap Grid blocks (simulated contribution blocks for last 30 days)
  const heatmapCells = Array.from({ length: 35 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - idx));
    const comparisonDateStr = d.toISOString().split('T')[0];
    
    // Find sessions completed on this comparison date
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

  return (
    <div id="analytics-view-panel" className="space-y-6 select-none">
      
      {/* Top Banner Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-6 rounded-3xl border border-white/5">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart className="w-5 h-5 text-cyan-400" /> Operational Analytical metrics
          </h2>
          <p className="text-xs text-slate-400 font-light">Inspect deep focus ratios, peak working timelines, and export complete reports.</p>
        </div>

        {/* Action Export Button rows */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSVReport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" /> CSV Report
          </button>
          
          <button
            onClick={handleExportJSONData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            title="Download JSON Database"
          >
            <Database className="w-3.5 h-3.5" /> JSON Backup
          </button>
        </div>
      </div>

      {/* Metrics bento row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Core total */}
        <div className="p-5 bg-slate-950/20 border border-slate-900 rounded-2xl space-y-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Focus Hours Logged</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white font-mono">{Math.round(totalCompletedMinutes / 60 * 10) / 10}</span>
            <span className="text-xs text-slate-400">hours</span>
          </div>
          <p className="text-[9px] text-slate-500 font-mono">From {totalSessions} completed seeds</p>
        </div>

        {/* average block */}
        <div className="p-5 bg-slate-950/20 border border-slate-900 rounded-2xl space-y-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Average Session length</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">{averageSessionLength}</span>
            <span className="text-xs text-slate-400">minutes</span>
          </div>
          <p className="text-[9px] text-slate-500 font-mono">25-minute standard preset</p>
        </div>

        {/* peak hour */}
        <div className="p-5 bg-slate-950/20 border border-slate-900 rounded-2xl space-y-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Peak Focus Activity</p>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-indigo-300 font-mono">{getPeakFocusHour()}</span>
          </div>
          <p className="text-[9px] text-slate-500 font-mono">High cognitive energy window</p>
        </div>

        {/* goal rates */}
        <div className="p-5 bg-slate-950/20 border border-slate-900 rounded-2xl space-y-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Task Completion Ratio</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
            </span>
          </div>
          <p className="text-[9px] text-slate-500 font-mono">{tasks.filter(t => t.completed).length} of {tasks.length} tasks clear</p>
        </div>
      </div>

      {/* Focus Heatmap Contribution Grid */}
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-4 select-text">
        <div className="flex justify-between items-center pb-2 border-b border-slate-900">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-emerald-400" /> Focus Heatmap Activity
            </h3>
            <p className="text-[10px] text-slate-500">Hourly session frequency for the last 35 active calendar days.</p>
          </div>
          
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded bg-slate-950 border border-white/5" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/10" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/30" />
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/60" />
            <div className="w-2.5 h-2.5 rounded bg-cyan-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Layout */}
        <div className="flex flex-wrap gap-2 py-4 justify-center">
          {heatmapCells.map((cell, idx) => {
            const levelClass = 
              cell.level === 0 ? 'bg-slate-950/60 border-slate-900' :
              cell.level === 1 ? 'bg-emerald-500/15 border-emerald-500/10' :
              cell.level === 2 ? 'bg-emerald-500/40 border-emerald-500/20' :
              'bg-cyan-500/90 border-cyan-400 text-slate-950';

            return (
              <div
                key={idx}
                className={`w-10 h-10 rounded-xl border flex flex-col justify-between items-center p-1 cursor-pointer transition-all hover:scale-110 relative group ${levelClass}`}
              >
                <span className="text-[7px] font-mono opacity-50 block leading-none">{cell.date.split('-')[2]}</span>
                <span className="text-[10px] font-bold font-mono leading-none">{cell.count}</span>

                {/* Grid Hover tooltip popup */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white border border-slate-800 rounded p-2 text-[9px] font-mono shadow-2xl z-20 w-max pointer-events-none">
                  <p className="font-bold text-cyan-400">{cell.date}</p>
                  <p>{cell.count} completed focus sessions</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Insights Sidebar layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Activity className="w-4.5 h-4.5 text-cyan-400" /> Flow interruption analysis
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            We track manual timer pauses. Every time you pause during an active session, as opposed to letting the timer countdown seamlessly, it counts as an interruption metric. Pauses reduce your overall focus score.
          </p>
          <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-900 text-xs">
            <div className="flex justify-between font-mono text-slate-400 border-b border-white/5 pb-2">
              <span>Metric Type</span>
              <span className="text-right">Today Count</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Active Timer Pauses logged:</span>
              <span className="font-mono text-white text-right">
                {completedSessions.reduce((sum, s) => sum + s.interruptedCount, 0)} pauses
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Deduction penalty:</span>
              <span className="font-mono text-rose-400 text-right">
                -{completedSessions.reduce((sum, s) => sum + s.interruptedCount, 0) * 2} pts
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 text-purple-400">
            <Sparkles className="w-4.5 h-4.5" /> Core behavioral summary
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            "Your attention pacing spikes significantly towards the late evening. However, Gym & Health study blocks are paused 40% more than Programming sessions. I advise starting Gym blocks at 2 PM when your cognitive load stabilizes."
          </p>
          <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono font-bold">
            <Target className="w-4 h-4" /> Recommended focus offset: afternoon shift
          </div>
        </div>
      </div>
    </div>
  );
}
