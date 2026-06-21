import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TreePine, 
  Trees, 
  Trash2, 
  Sprout, 
  HelpCircle
} from 'lucide-react';
import { PomodoroSession, TreeType } from '../types';
import { translations } from '../utils/translations';

interface FocusForestProps {
  completedSessions: PomodoroSession[];
  onClearForestData: () => void;
  lang: 'en' | 'ar';
  appTheme: 'dark' | 'light';
}

export default function FocusForest({
  completedSessions,
  onClearForestData,
  lang,
  appTheme
}: FocusForestProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [selectedCoordinates, setSelectedCoordinates] = useState<string | null>(null);

  // Filter completed sessions that have tree types
  const grownSessions = completedSessions.filter(s => s.completed);

  // Map session trees onto a 5x5 garden coordinate grid
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
      case 'pine': 
        return { 
          icon: '🌲', 
          name: lang === 'en' ? 'Majestic Pine' : 'صنوبر مهيب', 
          colorClass: 'text-emerald-400' 
        };
      case 'sakura': 
        return { 
          icon: '🌸', 
          name: lang === 'en' ? 'Cherry Sakura' : 'كرز الساكورا', 
          colorClass: 'text-pink-400 animate-pulse' 
        };
      case 'oak': 
        return { 
          icon: '🌳', 
          name: lang === 'en' ? 'Ancient Oak' : 'بلوط عتيق', 
          colorClass: 'text-green-500' 
        };
      case 'maple': 
        return { 
          icon: '🍁', 
          name: lang === 'en' ? 'Japanese Maple' : 'قيقب ياباني', 
          colorClass: 'text-orange-400' 
        };
      case 'golden': 
        return { 
          icon: '✨🌲', 
          name: lang === 'en' ? 'Golden Redwood' : 'سيكويا الذهبية', 
          colorClass: 'text-yellow-400 font-bold' 
        };
      default: 
        return { 
          icon: '🌱', 
          name: lang === 'en' ? 'Young Seed' : 'بذرة يافعة', 
          colorClass: 'text-teal-500' 
        };
    }
  };

  const getCapacityTier = (count: number) => {
    if (count >= 20) return lang === 'en' ? 'Ranger Master' : 'حارس الغابة الخبير';
    if (count >= 10) return lang === 'en' ? 'Orchard Groomer' : 'منسق البساتين';
    return lang === 'en' ? 'Seed Novice' : 'مبتدئ بذار';
  };

  const handleHarvestPress = () => {
    const promptMsg = lang === 'en' 
      ? 'Are you sure you want to harvest and clear your Focus Forest? This resets your tree coordinate grid.'
      : 'هل أنت متأكد من رغبتك في حصاد غابتك الكونية؟ سيؤدي ذلك لإعادة تهيئة شبكة الأشجار والبدء مجددًا.';
    if (window.confirm(promptMsg)) {
      onClearForestData();
    }
  };

  // Theme support styles
  const cardBgClass = appTheme === 'light' 
    ? 'bg-white border-slate-200 text-slate-800' 
    : 'bg-[#0b0f19]/60 border-white/5 text-slate-100';

  const widgetBgClass = appTheme === 'light' ? 'bg-slate-100/60 border-slate-200' : 'bg-slate-950/30 border-white/5';
  const textTitleClass = appTheme === 'light' ? 'text-slate-900' : 'text-white';
  const textMutedClass = appTheme === 'light' ? 'text-slate-500' : 'text-slate-400';

  return (
    <div id="forest-view-root" className="space-y-6 select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header and Statistics overview */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${cardBgClass}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-bold">
            <Trees className="w-4 h-4" /> 
            <span>{lang === 'en' ? 'Mind Forest Ecosystem' : 'باحة ونظام الغابة البيئي'}</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-extrabold ${textTitleClass}`}>
            {lang === 'en' ? 'Focus Forest Garden' : 'بستان غابة المذاكرة والتركيز'}
          </h2>
          <p className={`text-xs ${textMutedClass} font-light max-w-xl`}>
            {lang === 'en' 
              ? 'Physical visualization of your finished study sessions. Overcoming procrastination converts mental stamina into oxygen-producing mature species.'
              : 'تجسيد مرئي تفاعلي لساعات مذاكرتك الناجحة. يؤدي إكمال الدورة لغرس أشجار حية ترمز لإنجازاتك وتزيد غابتك بهاءً.'}
          </p>
        </div>

        {/* Clear block */}
        <button
          id="btn-clear-forest"
          onClick={handleHarvestPress}
          className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all text-rose-500 text-xs font-semibold flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Trash2 className="w-4 h-4" /> 
          <span>{lang === 'en' ? 'Harvest Forest' : 'حصاد وإعادة تهيئة الغابة'}</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-2xl text-center ${appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'}`}>
          <p className="text-[9px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Grown trees' : 'الأشجار المزروعة'}</p>
          <h4 className={`text-xl sm:text-2xl font-extrabold font-mono mt-1 ${textTitleClass}`}>
            {grownSessions.length} {lang === 'en' ? 'Sprouts' : 'شجرة'}
          </h4>
        </div>
        <div className={`p-4 border rounded-2xl text-center ${appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'}`}>
          <p className="text-[9px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Species variety' : 'التنوع النباتي'}</p>
          <h4 className="text-xl sm:text-2xl font-extrabold text-indigo-500 font-mono mt-1">
            {Array.from(new Set(grownSessions.map(s => s.treeType))).length} / 5
          </h4>
        </div>
        <div className={`p-4 border rounded-2xl text-center ${appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'}`}>
          <p className="text-[9px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Oxygen Output' : 'مستويات الأكسجين'}</p>
          <h4 className="text-xl sm:text-2xl font-extrabold text-emerald-500 font-mono mt-1">
            +{grownSessions.length * 15} L/hr
          </h4>
        </div>
        <div className={`p-4 border rounded-2xl text-center ${appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-slate-900'}`}>
          <p className="text-[9px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Capacity Level' : 'رتبة البستاني'}</p>
          <h4 className="text-sm font-extrabold text-purple-500 font-sans mt-2.5 truncate">
            {getCapacityTier(grownSessions.length)}
          </h4>
        </div>
      </div>

      {/* Main Grid map layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Landscape Garden Grid */}
        <div className={`p-5 sm:p-6 rounded-2xl border ${cardBgClass} lg:col-span-8 space-y-4`}>
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-mono text-slate-500 uppercase">{lang === 'en' ? 'Forest Grid Map (5x5)' : 'مخطط الغابة الشبكي (5x5)'}</span>
            <span className="text-[10px] text-emerald-500 font-mono font-bold">
              {grownSessions.length} / 25 {lang === 'en' ? 'occupied' : 'مسكونة بالكامل'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-xl mx-auto py-2">
            {gridCells.map((cell) => {
              const details = cell.session ? getTreeRenderDetails(cell.session.treeType) : null;
              const isSelected = selectedCoordinates === `c-${cell.row}-${cell.col}`;
              
              return (
                <div 
                  key={cell.index}
                  onClick={() => setSelectedCoordinates(`c-${cell.row}-${cell.col}`)}
                  className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300 border ${
                    isSelected 
                      ? 'bg-emerald-550/10 border-emerald-500 scale-105 shadow-md' 
                      : cell.session 
                        ? (appTheme === 'light' ? 'bg-slate-100 border-slate-250 hover:bg-slate-200' : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700') 
                        : (appTheme === 'light' ? 'bg-slate-50 border-slate-200 hover:border-slate-350' : 'bg-slate-950/40 border-slate-900 hover:border-slate-800')
                  }`}
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
                        <span className="text-2xl sm:text-3xl filter drop-shadow-md select-none">{details.icon}</span>
                      </motion.div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800 group-hover:scale-150 transition-all pointer-events-none" />
                    )}
                  </AnimatePresence>

                  <span className="absolute bottom-1 right-1.5 text-[6px] font-mono text-slate-400 select-none">
                    R{cell.row}C{cell.col}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspections Sidebar */}
        <div className={`p-5 rounded-2xl border ${cardBgClass} lg:col-span-4 space-y-5`}>
          <h3 className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 font-mono ${textTitleClass}`}>
            <Sprout className="w-4.5 h-4.5 text-emerald-500" /> 
            <span>{lang === 'en' ? 'Terrain Inspections' : 'فحص ركيزة المحصول'}</span>
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
                  <div className={`p-3 rounded-xl border text-xs ${
                    appTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 p-4 border-slate-900'
                  }`}>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">{lang === 'en' ? 'Position Sector' : 'إحداثيات الصخرة'}</p>
                    <h4 className={`text-xs font-bold leading-none mt-1.5 ${textTitleClass}`}>
                      {lang === 'en' ? 'Row:' : 'جفنة:'} {r} • {lang === 'en' ? 'Col:' : 'عمود:'} {c} ({lang === 'en' ? 'Index' : 'فهرست'}: {cellIdx})
                    </h4>
                  </div>

                  {targetCell?.session ? (
                    <div className="space-y-3 select-text">
                      <div className="text-center py-5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                        <span className="text-4xl block mb-2">{details?.icon}</span>
                        <h4 className={`text-xs font-extrabold ${details?.colorClass}`}>{details?.name}</h4>
                        <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
                          {lang === 'en' ? 'FULLY MATURED ECO-SPECIES' : 'شجرة مكتملة النمو من بومودورو'}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{lang === 'en' ? 'Planted On:' : 'تاريخ الغرس:'}</span>
                          <span className={`font-mono text-right ${textTitleClass}`}>
                            {new Date(targetCell.session.timestamp).toLocaleDateString(lang)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">{lang === 'en' ? 'Total Stamina:' : 'التركيز المكتمل:'}</span>
                          <span className={`font-mono ${textTitleClass}`}>{targetCell.session.durationMinutes} {lang === 'en' ? 'mins' : 'دقيقة'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-center text-xs text-slate-500 space-y-2">
                      <Sprout className="w-5 h-5 text-slate-400 mx-auto" />
                      <h5>{lang === 'en' ? 'Empty Soil Plot' : 'تفاصيل الخلية الدراسية'}</h5>
                      <p className="text-[9px] text-slate-400 leading-relaxed font-light">
                        {lang === 'en' 
                          ? 'This cell has no plants yet. Finish a Pomodoro session in the active timer tab to grow something beautiful here.' 
                          : 'لا توجد أشجار مزروعة هنا بعد. ستنمو شجرتك القادمة تلقائيًا في هذه الإحداثيات عند استكمال أي جلسة من مؤقت العمل.'}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })() : (
              <div className="text-center py-10 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-500 text-xs">
                {lang === 'en' 
                  ? 'Click on any slot coordinates in your Forest garden to inspect tree species, plant date, and parameters.' 
                  : 'انقر فوق أي خلية أو إحداثيات داخل البستان لمعاينة نوع الشجرة وطابعها الزمني.'}
              </div>
            )}
          </AnimatePresence>

          <div className={`p-4 border rounded-xl space-y-2 text-xs ${
            appTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/20 border-slate-900 text-slate-400'
          }`}>
            <h5 className={`font-bold flex items-center gap-1 ${textTitleClass}`}>
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> 
              <span>{lang === 'en' ? 'Forest Garden Rules' : 'قواعد وقوانين الطبيعة'}</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-[10px] font-light">
              <li>{lang === 'en' ? 'Finished focus timer cycles grow exactly ONE tree.' : 'كل دورة تركيز 25 دقيقة تنتج شجرة بستانية واحدة.'}</li>
              <li>{lang === 'en' ? 'You can tweak sprouter seed species in timer preferences.' : 'بإمكانك انتقاء نوع البذرة من لوحة إعدادات المؤقت.'}</li>
              <li>{lang === 'en' ? 'Trees propagate step-by-step from left to right.' : 'تمتد الأشجار في الشبكة تباعًا لتشكل حزامًا طبيعيًا جذابًا.'}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
