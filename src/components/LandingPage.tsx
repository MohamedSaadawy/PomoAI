import { motion } from 'motion/react';
import { 
  Zap, 
  Timer, 
  CheckSquare, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Layers, 
  TreePine, 
  HelpCircle,
  Languages,
  Sun,
  Moon
} from 'lucide-react';
import { translations, Dictionary } from '../utils/translations';

interface LandingPageProps {
  onLaunch: () => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  appTheme: 'dark' | 'light';
  setAppTheme: (theme: 'dark' | 'light') => void;
}

export default function LandingPage({ 
  onLaunch, 
  lang, 
  setLang, 
  appTheme, 
  setAppTheme 
}: LandingPageProps) {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const features = [
    {
      icon: Timer,
      title: lang === 'en' ? 'State-of-the-Art Timer' : 'مؤقت بومودورو متطور',
      desc: lang === 'en' 
        ? 'Smart 25/5 cycles with buzzer triggers, ambient natural sounds, and full-screen immersive deep study mode.'
        : 'دورات ذكية ٢٥-٥ دقيقة مع نغمات تنبيه هادئة، أصوات طبيعية مستمرة، وتحليلات مرئية فورية.',
      badge: lang === 'en' ? 'Advanced' : 'متقدم'
    },
    {
      icon: Sparkles,
      title: lang === 'en' ? 'Context-Aware AI Coach' : 'مدرب ذكي يعي بإنتاجيتك',
      desc: lang === 'en'
        ? 'An elite virtual companion that references your actual levels, tasks, focus history, and shapes structured syllabus tracks.'
        : 'مساعد ذكي يستوعب عدد ساعات تركيزك، مستوى خبرتك، والمهام المعلقة، ليصيغ لك أكثر الخطط ملائمة.',
      badge: lang === 'en' ? 'Intelligence' : 'الذكاء الاصطناعي'
    },
    {
      icon: TreePine,
      title: lang === 'en' ? 'Gamified Focus Forest' : 'غابة التركيز التفاعلية',
      desc: lang === 'en'
        ? 'Every session you lock in gardens a living organism. Grow pine, sakura, or golden trees to visualize your lifelong dedication.'
        : 'كل دورة تركيز تنجزها تبث الحياة في بذرة كشجرة صنوبر، ساكورا، أو شجرة ذهبية لترى ثمرة جهودك.',
      badge: lang === 'en' ? 'Gamified' : 'ألعاب تفاعلية'
    },
    {
      icon: CheckSquare,
      title: lang === 'en' ? 'Sunsama-Style Tasks' : 'إدارة ومخطط للمهام',
      desc: lang === 'en'
        ? 'Sub-task lists, priority flags, tag metrics, deadlines, and direct checklist breakdowns fueled by integrated AI workflows.'
        : 'قوائم مهام فرعية، تعيين مستويات الأولوية، وسوم ملونة، وتفكيك خطي فوري للمهام المعقدة بمساعدة الذكاء الاصطناعي.',
      badge: lang === 'en' ? 'Productivity' : 'الإنتاجية'
    },
    {
      icon: TrendingUp,
      title: lang === 'en' ? 'Focus Score Index' : 'مؤشر معدل التركيز اللحظي',
      desc: lang === 'en'
        ? 'Compute a precise 0-100 score analyzing timer pauses, completion rate benchmarks, streak behaviors, and target goals.'
        : 'مؤشر دقيق من ٠-١٠٠ يحلل نسبة المقاطعات وإيقاف المؤقت، وتيرة الاستمرارية، ونسب إنجاز المهام اليومية.',
      badge: lang === 'en' ? 'Analytics' : 'التحليلات'
    },
    {
      icon: Layers,
      title: lang === 'en' ? 'Structured Projects' : 'تنظيم وتصنيف المشاريع',
      desc: lang === 'en'
        ? 'Track specialized domains (Medical, Code, Creative) with dynamic individual progress bars and aggregated domain statistics.'
        : 'قسّم مهامك وساعاتك على مجالات مخصصة (الطب، البرمجة، الرياضة) مع مؤشرات تتبع تقدم كل تخصص على حدة.',
      badge: lang === 'en' ? 'Organization' : 'التنظيم'
    },
  ];

  const faqs = [
    {
      q: lang === 'en' ? 'How does the AI Coach understand my focus habits?' : 'كيف يفهم المدرب الذكي عاداتي الدراسية؟',
      a: lang === 'en'
        ? 'The server-side coach reads your actual local stats—completed focus sessions, current tasks, active streak, and XP parameters. It gives customized, actionable behavioral recommendations based on when you are most productive.'
        : 'يقرأ نظام التدريب الذكي إحصائياتك المحلية مباشرة وجلسات تركيزك المنجزة وسلسلة أيامك. يحلل وتيرة عملك ليقدم لك جدولاً ملائماً ويقترح تصفية وترتيب مهامك بناء على ذلك.'
    },
    {
      q: lang === 'en' ? 'Will my study forest persist if I close the app?' : 'هل يتم حفظ الغابة والإحصائيات إذا أغلقت المتصفح؟',
      a: lang === 'en'
        ? 'Yes, your focus hours, achievements, current streak, tasks, projects, and growing forest are persistently archived in your browser’s localStorage engine.'
        : 'نعم، يتم تخزين كافة البيانات كفترات الدراسة المحققة، إحصائيات الغابة، سلسلة الأيام المتواصلة والمهام بشكل تلقائي وآمن في متصفحك المحلي.'
    }
  ];

  const themeBgClass = appTheme === 'light' 
    ? 'bg-slate-50 text-slate-800' 
    : 'bg-[#070a13] text-slate-100';

  const headerBorders = appTheme === 'light' ? 'border-slate-200' : 'border-white/5';

  return (
    <div id="landing-container" className={`min-h-screen ${themeBgClass} overflow-x-hidden selection:bg-cyan-500 selection:text-white transition-colors duration-200`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Ambient Glows */}
      {appTheme === 'dark' && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
          <div className="absolute top-[30%] right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        </>
      )}

      {/* Navigation Header */}
      <header id="landing-header" className={`max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b ${headerBorders} relative z-10 backdrop-blur-md bg-transparent`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              {t.logoText}
            </h1>
            <p className="text-[9px] font-mono opacity-60 uppercase tracking-widest">{t.pomoOsTag}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme switcher */}
          <button
            onClick={() => setAppTheme(appTheme === 'light' ? 'dark' : 'light')}
            className={`p-2 rounded-xl border ${appTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900 border-white/5 text-slate-300'} hover:scale-105 transition-all cursor-pointer`}
            title={t.activeMode}
          >
            {appTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Lang Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium flex items-center gap-1.5 ${appTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900 border-white/5 text-slate-300'} hover:scale-105 transition-all cursor-pointer`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Launch workspace */}
          <button 
            id="btn-nav-launch"
            onClick={onLaunch}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90 shadow-md hover:shadow-cyan-500/10 active:scale-95 transition-all group cursor-pointer"
          >
            <span>{t.enterWorkspace}</span>
            <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-8 backdrop-blur-sm border ${appTheme === 'light' ? 'bg-slate-200/50 border-slate-300 text-slate-700' : 'bg-white/5 border-white/10 text-cyan-300'}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          {lang === 'en' ? 'Beautiful & Immersive Operating Space' : 'فضاء عمل محفز وجميل للتركيز العميق'}
        </motion.div>
 
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]"
        >
          {lang === 'en' ? 'Submerge in Flow State' : 'انغمس تمامًا في ذروة تركيزك'}<br />
          <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
            {lang === 'en' ? 'Unshuffled Focus Engine' : 'بتوجيه ذكي من رفيقك الدراسي'}
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-sm sm:text-base max-w-2xl mx-auto mb-10 font-light leading-relaxed ${appTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
        >
          {t.landingDesc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            id="btn-hero-launch"
            onClick={onLaunch}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-95 shadow-lg shadow-cyan-500/10 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{t.enterWorkspace}</span>
            <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
        </motion.div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className={`max-w-7xl mx-auto px-6 py-16 border-t ${headerBorders} relative z-10`}>
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-2">
            {lang === 'en' ? 'Productivity Modules' : 'مواصفات الفضاء الإنتاجي'}
          </p>
          <h3 className="text-2xl font-bold">{lang === 'en' ? 'Crafted for Maximum Academic Calibre' : 'نظام متكامل مصمم للإنجاز الأكاديمي'}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`p-6 rounded-2xl border transition-all ${
                  appTheme === 'light' 
                    ? 'bg-white border-slate-200 text-slate-800 hover:shadow-md' 
                    : 'bg-[#0b0f19]/70 border-white/5 text-slate-100 hover:bg-[#0c1222] hover:border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${appTheme === 'light' ? 'bg-slate-100 text-cyan-600' : 'bg-white/5 text-cyan-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} px-2 py-0.5 rounded text-[8px] font-mono leading-none tracking-wider uppercase ${appTheme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-500'}`}>
                  {f.badge}
                </div>
                <h4 className="text-sm font-bold mb-1.5">{f.title}</h4>
                <p className={`text-xs leading-relaxed font-light ${appTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Accordion FAQ */}
      <section id="faq" className={`max-w-4xl mx-auto px-6 py-16 border-t ${headerBorders} relative z-10`}>
        <div className="text-center mb-10">
          <h3 className="text-xl font-bold">{lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}</h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-2xl border ${
                appTheme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b0f19]/40 border-white/5'
              }`}
            >
              <h5 className="font-bold text-xs mb-2">{faq.q}</h5>
              <p className={`text-xs leading-relaxed font-light ${appTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer" className={`py-10 text-slate-500 border-t ${headerBorders} ${appTheme === 'light' ? 'bg-white' : 'bg-[#04060b]'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-cyan-500" />
            <span className="font-mono tracking-wider">{lang === 'en' ? 'FOCUS RUN SYSTEM' : 'نظام فوكس رَن المتكامل'}</span>
          </div>
          <p className="text-[10px] font-mono">
            &copy; 2026 Focus Run. {lang === 'en' ? 'All capabilities active.' : 'جميع الخصائص والميزات فعالة.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
