export interface Dictionary {
  // Navigation & Header
  dashboard: string;
  timer: string;
  tasks: string;
  calendar: string;
  forest: string;
  analytics: string;
  coach: string;
  settings: string;
  exitHub: string;
  level: string;
  streakDays: string;
  online: string;
  spotlightTarget: string;
  logoText: string;

  // Landing Page
  landingTitle: string;
  landingSubtitle: string;
  landingDesc: string;
  enterWorkspace: string;
  pomoOsTag: string;

  // Dashboard Common / Widgets
  welcomeBack: string;
  pilotTitle: string;
  currentFocusScore: string;
  streakTitle: string;
  totalFocusTime: string;
  completedTasks: string;
  xpLevelUpProgress: string;
  todaysChallenges: string;
  recentAchievements: string;
  focusStats: string;
  activeDailyStreak: string;
  levelRanger: string;
  scoreExplanation: string;

  // WorkTimer Tab
  timerTitle: string;
  timerSubtitle: string;
  workBlock: string;
  shortBreak: string;
  longBreak: string;
  start: string;
  pause: string;
  reset: string;
  currentTaskTitle: string;
  noActiveTask: string;
  selectTaskFromTab: string;
  soundCue: string;
  completedCycles: string;
  interruptionLogged: string;
  markTaskComplete: string;
  selectTaskPrompt: string;

  // Task Manager Tab
  tasksTitle: string;
  tasksSubtitle: string;
  addTask: string;
  placeholderTitle: string;
  placeholderNotes: string;
  priorityLabel: string;
  high: string;
  medium: string;
  low: string;
  estimatedPomos: string;
  deadlineLabel: string;
  saveTask: string;
  subtasksLabel: string;
  tagTask: string;
  deleteTask: string;
  aiBreakdownBtn: string;
  aiLoading: string;
  suggestedSteps: string;

  // Calendar Planner Tab
  calendarTitle: string;
  calendarSubtitle: string;
  addCalendarEvent: string;
  eventTitle: string;
  startTime: string;
  endTime: string;
  saveEvent: string;
  upcomingSchedules: string;
  dayShort: string;

  // Focus Forest Tab
  forestTitle: string;
  forestSubtitle: string;
  selectTreeToPlant: string;
  oak: string;
  pine: string;
  sakura: string;
  maple: string;
  golden: string;
  grownTreesDesc: string;
  matureTreesCount: string;
  sessionMinutes: string;
  resetForestBtn: string;

  // Focus Analytics Tab
  analyticsTitle: string;
  analyticsSubtitle: string;
  weeklyTrend: string;
  studyHabitsDistribution: string;
  overallScoreTrend: string;
  productivityLevelBadge: string;
  focusDistributionHours: string;

  // AI Coach Hub
  coachTitle: string;
  coachSubtitle: string;
  chatWithCoach: string;
  getStudyPlan: string;
  optimizeSchedule: string;
  askPomoCoachPlaceholder: string;
  sendBtn: string;
  importTasksBtn: string;
  daysRemainingLabel: string;
  targetHoursLabel: string;
  generatePlanBtn: string;
  optimiseOrderLabel: string;
  aiOptimizing: string;

  // Settings Tab
  settingsTitle: string;
  settingsSubtitle: string;
  workspaceCustomization: string;
  themePresetLabel: string;
  systemNotifications: string;
  ambientChimesDesc: string;
  geminiConfig: string;
  customGeminiKeyDesc: string;
  pasteKeyPlaceholder: string;
  show: string;
  hide: string;
  getFreeKeyLink: string;
  clearKey: string;
  sensitiveFormatting: string;
  harshResetLabel: string;
  clearAllDataDesc: string;
  eraseOperationalHub: string;
  
  // Theme Toggle Options
  cosmicObsidian: string;
  organicPitchBlack: string;
  lightMode: string;
  darkMode: string;
  activeMode: string;
}

export const translations: Record<'en' | 'ar', Dictionary> = {
  en: {
    dashboard: "Dashboard",
    timer: "Pomodoro Timer",
    tasks: "Tasks & Projects",
    calendar: "Calendar Planner",
    forest: "Focus Forest",
    analytics: "Focus Analytics",
    coach: "AI Coach Hub",
    settings: "Settings",
    exitHub: "Exit Hub",
    level: "Level",
    streakDays: "Day streak",
    online: "READY",
    spotlightTarget: "Focused Target:",
    logoText: "FOCUS RUN",

    landingTitle: "FOCUS RUN",
    landingSubtitle: "Sleek Pomodoro Operating Space",
    landingDesc: "Lock attention in pristine intervals, grow natural forests, sync calendars, and collaborate on performance with a deep-learning cognitive assistant. Created to elevate professional focus.",
    enterWorkspace: "Enter Operating System",
    pomoOsTag: "PRODUCTION HUB ACTIVE",

    welcomeBack: "Welcome Back",
    pilotTitle: "Focus Pilot",
    currentFocusScore: "Daily Focus Score",
    streakTitle: "Current Streak",
    totalFocusTime: "Total Focus Hours",
    completedTasks: "Completed Sessions",
    xpLevelUpProgress: "XP Progress",
    todaysChallenges: "Today's Focus Milestones",
    recentAchievements: "Acquired Badges & Trophies",
    focusStats: "System Performance",
    activeDailyStreak: "active daily streak",
    levelRanger: "Level {lvl} Mindful Ranger",
    scoreExplanation: "Focus metric formulated dynamically from checklist completion rates and minimised breaks.",

    timerTitle: "Pomodoro Focus Chamber",
    timerSubtitle: "Submerge yourself in silent study cycles. Keep distraction out.",
    workBlock: "Work Block",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    start: "Start session",
    pause: "Pause cycle",
    reset: "Reset clock",
    currentTaskTitle: "Primary Target Selected",
    noActiveTask: "No Task Spotlit",
    selectTaskFromTab: "Select or highlight a task in the Tasks tab to map it directly inside the timing block.",
    soundCue: "Timer Completion Buzzer",
    completedCycles: "Sessions Done",
    interruptionLogged: "Pauses Logged",
    markTaskComplete: "Mark Target Completed",
    selectTaskPrompt: "Select active target",

    tasksTitle: "Operational Tasks",
    tasksSubtitle: "Assemble, organize, and decompose task milestones effortlessly.",
    addTask: "Add New Task",
    placeholderTitle: "E.g., Review anatomy neurology patterns...",
    placeholderNotes: "Add supplementary session details, resources or priorities...",
    priorityLabel: "Urgency Weight",
    high: "Urget/High",
    medium: "Medium",
    low: "Low Priority",
    estimatedPomos: "Est. Pomodoros (25m)",
    deadlineLabel: "Due Date",
    saveTask: "Commit Task to Stack",
    subtasksLabel: "Milestone Steps Checklist",
    tagTask: "Add labels...",
    deleteTask: "Erase Task",
    aiBreakdownBtn: "Decompose via Gemini AI",
    aiLoading: "Consulting AI...",
    suggestedSteps: "Gemini Recommended Decompositions",

    calendarTitle: "Synchronized Planner",
    calendarSubtitle: "Integrate time blocks directly onto your day structure.",
    addCalendarEvent: "Insert New Event",
    eventTitle: "Event Subject",
    startTime: "Start Time",
    endTime: "End Time",
    saveEvent: "Secure Event Block",
    upcomingSchedules: "Schedules Agenda",
    dayShort: "Day",

    forestTitle: "Focus Forest",
    forestSubtitle: "Visualise your hours of devotion represented as trees. Plant seeds, log focus, watch forests sprout.",
    selectTreeToPlant: "Choose Seed Type to Nurser",
    oak: "Robust Oak",
    pine: "Winter Pine",
    sakura: "Sprout Sakura",
    maple: "Autumn Maple",
    golden: "Gilded Maple",
    grownTreesDesc: "Your forest flourishes as you log uninterrupted pomodoro study intervals.",
    matureTreesCount: "Fully Grown Trees",
    sessionMinutes: "Focus Capital (Minutes)",
    resetForestBtn: "Prune Forest Ground",

    analyticsTitle: "Focus Analytics",
    analyticsSubtitle: "Insightful breakdown of deep work consistency, task throughput and session distributions.",
    weeklyTrend: "Focus Session Consistency Index",
    studyHabitsDistribution: "Category Distribution",
    overallScoreTrend: "Focus Score Vector",
    productivityLevelBadge: "Productivity Standing",
    focusDistributionHours: "Focus Hours Spent",

    coachTitle: "AI Coaching Hub",
    coachSubtitle: "Consult the cognitive study coach for granular plans, task optimization, or structural study advice.",
    chatWithCoach: "Conversational Desk",
    getStudyPlan: "Instant Plan Planner",
    optimizeSchedule: "Optimal Sequencer",
    askPomoCoachPlaceholder: "Ask cognitive coach: How do I split high density medical study blocks? ...",
    sendBtn: "Transmit Query",
    importTasksBtn: "Schedule and Import to OS",
    daysRemainingLabel: "Days Remaining Until Exam",
    targetHoursLabel: "Target Daily Study Hours",
    generatePlanBtn: "Instruct AI study plan",
    optimiseOrderLabel: "Structure optimum stack order based on focus scores and complexity.",
    aiOptimizing: "Calibrating sequence...",

    settingsTitle: "Operating Space Settings",
    settingsSubtitle: "Tweak interface mode, support multilingual translations, configure keys, or format database.",
    workspaceCustomization: "Space Layout & Branding",
    themePresetLabel: "Active Theme Profile",
    systemNotifications: "Interactive Sounds",
    ambientChimesDesc: "Audit cue chimes play automatically when countdown segments conclude.",
    geminiConfig: "Cognitive API Key Setup",
    customGeminiKeyDesc: "By providing a custom Gemini Key, you enable server-side deep learning services on any host securely. Your keys remain inside your local browser context.",
    pasteKeyPlaceholder: "Insert Gemini API Key (e.g., AIzaSy...)",
    show: "Unveil",
    hide: "Conceal",
    getFreeKeyLink: "Get instant key from Google AI Studio",
    clearKey: "Purge Custom Key",
    sensitiveFormatting: "Database Management",
    harshResetLabel: "Complete OS Factory Format",
    clearAllDataDesc: "Deletes all persistent task items, grew forest trees, streak records, and calendar files from the local storage context.",
    eraseOperationalHub: "Erase OS Databases",
    
    cosmicObsidian: "Cosmic Charcoal",
    organicPitchBlack: "Pitch Black",
    lightMode: "Pristine Light",
    darkMode: "Carbon Dark",
    activeMode: "Workspace Mode"
  },
  ar: {
    dashboard: "لوحة التحكم",
    timer: "مؤقت بومودورو",
    tasks: "المهام والمشاريع",
    calendar: "مخطط التقويم",
    forest: "غابة التركيز",
    analytics: "تحليلات الأداء",
    coach: "منصة المدرب الذكي",
    settings: "الإعدادات",
    exitHub: "خروج من النظام",
    level: "المستوى",
    streakDays: "أيام متتالية",
    online: "جاهز للعمل",
    spotlightTarget: "الهدف الحالي المسلط عليه الضوء:",
    logoText: "فوكس رَن",

    landingTitle: "فوكس رَن",
    landingSubtitle: "نظام التشغيل المتكامل للتركيز والإنجاز",
    landingDesc: "ركّز بكل جوارحك في فترات زمنية دقيقة، ابنِ غاباتك الطبيعية، زامن جدول مهامك، وتفاعل بفعالية مع مدرب دراسي بالذكاء الاصطناعي مهيأ لتسريع مسيرتك وجهودك المعرفية.",
    enterWorkspace: "دخول نظام التشغيل",
    pomoOsTag: "صالة الإنتاج نشطة الآن",

    welcomeBack: "مرحبًا بك مجددًا",
    pilotTitle: "قائد التركيز",
    currentFocusScore: "معدل التركيز اليومي",
    streakTitle: "سلسلة الأيام الحالية",
    totalFocusTime: "إجمالي ساعات التركيز",
    completedTasks: "الدورات المنجزة",
    xpLevelUpProgress: "مستوى الخبرة (XP)",
    todaysChallenges: "تحديات الإنتاجية اليومية",
    recentAchievements: "الأوسمة والجوائز المكتسبة",
    focusStats: "أداء النظام",
    activeDailyStreak: "سلسلة تركيز يومية نشطة",
    levelRanger: "المستوى {lvl} حارس التركيز الواعي",
    scoreExplanation: "يتم حساب معدل التركيز ديناميكيًا بناءً على إنجاز المهام وتقليل المقاطعات أثناء الجلسات.",

    timerTitle: "غرفة التركيز العميقة",
    timerSubtitle: "انغمس في جلسات دراسة هادئة تمامًا وأبقِ جميع المشتتات بعيدة عن مكتبك.",
    workBlock: "وقت التركيز",
    shortBreak: "استراحة قصيرة",
    longBreak: "استراحة طويلة",
    start: "بدء الجلسة",
    pause: "إيقاف مؤقت",
    reset: "إعادة ضبط الساعة",
    currentTaskTitle: "الهدف الأساسي النشط",
    noActiveTask: "لا يوجد هدف محدد حاليًا",
    selectTaskFromTab: "اختر أو حدد مهمة من تبويب المهام لربطها وتتبعها مباشرةً داخل المؤقت.",
    soundCue: "صوت جرس انتهاء الجلسة",
    completedCycles: "الجلسات المنجزة",
    interruptionLogged: "المقاطعات المسجلة",
    markTaskComplete: "تحديد كهدف منجز",
    selectTaskPrompt: "اختر الهدف النشط",

    tasksTitle: "المهام والعمليات",
    tasksSubtitle: "أنشئ مهامك ونظمها وقسّمها إلى أجزاء دقيقة وقابلة للتنفيذ بكل سهولة.",
    addTask: "إضافة مهمة جديدة",
    placeholderTitle: "مثال: مراجعة بطاقات الاستذكار الطبية لقسم الأعصاب...",
    placeholderNotes: "أضف تفاصيل الجلسة، مراجع دراسية أو أولويات إضافية...",
    priorityLabel: "درجة الأهمية والاستعجال",
    high: "عاجل / رئيسي",
    medium: "متوسط الأهمية",
    low: "أولوية منخفضة",
    estimatedPomos: "الحجم المتوقع (دورات 25 دقيقة)",
    deadlineLabel: "تاريخ الاستحقاق",
    saveTask: "إضافة المهمة إلى القائمة",
    subtasksLabel: "خطوات المهمة الفرعية",
    tagTask: "أضف وسومًا...",
    deleteTask: "حذف المهمة نهائيًا",
    aiBreakdownBtn: "تقسيم الذكاء الاصطناعي (Gemini UI)",
    aiLoading: "جاري تحليل المهام...",
    suggestedSteps: "خطوات مقترحة بواسطة الذكاء الاصطناعي",

    calendarTitle: "مخطط الوقت والتقويم",
    calendarSubtitle: "قم بجدولة وحجز فترات تركيزك مباشرة على هيكل يومك الزمني.",
    addCalendarEvent: "إضافة موعد جديد",
    eventTitle: "عنوان الحدث أو المادة",
    startTime: "وقت البدء",
    endTime: "وقت الانتهاء",
    saveEvent: "حفظ الموعد في التقويم",
    upcomingSchedules: "جدول المواعيد القادمة",
    dayShort: "يوم",

    forestTitle: "غابة التركيز",
    forestSubtitle: "شاهد ساعات جدّك واجتهادك تتجسد كأشجار وارفة. كل دورة تركيز تنبت شجرة جديدة وتنمّي غابتك الخاصة.",
    selectTreeToPlant: "اختر نوع البذرة لزرعها",
    oak: "شجرة البلوط العريقة",
    pine: "شجرة الصنوبر الشتوية",
    sakura: "شجرة الساكورا المزهرة",
    maple: "شجرة القيقب الخريفية",
    golden: "القيقب الذهبي اللامع",
    grownTreesDesc: "تنمو أشجار غابتك وتزدهر مع كل دورة بومودورو تنجزها دون التنازل للمشتتات.",
    matureTreesCount: "أشجار كاملة النمو",
    sessionMinutes: "دقائق التركيز المستثمرة",
    resetForestBtn: "تهذيب أرض الغابة وتنظيفها",

    analyticsTitle: "احصائيات الأداء",
    analyticsSubtitle: "تحليل دقيق ومدعوم بالبيانات لمدى استمرارية العمل العميق وتوزيع ساعات التركيز على المشاريع.",
    weeklyTrend: "مؤشر استمرارية التركيز الأسبوعي",
    studyHabitsDistribution: "توزيع التركيز حسب الفئات والمشاريع",
    overallScoreTrend: "منحنى معدل التركيز",
    productivityLevelBadge: "حالة الإنتاجية والتقييم",
    focusDistributionHours: "توزيع الساعات المستثمرة",

    coachTitle: "الاستشارة الذكية",
    coachSubtitle: "تفاوض مع مدرب التركيز للحصول على خطط تفصيلية مخصصة، إعادة هيكلة مهامك، أو لطلب نصائح دراسية استثنائية.",
    chatWithCoach: "مكتب المحادثة التفاعلي",
    getStudyPlan: "مخطط الخطة الدراسية السريع",
    optimizeSchedule: "ترتيب الجدول الأمثل",
    askPomoCoachPlaceholder: "اسأل مدربك: كيف أقسم خطتي لدراسة مادة طبية معقدة قبل الامتحان بأيام؟...",
    sendBtn: "إرسال الاستفسار",
    importTasksBtn: "جدولة المهام وإدراجها بالنظام",
    daysRemainingLabel: "الأيام المتبقية حتى الامتحان",
    targetHoursLabel: "ساعات الدراسة اليومية المستهدفة",
    generatePlanBtn: "صياغة خطة العمل بواسطة الذكاء الاصطناعي",
    optimiseOrderLabel: "فرز ترتيب المهام الأمثل تلقائيًا بناءً على الأولويات والجهد.",
    aiOptimizing: "جاري حوسبة الترتيب الأنسب...",

    settingsTitle: "إعدادات فضاء العمل",
    settingsSubtitle: "اضبط نمط الواجهة الرسومية، اختر لغة النظام المفضلة، تفقد مفاتيح الربط البرمجية، أو قم بتهيئة قواعد البيانات الخاصة بك.",
    workspaceCustomization: "تخصيص الهوية والواجهة الرسومية",
    themePresetLabel: "شكل وونق النمط الفني",
    systemNotifications: "إشعارات وأصوات التنبيه",
    ambientChimesDesc: "رنين خفيف وأصوات زن (Zen) هادئة تُعزف تلقائيًا عند انتهاء التنازلي للمؤقت.",
    geminiConfig: "إعداد مفاتيح الذكاء الاصطناعي بخصوصية وأمان",
    customGeminiKeyDesc: "تتيح لك تهيئة مفتاح API الخاص بك بـ Google Gemini تشغيل الميزات الذكية وتحليلات تفكيك المهام مباشرةً. تُحفظ هذه البيانات في بيئة متصفحك الآمنة ولا تشارك مع أطراف خارجية.",
    pasteKeyPlaceholder: "ألصق مفتاح Gemini هنا (مثال: AIzaSy...)",
    show: "إظهار",
    hide: "إخفاء",
    getFreeKeyLink: "احصل على مفتاح مجاني فوري من Google AI Studio",
    clearKey: "حذف المفتاح المخصص",
    sensitiveFormatting: "إدارة البيانات والتهيئة",
    harshResetLabel: "حذف قواعد البيانات وإعادة ضبط المصنع",
    clearAllDataDesc: "يقوم هذا الإجراء بمسح كافة المهام والمشاريع المسجلة، إحصائيات الأداء، غابات التركيز المحفوظة، وبيانات التقويم نهائيًا من المتصفح.",
    eraseOperationalHub: "تصفير قواعد بيانات النظام",
    
    cosmicObsidian: "الكربوني اللامع",
    organicPitchBlack: "الأسود الحالك",
    lightMode: "النهار الناصع (مضيء)",
    darkMode: "الليل الهادئ (داكن)",
    activeMode: "سمة لوحة التشغيل"
  }
};
