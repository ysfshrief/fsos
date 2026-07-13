export type Role = 'student' | 'parent' | 'teacher' | 'admin';
export type Locale = 'ar' | 'en' | 'fr';

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: Role;
  approved: boolean;
  classId?: string;      // for students
  childrenIds?: string[]; // for parents
  subject?: string;       // for teachers
  createdAt?: number;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName?: string;
  subject: string;
  oral: number;    // /30
  written: number; // /55
  practical: number; // /15
  term: string;
}

export interface Homework {
  id: string;
  classId: string;
  subject: string;
  title: string;
  teacherName: string;
  dueDate: string; // ISO
  createdAt: number;
}

export interface AttendanceRecord {
  id: string;          // `${date}_${classId}`
  date: string;        // YYYY-MM-DD
  classId: string;
  records: { [studentId: string]: 'present' | 'absent' | 'late' };
  savedBy: string;
}

export interface NewsItem {
  id: string;
  title: string;
  tag: string;
  emoji: string;
  date: string;
  body?: string;
  createdAt: number;
}

export interface SchoolClass {
  id: string;
  name: string;
  studentIds: string[];
}
