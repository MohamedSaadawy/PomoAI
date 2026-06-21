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
  ShieldCheck, 
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const features = [
    {
      icon: Timer,
      title: 'State-of-the-Art Timer',
      desc: 'Smart 25/5 cycles with configurable triggers, ambient wind sounds, browser notifications, and full-screen deep absorption mode.',
      badge: 'Advanced'
    },
    {
      icon: Sparkles,
      title: 'Context-Aware AI Coach',
      desc: 'An elite virtual companion that references your actual levels, tasks, focus history, and constructs dynamic study syllabus tracks.',
      badge: 'Intelligence'
    },
    {
      icon: TreePine,
      title: 'Gamified Focus Forest',
      desc: 'Every session you lock in gardens a living organism. Grow pine, sakura, or golden trees to visualize your lifelong dedication.',
      badge: 'Inspirational'
    },
    {
      icon: CheckSquare,
      title: 'Sunsama-Style Task Engine',
      desc: 'Sub-task lists, priority flags, tag metrics, deadlines, and direct checklist breakdowns fueled by integrated AI workflows.',
      badge: 'Productivity'
    },
    {
      icon: TrendingUp,
      title: 'Algorithmic Focus Score',
      desc: 'Compute a precise 0-100 score analyzing timer pauses, completion rate benchmarks, streak behaviors, and target goals.',
      badge: 'Analytics'
    },
    {
      icon: Layers,
      title: 'Bento-Grip Projects',
      desc: 'Track specialized domains (Medical, Code, Creative) with dynamic individual progress bars and aggregated domain statistics.',
      badge: 'Organization'
    },
  ];

  const faqs = [
    {
      q: 'How does the AI Coach understand my focus habits?',
      a: 'The server-side coach reads your actual local stats—completed focus sessions, current tasks, active streak, and XP parameters. It doesn’t just answer, it gives customized, actionable behavioral recommendations based on when you are most productive.'
    },
    {
      q: 'Will my study forest persist if I close the app?',
      a: 'Yes, your focus hours, achievements, current streak, tasks, projects, and growing forest are persistently archived in your browser’s localStorage engine.'
    },
    {
      q: 'Can I integrate my existing medical school or tech curriculum?',
      a: 'Absolutely! You can enter goals like "I have my cardiology final in 8 days" inside the AI Coach Study Planner and it will instantly break it down into customizable pomodoro tasks.'
    }
  ];

  return (
    <div id="landing-container" className="min-h-screen bg-[#070a13] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-[30%] right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header id="landing-header" className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-10 backdrop-blur-md bg-[#070a13]/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 rounded-xl p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/15">
            <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              POMO OS
            </h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">AI Productivity Engine</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-neutral-400 text-sm">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#coach" className="hover:text-cyan-400 transition-colors">AI Intelligence</a>
          <a href="#forest" className="hover:text-cyan-400 transition-colors">Forest</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <button 
          id="btn-nav-launch"
          onClick={onLaunch}
          className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400 transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95 group"
        >
          Launch Workspace
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      {/* Hero Section */}
      <section id="hero" className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-300 font-mono mb-8 backdrop-blur-sm shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          The Intelligent Operating System for Deep Work
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight mb-8 leading-[1.1] text-gradient"
        >
          Unlock Deep Focus<br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Fueled by Contextual AI
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-sans font-light leading-relaxed"
        >
          This is not simply a countdown clock. Pomo OS blends bento status hubs, automatic syllabus plan generators, multi-phase checklists, dynamic analytics, and visual garden forest maps to elevate your intellectual potential.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            id="btn-hero-launch"
            onClick={onLaunch}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2.5 group"
          >
            Enter Operational Hub
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <a 
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Explore Capabilities
          </a>
        </motion.div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Architectural Pillars</p>
          <h3 className="text-3xl font-extrabold font-sans tracking-tight">Crafted for Cognitive High performance</h3>
          <p className="text-slate-400 mt-3 text-sm max-w-lg mx-auto">No telemetry lag, no marketing noise. Clean modules centering structured flow states.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass-panel p-8 rounded-3xl group hover:border-[#1e293b] hover:bg-[#0c1222] transition-all relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-indigo-500/5 border border-cyan-500/15 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="absolute top-6 right-6 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-indigo-300 uppercase tracking-wider">
                  {f.badge}
                </div>
                <h4 className="text-lg font-bold font-sans text-white mb-2 leading-tight">{f.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI Coach Visual Segment */}
      <section id="coach" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 prose select-text text-left">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-4">Server-Side Model Grounding</span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              A Coach That Actually Learns Your Flow Capacity
            </h3>
            <p className="text-slate-400 mt-4 leading-relaxed font-light text-sm">
              Traditional AI assistants ask you what to do. Pomo OS builds direct connection loops. If you study better after 8 PM, complete programming blocks on time, but pause gym timers frequently, the coach adjusts your daily scheduling breakdown immediately.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 text-xs font-bold">1</div>
                <div>
                  <h5 className="font-bold text-sm text-white">Study Planner</h5>
                  <p className="text-xs text-slate-400">Instantly creates step-by-step milestones spanning multiple days for massive exams.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 text-xs font-bold">2</div>
                <div>
                  <h5 className="font-bold text-sm text-white">Task Breakdowns</h5>
                  <p className="text-xs text-slate-400">Instantly break ambiguous items like 'Anatomical review' into modular 25m checklists.</p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button 
                id="btn-coach-learn"
                onClick={onLaunch}
                className="px-6 py-3 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 group"
              >
                Experience AI Scheduling Loop
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-white/5 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-10 bg-slate-900/50 border-b border-white/5 px-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500">Gemini-3.5-flash Grounded Instance</div>
                <div className="w-4"></div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div id="msg-demo-user" className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono text-cyan-400">ME</span>
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 rounded-2xl rounded-tl-none p-4 max-w-md">
                    <p className="text-xs text-slate-200 leading-relaxed font-sans select-none">
                      "I have my ophthalmology exam in 14 days, split what I need to do and help with a schedule."
                    </p>
                  </div>
                </div>

                <div id="msg-demo-ai" className="flex items-start gap-4 justify-end">
                  <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/25 rounded-2xl rounded-tr-none p-4 max-w-md text-right">
                    <div className="flex items-center gap-1 bg-indigo-500/20 border border-indigo-400/20 rounded px-1.5 py-0.5 text-[9px] font-mono text-indigo-300 w-max ml-auto mb-2">
                      <Sparkles className="w-2.5 h-2.5" /> AI COACH GENERATION
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans text-left">
                      Based on your focus streak of <strong>5 days</strong> and strong evening pacing, I've divided this into a 4-phase micro syllabus:
                    </p>
                    <ul className="text-[11px] text-slate-400 mt-2 space-y-1.5 text-left list-disc list-inside">
                      <li><strong>Day 1-4:</strong> Direct flashcard parsing of optical structures.</li>
                      <li><strong>Day 5-8:</strong> Pathological lecture flash summaries.</li>
                      <li><strong>Day 9-11:</strong> Active Diagnostic Mock tests.</li>
                      <li><strong>Day 12-14:</strong> Space recall review blocks.</li>
                    </ul>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Forest Feature Pitch */}
      <section id="forest" className="max-w-7xl mx-auto px-6 py-20 text-center border-t border-white/5 relative z-10">
        <div className="max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-4">Interactive Gardening gametics</span>
          <h3 className="text-3xl font-extrabold text-white font-sans tracking-tight leading-tight">
            Stop Tracking Numbers. Grow a Forest Garden.
          </h3>
          <p className="text-slate-400 mt-4 leading-relaxed font-light text-sm">
            Each deep session you successfully finalize converts energy into standard organism seeds. Choose Sakura blossoms, Majestic Pines, or the ultimate golden trees. Watch your persistent forest populate in real time—physical timestamps mapped elegantly on a visual coordinate grid.
          </p>
        </div>
        
        {/* Animated Tree Icons Grid preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {['🌲 Pine', '🌸 Sakura', '🌳 Oak', '🍁 Maple', '✨ Golden'].map((t, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#111827] transition-colors">
              <span className="text-2xl">{t.split(' ')[0]}</span>
              <span className="text-xs font-bold text-slate-300">{t.split(' ')[1]} Tree</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">25m focus grow</span>
            </div>
          ))}
        </div>
      </section>

      {/* Structured Pricing / Levels Segment */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Accessible Devotion Plans</p>
          <h3 className="text-3xl font-extrabold font-sans">Aesthetic Access Presets</h3>
          <p className="text-slate-400 mt-3 text-sm max-w-sm mx-auto">Full capabilities unlocked natively. Choose your operational tier.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Standard Tier */}
          <div className="glass-panel p-8 rounded-3xl relative flex flex-col justify-between border border-white/5 hover:border-slate-800 transition-colors">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Core Devotee</div>
              <h4 className="text-xl font-bold text-white mb-4">Focus Initiate</h4>
              <div className="text-3xl font-bold text-white mb-6">$0 <span className="text-sm text-slate-400 font-normal">/ absolute free</span></div>
              <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                Unlock custom bento trackers, circular Pomodoro presets, Focus Forest planting, and calendar schedulers natively.
              </p>
              <ul className="text-xs space-y-3 text-slate-300">
                <li className="flex items-center gap-2">✔️ Customizable timers + Sound Alarms</li>
                <li className="flex items-center gap-2">✔️ Complete Focus Forest gamification grid</li>
                <li className="flex items-center gap-2">✔️ Dynamic 0-100 Focus Score</li>
                <li className="flex items-center gap-2">✔️ Tasks, projects, submenus</li>
              </ul>
            </div>
            <button 
              id="btn-pricing-free"
              onClick={onLaunch}
              className="mt-8 w-full py-3 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
            >
              Start Focusing Now
            </button>
          </div>

          {/* AI Pilot Pro Tier */}
          <div className="glass-panel p-8 rounded-3xl relative flex flex-col justify-between border border-cyan-500/20 bg-indigo-950/10 hover:border-cyan-500/30 transition-colors">
            <div className="absolute top-6 right-6 px-2.5 py-1 rounded bg-cyan-400/20 text-cyan-300 text-[8px] font-mono uppercase tracking-wider">
              Highly Recommended
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">INTELLIGENT PILOT</div>
              <h4 className="text-xl font-bold text-white mb-4">Pro Pilot</h4>
              <div className="text-3xl font-bold text-white mb-6">$7 <span className="text-sm text-slate-400 font-normal">/ month equivalent</span></div>
              <p className="text-xs text-indigo-200/70 mb-8 leading-relaxed">
                Connect your actual metrics with full Gemini model intelligence. Includes automatic exam planners and conversational assistants.
              </p>
              <ul className="text-xs space-y-3 text-indigo-100">
                <li className="flex items-center gap-2 text-cyan-300">★ Full access to the AI Coach Assistant</li>
                <li className="flex items-center gap-2">★ AI Structured Exam Study Planners</li>
                <li className="flex items-center gap-2">★ Dynamic subtask division checklists</li>
                <li className="flex items-center gap-2">★ Optimization algorithmic task sorting</li>
              </ul>
            </div>
            <button 
              id="btn-pricing-pro"
              onClick={onLaunch}
              className="mt-8 w-full py-3 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400 shadow-lg shadow-cyan-500/15"
            >
              Access AI Pro Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Accordion FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center mb-12">
          <HelpCircle className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white font-sans">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-panel p-6 rounded-2xl select-text">
              <h5 className="font-bold text-sm text-white mb-2">{faq.q}</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="landing-footer" className="bg-[#04060b] border-t border-white/5 py-12 relative z-10 text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">AI POMODORO OPERATING SYSTEM</span>
          </div>
          <div className="text-[11px] font-sans">
            &copy; 2026 Pomo OS. Beautiful, robust and compliant deep work companion.
          </div>
        </div>
      </footer>
    </div>
  );
}
