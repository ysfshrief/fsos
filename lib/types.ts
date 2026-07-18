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

// ============================================================
// CMS — Dynamic content model (Phase 1 infrastructure)
// ============================================================

/** Multilingual text field. Admin can fill any/all languages. */
export interface I18nText {
  ar: string;
  en: string;
  fr: string;
}

/** Global site settings, all editable from the admin panel. */
export interface SiteSettings {
  id: 'site';               // single doc
  // Branding
  logoUrl: string;          // Drive link or /logo.png
  schoolName: I18nText;
  tagline: I18nText;
  // Contact
  phone: string;
  email: string;
  address: I18nText;
  workingHours: I18nText;
  // Social links
  facebook: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
  // Google Maps embed URL (from "Share > Embed a map")
  mapEmbedUrl: string;
  // Homepage stats strip
  statFounded: string;
  statStudents: string;
  statSuccess: string;
  updatedAt: number;
}

/** A generic editable section that can belong to any page. */
export interface Section {
  id: string;
  pageKey: string;          // which page it belongs to (e.g. 'home', 'about')
  type: SectionType;
  title: I18nText;
  subtitle: I18nText;
  body: I18nText;
  imageUrl: string;         // Drive link
  ctaLabel: I18nText;
  ctaHref: string;
  order: number;            // display order within the page
  visible: boolean;         // hide/show without deleting
  updatedAt: number;
}

export type SectionType =
  | 'hero'
  | 'text'
  | 'text-image'
  | 'banner'
  | 'cards'
  | 'gallery'
  | 'cta';

/** A homepage banner / slider item. */
export interface Banner {
  id: string;
  title: I18nText;
  subtitle: I18nText;
  imageUrl: string;         // Drive link
  ctaLabel: I18nText;
  ctaHref: string;
  order: number;
  visible: boolean;
  updatedAt: number;
}

/** Helper: empty multilingual text. */
export const emptyI18n = (): I18nText => ({ ar: '', en: '', fr: '' });

// ============================================================
// Phase 2 — Hall of Fame + Courses
// ============================================================

/** An outstanding student shown on the Hall of Fame page. */
export interface Achiever {
  id: string;
  name: string;            // student name (single language — proper noun)
  photoUrl: string;        // Drive link
  grade: string;           // e.g. 'الصف الثالث الثانوي'
  achievement: I18nText;   // what they achieved
  category: string;        // e.g. 'علمي' | 'رياضي' | 'فني' | 'ثقافي'
  year: string;            // e.g. '2026'
  medal: 'gold' | 'silver' | 'bronze' | 'star';
  certificateUrl: string;  // optional Drive link
  order: number;
  visible: boolean;
  updatedAt: number;
}

/** An extra educational program on the Courses page. */
export interface Course {
  id: string;
  coverUrl: string;        // Drive link
  name: I18nText;
  description: I18nText;
  ageGroup: string;        // e.g. '6-12'
  duration: I18nText;      // e.g. '3 أشهر'
  certificate: boolean;    // grants a certificate?
  registerHref: string;    // registration link / form URL
  order: number;
  visible: boolean;
  updatedAt: number;
}

// ============================================================
// Phase 3 — Staff + Principal Profile + Facilities
// ============================================================

export type StaffCategory = 'administration' | 'teaching' | 'specialist';

/** A staff member card (teacher / vice principal / specialist). */
export interface StaffMember {
  id: string;
  name: string;            // proper noun
  photoUrl: string;        // Drive link
  category: StaffCategory;
  role: I18nText;          // e.g. subject for teachers, "وكيل" for admin, specialty for specialists
  order: number;
  visible: boolean;
  updatedAt: number;
}

/** The Principal's dedicated profile (single doc). */
export interface PrincipalProfile {
  id: 'principal';
  name: string;
  photoUrl: string;        // Drive link
  biography: I18nText;
  qualifications: I18nText;
  experienceYears: string;
  achievements: I18nText;
  message: I18nText;       // Principal's message
  vision: I18nText;        // School vision
  mission: I18nText;       // School mission
  updatedAt: number;
}

/** A school facility with a gallery of Drive image links. */
export interface Facility {
  id: string;
  name: I18nText;
  description: I18nText;
  icon: string;            // emoji
  images: string[];        // Drive links (gallery)
  order: number;
  visible: boolean;
  updatedAt: number;
}

/** Staff group image (single doc) shown at the top of the staff page. */
export interface StaffGroupImage {
  id: 'staff-group';
  imageUrl: string;        // Drive link
  updatedAt: number;
}

// ============================================================
// Phase 4 — Student Activities + Partnerships
// ============================================================

export type ActivityCategory =
  | 'sports' | 'arts' | 'cultural' | 'trips' | 'competitions' | 'celebrations' | 'events';

/** A student activity with gallery + videos. */
export interface Activity {
  id: string;
  title: I18nText;
  description: I18nText;
  category: ActivityCategory;
  coverUrl: string;        // Drive link
  images: string[];        // Drive links (gallery)
  videos: string[];        // Drive / YouTube links
  date: string;            // YYYY-MM-DD
  order: number;
  visible: boolean;
  updatedAt: number;
}

/** A partner organization. */
export interface Partner {
  id: string;
  name: I18nText;
  description: I18nText;
  logoUrl: string;         // Drive link
  website: string;
  order: number;
  visible: boolean;
  updatedAt: number;
}

// ============================================================
// Phase 5 — Careers + Social Specialist
// ============================================================

/** A job application submitted from the Careers page. */
export interface JobApplication {
  id: string;
  fullName: string;
  position: string;
  qualification: string;
  experience: string;
  phone: string;
  email: string;
  cvUrl: string;            // Drive link (applicant pastes share link)
  certificatesUrl: string;  // Drive link (optional)
  status: 'new' | 'reviewed' | 'contacted';
  createdAt: number;
}

/** A confidential message to the Social Specialist. */
export interface SpecialistMessage {
  id: string;
  name: string;             // can be anonymous
  contact: string;          // phone/email how to reach back
  subject: string;
  message: string;
  attachmentUrl: string;    // Drive link (optional)
  preferredTime: string;    // appointment request
  status: 'new' | 'handled';
  createdAt: number;
}
