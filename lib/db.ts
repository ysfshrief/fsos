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

// ============================================================
// CMS data layer (Phase 1)
// ============================================================
import { demoSiteSettings, demoBanners } from './demo-data';
import type { SiteSettings, Section, Banner } from './types';

const cmsMem = {
  settings: { ...demoSiteSettings } as SiteSettings,
  sections: [] as Section[],
  banners: [...demoBanners] as Banner[],
};

// ---------- SITE SETTINGS ----------
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isDemoMode) return { ...cmsMem.settings };
  const snap = await getDoc(doc(db!, 'settings', 'site'));
  if (snap.exists()) return { id: 'site', ...(snap.data() as Omit<SiteSettings, 'id'>) };
  return { ...demoSiteSettings };
}

export async function saveSiteSettings(s: SiteSettings): Promise<void> {
  const data = { ...s, updatedAt: Date.now() };
  if (isDemoMode) { cmsMem.settings = data; return; }
  const { id, ...rest } = data;
  await setDoc(doc(db!, 'settings', 'site'), rest, { merge: true });
}

// ---------- SECTIONS ----------
export async function getSections(pageKey?: string): Promise<Section[]> {
  if (isDemoMode) {
    const all = [...cmsMem.sections].sort((a, b) => a.order - b.order);
    return pageKey ? all.filter((s) => s.pageKey === pageKey) : all;
  }
  const col = collection(db!, 'sections');
  const q = pageKey ? query(col, where('pageKey', '==', pageKey)) : query(col);
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Section, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function saveSection(sec: Omit<Section, 'id'> & { id?: string }): Promise<void> {
  const data = { ...sec, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = cmsMem.sections.findIndex((x) => x.id === data.id);
      if (idx >= 0) cmsMem.sections[idx] = data as Section;
      else cmsMem.sections.push(data as Section);
    } else {
      cmsMem.sections.push({ ...data, id: `sec${Date.now()}` } as Section);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'sections', id), rest, { merge: true });
  else await addDoc(collection(db!, 'sections'), rest);
}

export async function deleteSection(id: string): Promise<void> {
  if (isDemoMode) { cmsMem.sections = cmsMem.sections.filter((s) => s.id !== id); return; }
  await deleteDoc(doc(db!, 'sections', id));
}

// ---------- BANNERS ----------
export async function getBanners(): Promise<Banner[]> {
  if (isDemoMode) return [...cmsMem.banners].sort((a, b) => a.order - b.order);
  const snap = await getDocs(collection(db!, 'banners'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Banner, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function saveBanner(b: Omit<Banner, 'id'> & { id?: string }): Promise<void> {
  const data = { ...b, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = cmsMem.banners.findIndex((x) => x.id === data.id);
      if (idx >= 0) cmsMem.banners[idx] = data as Banner;
      else cmsMem.banners.push(data as Banner);
    } else {
      cmsMem.banners.push({ ...data, id: `ban${Date.now()}` } as Banner);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'banners', id), rest, { merge: true });
  else await addDoc(collection(db!, 'banners'), rest);
}

export async function deleteBanner(id: string): Promise<void> {
  if (isDemoMode) { cmsMem.banners = cmsMem.banners.filter((b) => b.id !== id); return; }
  await deleteDoc(doc(db!, 'banners', id));
}

// ============================================================
// Phase 2 data layer — Hall of Fame + Courses
// ============================================================
import { demoAchievers, demoCourses } from './demo-data';
import type { Achiever, Course } from './types';

const p2Mem = {
  achievers: [...demoAchievers] as Achiever[],
  courses: [...demoCourses] as Course[],
};

// ---------- ACHIEVERS (Hall of Fame) ----------
export async function getAchievers(): Promise<Achiever[]> {
  if (isDemoMode) return [...p2Mem.achievers].sort((a, b) => a.order - b.order);
  const snap = await getDocs(collection(db!, 'achievers'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Achiever, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function saveAchiever(a: Omit<Achiever, 'id'> & { id?: string }): Promise<void> {
  const data = { ...a, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = p2Mem.achievers.findIndex((x) => x.id === data.id);
      if (idx >= 0) p2Mem.achievers[idx] = data as Achiever;
      else p2Mem.achievers.push(data as Achiever);
    } else {
      p2Mem.achievers.push({ ...data, id: `a${Date.now()}` } as Achiever);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'achievers', id), rest, { merge: true });
  else await addDoc(collection(db!, 'achievers'), rest);
}

export async function deleteAchiever(id: string): Promise<void> {
  if (isDemoMode) { p2Mem.achievers = p2Mem.achievers.filter((a) => a.id !== id); return; }
  await deleteDoc(doc(db!, 'achievers', id));
}

// ---------- COURSES ----------
export async function getCourses(): Promise<Course[]> {
  if (isDemoMode) return [...p2Mem.courses].sort((a, b) => a.order - b.order);
  const snap = await getDocs(collection(db!, 'courses'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Course, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function saveCourse(c: Omit<Course, 'id'> & { id?: string }): Promise<void> {
  const data = { ...c, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = p2Mem.courses.findIndex((x) => x.id === data.id);
      if (idx >= 0) p2Mem.courses[idx] = data as Course;
      else p2Mem.courses.push(data as Course);
    } else {
      p2Mem.courses.push({ ...data, id: `c${Date.now()}` } as Course);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'courses', id), rest, { merge: true });
  else await addDoc(collection(db!, 'courses'), rest);
}

export async function deleteCourse(id: string): Promise<void> {
  if (isDemoMode) { p2Mem.courses = p2Mem.courses.filter((c) => c.id !== id); return; }
  await deleteDoc(doc(db!, 'courses', id));
}

// ============================================================
// Phase 3 data layer — Staff + Principal + Facilities
// ============================================================
import { demoStaff, demoPrincipal, demoFacilities, demoStaffGroup } from './demo-data';
import type { StaffMember, PrincipalProfile, Facility, StaffGroupImage } from './types';

const p3Mem = {
  staff: [...demoStaff] as StaffMember[],
  principal: { ...demoPrincipal } as PrincipalProfile,
  facilities: [...demoFacilities] as Facility[],
  staffGroup: { ...demoStaffGroup } as StaffGroupImage,
};

// ---------- STAFF ----------
export async function getStaff(): Promise<StaffMember[]> {
  if (isDemoMode) return [...p3Mem.staff].sort((a, b) => a.order - b.order);
  const snap = await getDocs(collection(db!, 'staff'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<StaffMember, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function saveStaff(m: Omit<StaffMember, 'id'> & { id?: string }): Promise<void> {
  const data = { ...m, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = p3Mem.staff.findIndex((x) => x.id === data.id);
      if (idx >= 0) p3Mem.staff[idx] = data as StaffMember;
      else p3Mem.staff.push(data as StaffMember);
    } else {
      p3Mem.staff.push({ ...data, id: `s${Date.now()}` } as StaffMember);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'staff', id), rest, { merge: true });
  else await addDoc(collection(db!, 'staff'), rest);
}

export async function deleteStaff(id: string): Promise<void> {
  if (isDemoMode) { p3Mem.staff = p3Mem.staff.filter((s) => s.id !== id); return; }
  await deleteDoc(doc(db!, 'staff', id));
}

// ---------- STAFF GROUP IMAGE ----------
export async function getStaffGroupImage(): Promise<StaffGroupImage> {
  if (isDemoMode) return { ...p3Mem.staffGroup };
  const snap = await getDoc(doc(db!, 'settings', 'staff-group'));
  if (snap.exists()) return { id: 'staff-group', ...(snap.data() as Omit<StaffGroupImage, 'id'>) };
  return { ...demoStaffGroup };
}

export async function saveStaffGroupImage(img: StaffGroupImage): Promise<void> {
  const data = { ...img, updatedAt: Date.now() };
  if (isDemoMode) { p3Mem.staffGroup = data; return; }
  const { id, ...rest } = data;
  await setDoc(doc(db!, 'settings', 'staff-group'), rest, { merge: true });
}

// ---------- PRINCIPAL PROFILE ----------
export async function getPrincipal(): Promise<PrincipalProfile> {
  if (isDemoMode) return { ...p3Mem.principal };
  const snap = await getDoc(doc(db!, 'settings', 'principal'));
  if (snap.exists()) return { id: 'principal', ...(snap.data() as Omit<PrincipalProfile, 'id'>) };
  return { ...demoPrincipal };
}

export async function savePrincipal(p: PrincipalProfile): Promise<void> {
  const data = { ...p, updatedAt: Date.now() };
  if (isDemoMode) { p3Mem.principal = data; return; }
  const { id, ...rest } = data;
  await setDoc(doc(db!, 'settings', 'principal'), rest, { merge: true });
}

// ---------- FACILITIES ----------
export async function getFacilities(): Promise<Facility[]> {
  if (isDemoMode) return [...p3Mem.facilities].sort((a, b) => a.order - b.order);
  const snap = await getDocs(collection(db!, 'facilities'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Facility, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function saveFacility(f: Omit<Facility, 'id'> & { id?: string }): Promise<void> {
  const data = { ...f, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = p3Mem.facilities.findIndex((x) => x.id === data.id);
      if (idx >= 0) p3Mem.facilities[idx] = data as Facility;
      else p3Mem.facilities.push(data as Facility);
    } else {
      p3Mem.facilities.push({ ...data, id: `f${Date.now()}` } as Facility);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'facilities', id), rest, { merge: true });
  else await addDoc(collection(db!, 'facilities'), rest);
}

export async function deleteFacility(id: string): Promise<void> {
  if (isDemoMode) { p3Mem.facilities = p3Mem.facilities.filter((f) => f.id !== id); return; }
  await deleteDoc(doc(db!, 'facilities', id));
}

// ============================================================
// Phase 4 data layer — Activities + Partnerships
// ============================================================
import { demoActivities, demoPartners } from './demo-data';
import type { Activity, Partner } from './types';

const p4Mem = {
  activities: [...demoActivities] as Activity[],
  partners: [...demoPartners] as Partner[],
};

// ---------- ACTIVITIES ----------
export async function getActivities(): Promise<Activity[]> {
  if (isDemoMode) return [...p4Mem.activities].sort((a, b) => a.order - b.order);
  const snap = await getDocs(collection(db!, 'activities'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Activity, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function saveActivity(a: Omit<Activity, 'id'> & { id?: string }): Promise<void> {
  const data = { ...a, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = p4Mem.activities.findIndex((x) => x.id === data.id);
      if (idx >= 0) p4Mem.activities[idx] = data as Activity;
      else p4Mem.activities.push(data as Activity);
    } else {
      p4Mem.activities.push({ ...data, id: `act${Date.now()}` } as Activity);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'activities', id), rest, { merge: true });
  else await addDoc(collection(db!, 'activities'), rest);
}

export async function deleteActivity(id: string): Promise<void> {
  if (isDemoMode) { p4Mem.activities = p4Mem.activities.filter((a) => a.id !== id); return; }
  await deleteDoc(doc(db!, 'activities', id));
}

// ---------- PARTNERS ----------
export async function getPartners(): Promise<Partner[]> {
  if (isDemoMode) return [...p4Mem.partners].sort((a, b) => a.order - b.order);
  const snap = await getDocs(collection(db!, 'partners'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Partner, 'id'>) }))
    .sort((a, b) => a.order - b.order);
}

export async function savePartner(p: Omit<Partner, 'id'> & { id?: string }): Promise<void> {
  const data = { ...p, updatedAt: Date.now() };
  if (isDemoMode) {
    if (data.id) {
      const idx = p4Mem.partners.findIndex((x) => x.id === data.id);
      if (idx >= 0) p4Mem.partners[idx] = data as Partner;
      else p4Mem.partners.push(data as Partner);
    } else {
      p4Mem.partners.push({ ...data, id: `p${Date.now()}` } as Partner);
    }
    return;
  }
  const { id, ...rest } = data;
  if (id) await setDoc(doc(db!, 'partners', id), rest, { merge: true });
  else await addDoc(collection(db!, 'partners'), rest);
}

export async function deletePartner(id: string): Promise<void> {
  if (isDemoMode) { p4Mem.partners = p4Mem.partners.filter((p) => p.id !== id); return; }
  await deleteDoc(doc(db!, 'partners', id));
}

// ============================================================
// Phase 5 data layer — Careers + Social Specialist
// ============================================================
import { demoApplications, demoSpecialistMessages } from './demo-data';
import type { JobApplication, SpecialistMessage } from './types';

const p5Mem = {
  applications: [...demoApplications] as JobApplication[],
  messages: [...demoSpecialistMessages] as SpecialistMessage[],
};

// ---------- JOB APPLICATIONS ----------
// Public submit (anyone can apply)
export async function submitApplication(a: Omit<JobApplication, 'id' | 'status' | 'createdAt'>): Promise<void> {
  const data = { ...a, status: 'new' as const, createdAt: Date.now() };
  if (isDemoMode) { p5Mem.applications.unshift({ ...data, id: `app${Date.now()}` }); return; }
  await addDoc(collection(db!, 'applications'), data);
}

// Admin read
export async function getApplications(): Promise<JobApplication[]> {
  if (isDemoMode) return [...p5Mem.applications].sort((a, b) => b.createdAt - a.createdAt);
  const snap = await getDocs(collection(db!, 'applications'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<JobApplication, 'id'>) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function setApplicationStatus(id: string, status: JobApplication['status']): Promise<void> {
  if (isDemoMode) {
    const a = p5Mem.applications.find((x) => x.id === id);
    if (a) a.status = status;
    return;
  }
  await updateDoc(doc(db!, 'applications', id), { status });
}

export async function deleteApplication(id: string): Promise<void> {
  if (isDemoMode) { p5Mem.applications = p5Mem.applications.filter((a) => a.id !== id); return; }
  await deleteDoc(doc(db!, 'applications', id));
}

// ---------- SPECIALIST MESSAGES ----------
// Public submit (confidential)
export async function submitSpecialistMessage(m: Omit<SpecialistMessage, 'id' | 'status' | 'createdAt'>): Promise<void> {
  const data = { ...m, status: 'new' as const, createdAt: Date.now() };
  if (isDemoMode) { p5Mem.messages.unshift({ ...data, id: `msg${Date.now()}` }); return; }
  await addDoc(collection(db!, 'specialist_messages'), data);
}

// Admin read
export async function getSpecialistMessages(): Promise<SpecialistMessage[]> {
  if (isDemoMode) return [...p5Mem.messages].sort((a, b) => b.createdAt - a.createdAt);
  const snap = await getDocs(collection(db!, 'specialist_messages'));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<SpecialistMessage, 'id'>) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function setMessageStatus(id: string, status: SpecialistMessage['status']): Promise<void> {
  if (isDemoMode) {
    const m = p5Mem.messages.find((x) => x.id === id);
    if (m) m.status = status;
    return;
  }
  await updateDoc(doc(db!, 'specialist_messages', id), { status });
}

export async function deleteSpecialistMessage(id: string): Promise<void> {
  if (isDemoMode) { p5Mem.messages = p5Mem.messages.filter((m) => m.id !== id); return; }
  await deleteDoc(doc(db!, 'specialist_messages', id));
}
