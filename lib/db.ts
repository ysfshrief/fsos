import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy,
} from 'firebase/firestore';
import { db, isDemoMode } from './firebase';
import {
  demoGrades, demoHomework, demoNews, demoUsers, demoClasses, demoAttendance,
} from './demo-data';
import type { Grade, Homework, NewsItem, AppUser, SchoolClass, AttendanceRecord } from './types';

// In-memory demo store (mutations persist per-session)
const mem = {
  grades: [...demoGrades],
  homework: [...demoHomework],
  news: [...demoNews],
  users: [...demoUsers],
  attendance: [...demoAttendance] as AttendanceRecord[],
};

// ---------- GRADES ----------
export async function getGradesForStudent(studentId: string): Promise<Grade[]> {
  if (isDemoMode) return mem.grades.filter((g) => g.studentId === studentId);
  const q = query(collection(db!, 'grades'), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Grade, 'id'>) }));
}

export async function saveGrade(g: Omit<Grade, 'id'> & { id?: string }): Promise<void> {
  if (isDemoMode) {
    const key = `${g.studentId}_${g.subject}_${g.term}`;
    const idx = mem.grades.findIndex((x) => `${x.studentId}_${x.subject}_${x.term}` === key);
    if (idx >= 0) mem.grades[idx] = { ...mem.grades[idx], ...g };
    else mem.grades.push({ ...g, id: key } as Grade);
    return;
  }
  const key = g.id ?? `${g.studentId}_${g.subject}_${g.term}`;
  const { id, ...data } = g;
  await setDoc(doc(db!, 'grades', key), data, { merge: true });
}

// ---------- HOMEWORK ----------
export async function getHomeworkForClass(classId: string): Promise<Homework[]> {
  if (isDemoMode) return mem.homework.filter((h) => h.classId === classId);
  const q = query(collection(db!, 'homework'), where('classId', '==', classId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Homework, 'id'>) }));
}

export async function addHomework(h: Omit<Homework, 'id'>): Promise<void> {
  if (isDemoMode) { mem.homework.push({ ...h, id: `h${Date.now()}` }); return; }
  await addDoc(collection(db!, 'homework'), h);
}

// ---------- NEWS ----------
export async function getNews(): Promise<NewsItem[]> {
  if (isDemoMode) return [...mem.news].sort((a, b) => b.createdAt - a.createdAt);
  const q = query(collection(db!, 'news'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NewsItem, 'id'>) }));
}

export async function addNews(n: Omit<NewsItem, 'id'>): Promise<void> {
  if (isDemoMode) { mem.news.unshift({ ...n, id: `n${Date.now()}` }); return; }
  await addDoc(collection(db!, 'news'), n);
}

export async function deleteNews(id: string): Promise<void> {
  if (isDemoMode) { mem.news = mem.news.filter((n) => n.id !== id); return; }
  await deleteDoc(doc(db!, 'news', id));
}

// ---------- USERS ----------
export async function getAllUsers(): Promise<AppUser[]> {
  if (isDemoMode) return [...mem.users];
  const snap = await getDocs(collection(db!, 'users'));
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<AppUser, 'uid'>) }));
}

export async function setUserApproval(uid: string, approved: boolean): Promise<void> {
  if (isDemoMode) {
    const u = mem.users.find((x) => x.uid === uid);
    if (u) u.approved = approved;
    return;
  }
  await updateDoc(doc(db!, 'users', uid), { approved });
}

export async function getUserById(uid: string): Promise<AppUser | null> {
  if (isDemoMode) return mem.users.find((u) => u.uid === uid) ?? null;
  const snap = await getDoc(doc(db!, 'users', uid));
  return snap.exists() ? { uid, ...(snap.data() as Omit<AppUser, 'uid'>) } : null;
}

// ---------- CLASSES ----------
export async function getClasses(): Promise<SchoolClass[]> {
  if (isDemoMode) return [...demoClasses];
  const snap = await getDocs(collection(db!, 'classes'));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SchoolClass, 'id'>) }));
}

export async function getStudentsInClass(classId: string): Promise<AppUser[]> {
  if (isDemoMode) return mem.users.filter((u) => u.role === 'student' && u.classId === classId);
  const q = query(collection(db!, 'users'), where('role', '==', 'student'), where('classId', '==', classId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<AppUser, 'uid'>) }));
}

// ---------- ATTENDANCE ----------
export async function getAttendance(date: string, classId: string): Promise<AttendanceRecord | null> {
  const id = `${date}_${classId}`;
  if (isDemoMode) return mem.attendance.find((a) => a.id === id) ?? null;
  const snap = await getDoc(doc(db!, 'attendance', id));
  return snap.exists() ? ({ id, ...(snap.data() as Omit<AttendanceRecord, 'id'>) }) : null;
}

export async function saveAttendance(rec: AttendanceRecord): Promise<void> {
  if (isDemoMode) {
    const idx = mem.attendance.findIndex((a) => a.id === rec.id);
    if (idx >= 0) mem.attendance[idx] = rec;
    else mem.attendance.push(rec);
    return;
  }
  const { id, ...data } = rec;
  await setDoc(doc(db!, 'attendance', id), data, { merge: true });
}
