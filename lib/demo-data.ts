import type { AppUser, Grade, Homework, NewsItem, SchoolClass, AttendanceRecord } from './types';

export const demoUsers: AppUser[] = [
  { uid: 'demo-student', email: 'student@demo.com', name: 'يوسف طارق محمد', role: 'student', approved: true, classId: 'class-3a' },
  { uid: 'demo-student-2', email: 'student2@demo.com', name: 'سارة عبد الرحمن', role: 'student', approved: true, classId: 'class-3a' },
  { uid: 'demo-student-3', email: 'student3@demo.com', name: 'أحمد محمود علي', role: 'student', approved: true, classId: 'class-3a' },
  { uid: 'demo-student-4', email: 'student4@demo.com', name: 'حنان فتحي السيد', role: 'student', approved: true, classId: 'class-3a' },
  { uid: 'demo-parent', email: 'parent@demo.com', name: 'أ. طارق محمد يوسف', role: 'parent', approved: true, childrenIds: ['demo-student'] },
  { uid: 'demo-teacher', email: 'teacher@demo.com', name: 'أ. سارة حسين فؤاد', role: 'teacher', approved: true, subject: 'العلوم' },
  { uid: 'demo-admin', email: 'admin@demo.com', name: 'الأخت ماريا سيمونز', role: 'admin', approved: true },
  { uid: 'demo-pending', email: 'new@demo.com', name: 'محمد ناصر الدين', role: 'teacher', approved: false, subject: 'الرياضيات' },
];

export const demoPasswords: Record<string, string> = {
  'student@demo.com': 'demo1234',
  'parent@demo.com': 'demo1234',
  'teacher@demo.com': 'demo1234',
  'admin@demo.com': 'demo1234',
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
