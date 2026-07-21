import type { AppUser, Grade, Homework, NewsItem, SchoolClass, AttendanceRecord } from './types';

export const demoUsers: AppUser[] = [
  { uid: 'demo-student', email: 'student@demo.com', name: 'يوسف طارق محمد', role: 'student', approved: true, classId: 'class-3a', busId: 'bus-1', busRegion: 'سيدي جابر' },
  { uid: 'demo-student-2', email: 'student2@demo.com', name: 'سارة عبد الرحمن', role: 'student', approved: true, classId: 'class-3a' },
  { uid: 'demo-student-3', email: 'student3@demo.com', name: 'أحمد محمود علي', role: 'student', approved: true, classId: 'class-3a' },
  { uid: 'demo-student-4', email: 'student4@demo.com', name: 'حنان فتحي السيد', role: 'student', approved: true, classId: 'class-3a' },
  { uid: 'demo-parent', email: 'parent@demo.com', name: 'أ. طارق محمد يوسف', role: 'parent', approved: true, childrenIds: ['demo-student'] },
  { uid: 'demo-teacher', email: 'teacher@demo.com', name: 'أ. سارة حسين فؤاد', role: 'teacher', approved: true, subject: 'العلوم' },
  { uid: 'demo-admin', email: 'admin@demo.com', name: 'الأخت ماريا سيمونز', role: 'admin', approved: true },
  { uid: 'demo-driver', email: 'driver@demo.com', name: 'الأسطى منصور عبد الله', role: 'driver', approved: true, busId: 'bus-1' },
  { uid: 'demo-pending', email: 'new@demo.com', name: 'محمد ناصر الدين', role: 'teacher', approved: false, subject: 'الرياضيات' },
];

export const demoPasswords: Record<string, string> = {
  'student@demo.com': 'demo1234',
  'parent@demo.com': 'demo1234',
  'teacher@demo.com': 'demo1234',
  'admin@demo.com': 'demo1234',
  'driver@demo.com': 'demo1234',
};

export const demoClasses: SchoolClass[] = [
  { id: 'class-3a', name: 'الصف الثالث أ', studentIds: ['demo-student', 'demo-student-2', 'demo-student-3', 'demo-student-4'] },
];

export const demoGrades: Grade[] = [
  { id: 'g1', studentId: 'demo-student', subject: 'الرياضيات', oral: 28, written: 52, practical: 14, term: '2025-2' },
  { id: 'g2', studentId: 'demo-student', subject: 'اللغة العربية', oral: 25, written: 49, practical: 14, term: '2025-2' },
  { id: 'g3', studentId: 'demo-student', subject: 'العلوم', oral: 26, written: 52, practical: 13, term: '2025-2' },
  { id: 'g4', studentId: 'demo-student', subject: 'اللغة الفرنسية', oral: 22, written: 47, practical: 13, term: '2025-2' },
  { id: 'g5', studentId: 'demo-student', subject: 'اللغة الإنجليزية', oral: 20, written: 46, practical: 13, term: '2025-2' },
];

export const demoHomework: Homework[] = [
  { id: 'h1', classId: 'class-3a', subject: 'الرياضيات', title: 'حل تمارين الجبر — الفصل السابع', teacherName: 'أ. محمد السيد', dueDate: '2026-07-15', createdAt: Date.now() },
  { id: 'h2', classId: 'class-3a', subject: 'العلوم', title: 'تقرير عن التركيب الخلوي', teacherName: 'أ. سارة فؤاد', dueDate: '2026-07-17', createdAt: Date.now() },
  { id: 'h3', classId: 'class-3a', subject: 'اللغة الفرنسية', title: 'Rédaction: Ma famille et moi', teacherName: 'Sœur Marie-Claire', dueDate: '2026-07-20', createdAt: Date.now() },
];

export const demoNews: NewsItem[] = [
  { id: 'n1', title: 'طلابنا يحصدون جوائز الأولمبياد الوطني للعلوم 2026', tag: 'إنجازات', emoji: '🏆', date: '2026-06-15', createdAt: Date.now() },
  { id: 'n2', title: 'معرض الفنون السنوي "ألوان الإيمان" يفتح أبوابه', tag: 'فعاليات', emoji: '🎨', date: '2026-06-10', createdAt: Date.now() - 1 },
  { id: 'n3', title: 'جدول الامتحانات النهائية للفصل الدراسي الثاني', tag: 'إعلانات', emoji: '📅', date: '2026-06-05', createdAt: Date.now() - 2 },
  { id: 'n4', title: 'مشروع "مدرستنا خضراء" ينطلق بزراعة 200 شجرة', tag: 'بيئة', emoji: '🌿', date: '2026-06-01', createdAt: Date.now() - 3 },
  { id: 'n5', title: 'حفل تكريم طلاب الثانوية العامة والمتفوقين', tag: 'تخرج', emoji: '🎓', date: '2026-05-28', createdAt: Date.now() - 4 },
  { id: 'n6', title: 'فريق كرة القدم يتأهل لنهائيات دوري محافظة البحيرة', tag: 'رياضة', emoji: '⚽', date: '2026-05-20', createdAt: Date.now() - 5 },
];

export const demoAttendance: AttendanceRecord[] = [];

// ============================================================
// CMS demo data (Phase 1)
// ============================================================
import type { SiteSettings, Banner } from './types';

export const demoSiteSettings: SiteSettings = {
  id: 'site',
  logoUrl: '/logo.png',
  schoolName: {
    ar: 'مدرسة الراهبات الفرنسيسكانيات',
    en: 'Franciscan Sisters School',
    fr: 'École des Sœurs Franciscaines',
  },
  tagline: {
    ar: 'منذ عام 1936 — التميّز في التعليم',
    en: 'Since 1936 — Excellence in Education',
    fr: 'Depuis 1936 — Excellence en éducation',
  },
  phone: '045-000-0000',
  email: 'info@franciscan-dam.edu.eg',
  address: {
    ar: 'دمنهور، البحيرة، مصر',
    en: 'Damanhour, Beheira, Egypt',
    fr: 'Damanhour, Beheira, Égypte',
  },
  workingHours: {
    ar: 'الأحد - الخميس: 8:00 ص - 2:00 م',
    en: 'Sun - Thu: 8:00 AM - 2:00 PM',
    fr: 'Dim - Jeu: 8h00 - 14h00',
  },
  facebook: '',
  instagram: '',
  youtube: '',
  whatsapp: '',
  mapEmbedUrl: '',
  statFounded: '1936',
  statStudents: '2,400+',
  statSuccess: '98%',
  updatedAt: Date.now(),
};

export const demoBanners: Banner[] = [
  {
    id: 'b1',
    title: { ar: 'عام دراسي جديد بروح جديدة', en: 'A New Year, A New Spirit', fr: 'Nouvelle année, nouvel esprit' },
    subtitle: { ar: 'نرحب بطلابنا الأعزاء', en: 'Welcoming our dear students', fr: 'Bienvenue à nos chers élèves' },
    imageUrl: '',
    ctaLabel: { ar: 'اعرف المزيد', en: 'Learn More', fr: 'En savoir plus' },
    ctaHref: '/about',
    order: 1,
    visible: true,
    updatedAt: Date.now(),
  },
];

// ============================================================
// Phase 2 demo data — Hall of Fame + Courses
// ============================================================
import type { Achiever, Course } from './types';

export const demoAchievers: Achiever[] = [
  {
    id: 'a1', name: 'مريم عادل جرجس', photoUrl: '', grade: 'الصف الثالث الثانوي',
    achievement: { ar: 'المركز الأول في الأولمبياد الوطني للعلوم', en: 'National Science Olympiad — 1st Place', fr: 'Olympiade nationale de sciences — 1re place' },
    category: 'علمي', year: '2026', medal: 'gold', certificateUrl: '', order: 1, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'a2', name: 'يوسف رامي حنا', photoUrl: '', grade: 'الصف الثاني الثانوي',
    achievement: { ar: 'بطل الجمهورية في الشطرنج', en: 'National Chess Champion', fr: "Champion national d'échecs" },
    category: 'رياضي', year: '2026', medal: 'gold', certificateUrl: '', order: 2, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'a3', name: 'سارة ماجد فؤاد', photoUrl: '', grade: 'الصف الأول الثانوي',
    achievement: { ar: 'المركز الثاني في مسابقة الرسم الدولية', en: '2nd Place — International Art Contest', fr: "2e place — Concours international d'art" },
    category: 'فني', year: '2025', medal: 'silver', certificateUrl: '', order: 3, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'a4', name: 'مينا عماد بشرى', photoUrl: '', grade: 'الصف الثالث الإعدادي',
    achievement: { ar: 'الأول على المحافظة في مسابقة الخطابة', en: 'Governorate 1st — Public Speaking', fr: "1er du gouvernorat — Art oratoire" },
    category: 'ثقافي', year: '2025', medal: 'bronze', certificateUrl: '', order: 4, visible: true, updatedAt: Date.now(),
  },
];

export const demoCourses: Course[] = [
  {
    id: 'c1', coverUrl: '',
    name: { ar: 'الروبوتكس', en: 'Robotics', fr: 'Robotique' },
    description: { ar: 'بناء وبرمجة الروبوتات من الصفر', en: 'Build and program robots from scratch', fr: 'Construire et programmer des robots' },
    ageGroup: '10-16', duration: { ar: '3 أشهر', en: '3 months', fr: '3 mois' }, certificate: true,
    registerHref: '#', order: 1, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'c2', coverUrl: '',
    name: { ar: 'البرمجة للأطفال', en: 'Coding for Kids', fr: 'Codage pour enfants' },
    description: { ar: 'مقدمة ممتعة لعالم البرمجة', en: 'A fun introduction to coding', fr: 'Une introduction ludique au codage' },
    ageGroup: '8-14', duration: { ar: 'فصل دراسي', en: 'One term', fr: 'Un trimestre' }, certificate: true,
    registerHref: '#', order: 2, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'c3', coverUrl: '',
    name: { ar: 'الحساب الذهني', en: 'Mental Math', fr: 'Calcul mental' },
    description: { ar: 'تنمية مهارات الحساب السريع', en: 'Develop fast calculation skills', fr: 'Développer le calcul rapide' },
    ageGroup: '6-12', duration: { ar: '4 أشهر', en: '4 months', fr: '4 mois' }, certificate: true,
    registerHref: '#', order: 3, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'c4', coverUrl: '',
    name: { ar: 'اللغة الإنجليزية', en: 'English Program', fr: "Programme d'anglais" },
    description: { ar: 'برنامج مكثف لإتقان الإنجليزية', en: 'Intensive English mastery program', fr: "Programme intensif d'anglais" },
    ageGroup: '7-18', duration: { ar: 'مستمر', en: 'Ongoing', fr: 'Continu' }, certificate: false,
    registerHref: '#', order: 4, visible: true, updatedAt: Date.now(),
  },
];

// ============================================================
// Phase 3 demo data — Staff + Principal + Facilities
// ============================================================
import type { StaffMember, PrincipalProfile, Facility, StaffGroupImage } from './types';

export const demoStaff: StaffMember[] = [
  { id: 's1', name: 'الأخت ماريا سيمونز', photoUrl: '', category: 'administration', role: { ar: 'مديرة المدرسة', en: 'Principal', fr: 'Directrice' }, order: 1, visible: true, updatedAt: Date.now() },
  { id: 's2', name: 'أ. نادية القمص', photoUrl: '', category: 'administration', role: { ar: 'وكيل المدرسة', en: 'Vice Principal', fr: 'Directrice adjointe' }, order: 2, visible: true, updatedAt: Date.now() },
  { id: 's3', name: 'أ. سارة حسين فؤاد', photoUrl: '', category: 'teaching', role: { ar: 'العلوم', en: 'Science', fr: 'Sciences' }, order: 3, visible: true, updatedAt: Date.now() },
  { id: 's4', name: 'أ. محمد السيد علي', photoUrl: '', category: 'teaching', role: { ar: 'الرياضيات', en: 'Mathematics', fr: 'Mathématiques' }, order: 4, visible: true, updatedAt: Date.now() },
  { id: 's5', name: 'Sœur Marie-Claire', photoUrl: '', category: 'teaching', role: { ar: 'اللغة الفرنسية', en: 'French', fr: 'Français' }, order: 5, visible: true, updatedAt: Date.now() },
  { id: 's6', name: 'أ. مينا عادل', photoUrl: '', category: 'specialist', role: { ar: 'أخصائي نفسي', en: 'Psychologist', fr: 'Psychologue' }, order: 6, visible: true, updatedAt: Date.now() },
  { id: 's7', name: 'أ. مريم صبحي', photoUrl: '', category: 'specialist', role: { ar: 'أخصائي اجتماعي', en: 'Social Specialist', fr: 'Assistante sociale' }, order: 7, visible: true, updatedAt: Date.now() },
];

export const demoPrincipal: PrincipalProfile = {
  id: 'principal',
  name: 'الأخت ماريا سيمونز',
  photoUrl: '',
  biography: {
    ar: 'قادت الأخت ماريا المدرسة لأكثر من 15 عامًا، حاملةً رؤية تعليمية تجمع بين الأصالة والحداثة.',
    en: 'Sister Maria has led the school for over 15 years with a vision blending heritage and modernity.',
    fr: "Sœur Maria dirige l'école depuis plus de 15 ans avec une vision alliant patrimoine et modernité.",
  },
  qualifications: {
    ar: 'دكتوراه في التربية — جامعة الإسكندرية',
    en: 'PhD in Education — Alexandria University',
    fr: "Doctorat en éducation — Université d'Alexandrie",
  },
  experienceYears: '25',
  achievements: {
    ar: 'حاصلة على جائزة التميز التربوي على مستوى الجمهورية 2022.',
    en: 'National Educational Excellence Award 2022.',
    fr: "Prix national d'excellence éducative 2022.",
  },
  message: {
    ar: 'رسالتنا أن نُخرّج جيلاً متعلمًا مؤمنًا قادرًا على خدمة وطنه بالعلم والقيم.',
    en: 'Our message is to raise an educated, faithful generation able to serve their nation.',
    fr: "Notre message : former une génération éduquée et fidèle au service de sa nation.",
  },
  vision: {
    ar: 'أن نكون المدرسة الرائدة في التعليم القيمي المتميز بدمنهور.',
    en: 'To be the leading school in value-based excellence in Damanhour.',
    fr: "Être l'école de référence en excellence éducative à Damanhour.",
  },
  mission: {
    ar: 'تقديم تعليم عالي الجودة يوازن بين العلم والإيمان والأخلاق.',
    en: 'Delivering high-quality education balancing knowledge, faith and ethics.',
    fr: "Offrir une éducation de qualité alliant savoir, foi et éthique.",
  },
  updatedAt: Date.now(),
};

export const demoFacilities: Facility[] = [
  { id: 'f1', name: { ar: 'معمل العلوم', en: 'Science Lab', fr: 'Labo de sciences' }, description: { ar: 'معمل مجهز بالكامل للتجارب العملية', en: 'Fully equipped lab for experiments', fr: 'Labo entièrement équipé' }, icon: '🔬', images: [], order: 1, visible: true, updatedAt: Date.now() },
  { id: 'f2', name: { ar: 'معمل الحاسب', en: 'Computer Lab', fr: 'Salle informatique' }, description: { ar: 'أجهزة حديثة واتصال بالإنترنت', en: 'Modern computers with internet', fr: 'Ordinateurs modernes' }, icon: '💻', images: [], order: 2, visible: true, updatedAt: Date.now() },
  { id: 'f3', name: { ar: 'المكتبة', en: 'Library', fr: 'Bibliothèque' }, description: { ar: 'آلاف الكتب والمراجع', en: 'Thousands of books and references', fr: 'Des milliers de livres' }, icon: '📚', images: [], order: 3, visible: true, updatedAt: Date.now() },
  { id: 'f4', name: { ar: 'الملاعب الرياضية', en: 'Sports Fields', fr: 'Terrains de sport' }, description: { ar: 'ملاعب لكرة القدم والسلة', en: 'Football and basketball courts', fr: 'Terrains de foot et basket' }, icon: '⚽', images: [], order: 4, visible: true, updatedAt: Date.now() },
  { id: 'f5', name: { ar: 'المسرح', en: 'Theatre', fr: 'Théâtre' }, description: { ar: 'مسرح للفعاليات والحفلات', en: 'Theatre for events', fr: 'Théâtre pour événements' }, icon: '🎭', images: [], order: 5, visible: true, updatedAt: Date.now() },
  { id: 'f6', name: { ar: 'العيادة الطبية', en: 'Medical Clinic', fr: 'Clinique médicale' }, description: { ar: 'رعاية صحية للطلاب', en: 'Student healthcare', fr: 'Soins de santé' }, icon: '🏥', images: [], order: 6, visible: true, updatedAt: Date.now() },
];

export const demoStaffGroup: StaffGroupImage = { id: 'staff-group', imageUrl: '', updatedAt: Date.now() };

// ============================================================
// Phase 4 demo data — Activities + Partnerships
// ============================================================
import type { Activity, Partner } from './types';

export const demoActivities: Activity[] = [
  {
    id: 'act1',
    title: { ar: 'اليوم الرياضي السنوي', en: 'Annual Sports Day', fr: 'Journée sportive annuelle' },
    description: { ar: 'منافسات رياضية بين الفصول بأجواء حماسية', en: 'Inter-class sports competitions', fr: 'Compétitions sportives inter-classes' },
    category: 'sports', coverUrl: '', images: [], videos: [], date: '2026-03-15', order: 1, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'act2',
    title: { ar: 'معرض الفنون "ألوان الإيمان"', en: 'Colors of Faith Art Exhibition', fr: "Exposition d'art" },
    description: { ar: 'عرض إبداعات الطلاب الفنية', en: "Showcasing students' artwork", fr: 'Exposition des œuvres des élèves' },
    category: 'arts', coverUrl: '', images: [], videos: [], date: '2026-02-20', order: 2, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'act3',
    title: { ar: 'رحلة إلى المتحف المصري', en: 'Trip to the Egyptian Museum', fr: 'Sortie au Musée égyptien' },
    description: { ar: 'رحلة تعليمية لاكتشاف تاريخ مصر', en: 'Educational trip exploring Egypt history', fr: "Sortie éducative sur l'histoire" },
    category: 'trips', coverUrl: '', images: [], videos: [], date: '2026-01-10', order: 3, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'act4',
    title: { ar: 'مسابقة العلوم والابتكار', en: 'Science & Innovation Contest', fr: 'Concours de sciences' },
    description: { ar: 'مشاريع علمية مبتكرة من الطلاب', en: 'Innovative student science projects', fr: 'Projets scientifiques innovants' },
    category: 'competitions', coverUrl: '', images: [], videos: [], date: '2025-12-05', order: 4, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'act5',
    title: { ar: 'احتفال عيد الأم', en: "Mother's Day Celebration", fr: 'Fête des mères' },
    description: { ar: 'فقرات فنية تكريمًا للأمهات', en: 'Artistic performances honoring mothers', fr: 'Spectacles en hommage aux mères' },
    category: 'celebrations', coverUrl: '', images: [], videos: [], date: '2026-03-21', order: 5, visible: true, updatedAt: Date.now(),
  },
];

export const demoPartners: Partner[] = [
  {
    id: 'p1', name: { ar: 'أكاديمية الروبوتكس', en: 'Robotics Academy', fr: 'Académie de robotique' },
    description: { ar: 'شراكة لتدريس الروبوتكس والذكاء الاصطناعي', en: 'Partnership for robotics & AI education', fr: 'Partenariat robotique et IA' },
    logoUrl: '', website: '#', order: 1, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'p2', name: { ar: 'جامعة دمنهور', en: 'Damanhour University', fr: 'Université de Damanhour' },
    description: { ar: 'برامج إرشاد أكاديمي للطلاب المتفوقين', en: 'Academic mentorship programs', fr: 'Programmes de mentorat' },
    logoUrl: '', website: '#', order: 2, visible: true, updatedAt: Date.now(),
  },
  {
    id: 'p3', name: { ar: 'أكاديمية النخبة الرياضية', en: 'Elite Sports Academy', fr: 'Académie sportive' },
    description: { ar: 'تدريب رياضي احترافي للطلاب', en: 'Professional athletic training', fr: 'Entraînement sportif professionnel' },
    logoUrl: '', website: '#', order: 3, visible: true, updatedAt: Date.now(),
  },
];

// ============================================================
// Phase 5 demo data — Careers + Social Specialist
// ============================================================
import type { JobApplication, SpecialistMessage } from './types';

export const demoApplications: JobApplication[] = [
  {
    id: 'app1', fullName: 'كريم منير عبد الله', position: 'مدرس رياضيات',
    qualification: 'بكالوريوس علوم - رياضيات', experience: '5 سنوات', phone: '01012345678',
    email: 'karim@example.com', cvUrl: '', certificatesUrl: '',
    status: 'new', createdAt: Date.now() - 86400000,
  },
];

export const demoSpecialistMessages: SpecialistMessage[] = [
  {
    id: 'msg1', name: 'ولي أمر', contact: '01098765432', subject: 'استفسار عن سلوك الطالب',
    message: 'أرغب في تحديد موعد لمناقشة أمر يخص ابني.', attachmentUrl: '',
    preferredTime: 'الأحد صباحًا', status: 'new', createdAt: Date.now() - 43200000,
  },
];

// ============================================================
// School Bus demo data
// ============================================================
import type { Bus, BusLive } from './types';

export const demoBuses: Bus[] = [
  {
    id: 'bus-1',
    name: { ar: 'الباص الأول', en: 'Bus 1', fr: 'Bus 1', it: 'Bus 1' },
    plateNumber: 'ب ح ر 1234',
    driverId: 'demo-driver',
    driverName: 'الأسطى منصور عبد الله',
    regions: [
      { name: 'سيدي جابر', departureTime: '06:45', returnTime: '14:30' },
      { name: 'الإبراهيمية', departureTime: '07:00', returnTime: '14:45' },
      { name: 'محطة الرمل', departureTime: '07:20', returnTime: '15:00' },
    ],
    visible: true,
    updatedAt: Date.now(),
  },
];

// Damanhour approx center as demo location
export const demoBusLive: BusLive[] = [
  { id: 'bus-1', status: 'idle', lat: 31.0341, lng: 30.4682, sharing: false, etaMinutes: 0, updatedAt: Date.now() },
];
