import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TreePine, 
  Trees, 
  Trash2, 
  Sparkles, 
  Heart, 
  Flame, 
  Sprout, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { PomodoroSession, TreeType } from '../types';

interface FocusForestProps {
  completedSessions: PomodoroSession[];
  onClearForestData: () => void;
}

export default function FocusForest({
  completedSessions,
  onClearForestData,
}: FocusForestProps) {
  const [selectedCoordinates, setSelectedCoordinates] = useState<string | null>(null);

  // Filter completed sessions that have tree types
  const grownSessions = completedSessions.filter(s => s.completed);

  // Map session trees onto a 5x5 garden coordinate grid
  // Grid coordinates range from row 0-4, col 0-4 (25 cells)
  const gridCells = Array.from({ length: 25 }, (_, idx) => {
    const row = Math.floor(idx / 5);
    const col = idx % 5;
    const sessionForCell = grownSessions[idx]; // map 1-to-1 sequential based on completed runs

    return {
      index: idx,
      row,
      col,
      session: sessionForCell || null
    };
  });

  // Get tree icon helper
  const getTreeRenderDetails = (type?: TreeType) => {
    switch (type) {
      case 'pine': return { icon: '🌲', name: 'Majestic Pine', colorClass: 'text-emerald-400' };
      case 'sakura': return { icon: '🌸', name: 'Cherry Sakura', colorClass: 'text-pink-400 animate-pulse' };
      case 'oak': return { icon: '🌳', name: 'Ancient Oak', colorClass: 'text-green-500' };
      case 'maple': return { icon: '🍁', name: 'Japanese Maple', colorClass: 'text-orange-400' };
      case 'golden': return { icon: '✨🌲', name: 'Golden Redwood', colorClass: 'text-yellow-400 font-bold' };
      default: return { icon: '🌱', name: 'Young Seed', colorClass: 'text-teal-500' };
    }
  };

  return (
    <div id="forest-view-root" className="space-y-6 select-none">
      
      {/* Header and Statistics overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
            <Trees className="w-4 h-4" /> Living Cognitive Ecosystem
          </div>
          <h2 className="text-2xl font-extrabold font-sans text-white tracking-tight">Focus Forest Garden</h2>
          <p className="text-xs text-slate-400 font-light max-w-xl">
            This is the physical visualization of your completed study hours. Every 25-minute Pomodoro period grows a mature seed, converting attention energy into oxygen-producing trees.
          </p>
        </div>

        {/* Clear block */}
        <button
          id="btn-clear-forest"
          onClick={() => {
            if (confirm("Are you sure you want to harvest and clear your Focus Forest? This action resets your tree coordinates list.")) {
              onClearForestData();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all text-rose-400 hover:text-white text-xs font-semibold flex items-center gap-2 group cursor-pointer active:scale-95 shrink-0"
        >
          <Trash2 className="w-4 h-4" /> Reset Garden Terrain
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/20 border border-slate-900 p-4 rounded-2xl text-center">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Grown Sprouted Trees</p>
          <h4 className="text-2xl font-extrabold text-white font-mono mt-1">{grownSessions.length} Species</h4>
        </div>
        <div className="bg-slate-950/20 border border-slate-900 p-4 rounded-2xl text-center">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Sprouted Species Variety</p>
          <h4 className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
            {Array.from(new Set(grownSessions.map(s => s.treeType))).length} of 5
          </h4>
        </div>
        <div className="bg-slate-950/20 border border-slate-900 p-4 rounded-2xl text-center">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Ecosystem Oxygen Level</p>
          <h4 className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">+{grownSessions.length * 15} L/hr</h4>
        </div>
        <div className="bg-slate-950/20 border border-slate-900 p-4 rounded-2xl text-center">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Ecosystem Capacity Tier</p>
          <h4 className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
            {grownSessions.length >= 20 ? 'Ranger Master' : grownSessions.length >= 10 ? 'Orchard Groomer' : 'Seed Novice'}
          </h4>
        </div>
      </div>

      {/* Main Grid map layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Landscape Garden Coordinate Canvas */}
        <div className="lg:col-span-8 bg-slate-900/10 p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Forest Matrix: 5x5 Grid</span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">Ready to plant seed: {grownSessions.length}/25 slots occupied</span>
          </div>

          <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto py-2">
            {gridCells.map((cell) => {
              const details = cell.session ? getTreeRenderDetails(cell.session.treeType) : null;
              const isSelected = selectedCoordinates === `c-${cell.row}-${cell.col}`;
              
              return (
                <div 
                  key={cell.index}
                  onClick={() => {
                    setSelectedCoordinates(`c-${cell.row}-${cell.col}`);
                  }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300 border ${isSelected ? 'bg-emerald-500/10 border-emerald-500/60 scale-105 shadow-lg shadow-emerald-500/10' : cell.session ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700' : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'}`}
                >
                  <AnimatePresence mode="wait">
                    {details ? (
                      <motion.div
                        initial={{ scale: 0.1, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="text-center"
                      >
                        <span className="text-3xl filter drop-shadow-md select-none">{details.icon}</span>
                      </motion.div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:scale-150 transition-transform" />
                    )}
                  </AnimatePresence>

                  {/* Tiny coordinate overlay */}
                  <span className="absolute bottom-1 right-1.5 text-[7px] font-mono text-slate-700">R{cell.row}C{cell.col}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected tree/coordinate details inspect sidebar card */}
        <div className="lg:col-span-4 bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
            <Sprout className="w-4.5 h-4.5 text-emerald-400" /> Terrain Inspection
          </h3>

          <AnimatePresence mode="wait">
            {selectedCoordinates ? (() => {
              const [_, r, c] = selectedCoordinates.split('-');
              const cellIdx = parseInt(r) * 5 + parseInt(c);
              const targetCell = gridCells[cellIdx];
              const details = targetCell?.session ? getTreeRenderDetails(targetCell.session.treeType) : null;

              return (
                <motion.div
                  key={selectedCoordinates}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-900 text-xs">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Selected Slot coordinates</p>
                    <h4 className="text-sm font-bold text-slate-200 mt-1">Row {r} • Column {c} (Index: {cellIdx})</h4>
                  </div>

                  {targetCell?.session ? (
                    <div className="space-y-4 select-text">
                      <div className="text-center py-6 bg-slate-900/60 rounded-2xl border border-white/5">
                        <span className="text-5xl block mb-2">{details?.icon}</span>
                        <h4 className={`text-sm font-extrabold ${details?.colorClass}`}>{details?.name}</h4>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">GROWN FROM 25m POMODORO</p>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Plant Timestamp:</span>
                          <span className="font-mono text-neutral-400">
                            {new Date(targetCell.session.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phase Condition:</span>
                          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Fully Grown</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Focus Session Duration:</span>
                          <span className="font-mono">{targetCell.session.durationMinutes} minutes</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                      <Sprout className="w-6 h-6 text-slate-700 mx-auto" />
                      <h5>Empty Garden Cell</h5>
                      <p className="text-[10px] text-slate-600 font-light leading-relaxed">
                        There is no active tree planted in this grid slot index. Complete a Pomodoro session in the timer workspace to sprout a mature organism and watch it propagate.
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })() : (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                Tap on any coordinate cell in the garden matrix to inspect planting details, custom stamps, or growth specifications.
              </div>
            )}
          </AnimatePresence>

          <div className="bg-slate-950/20 p-4 border border-slate-900 rounded-xl space-y-2 text-xs text-slate-400">
            <h5 className="font-bold text-slate-200 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Forest Rules</h5>
            <ol className="list-decimal list-inside space-y-1 text-[10px] font-light">
              <li>Each finished Pomodoro block grows exactly ONE tree.</li>
              <li>You can select custom tree types (Sakura, Pinus, Quercus, etc.) in timer settings beforehand.</li>
              <li>Trees populate coordinates sequentially from cell index 0 to 24.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
