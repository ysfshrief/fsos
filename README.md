# 🏫 Franciscan School OS — مدرسة الراهبات الفرنسيسكانيات الخاصة بدمنهور

نظام إدارة مدرسي كامل + موقع عام | Next.js 14 + TypeScript + Tailwind + Firebase

**Designed & Developed by: Youssef Shrief / Joe Industries**

---

## ⚡ ملخص سريع

| الميزة | الحالة |
|---|---|
| موقع عام (Home / About / Admissions / News / Library) | ✅ |
| 3 لغات (عربي RTL / EN / FR) مع مبدّل فوري | ✅ |
| تسجيل دخول Firebase حقيقي + إنشاء حسابات | ✅ |
| موافقة الإدارة على الحسابات الجديدة (RBAC) | ✅ |
| بوابة الطالب (درجات + واجبات حقيقية من Firestore) | ✅ |
| بوابة ولي الأمر (متابعة الأبناء) | ✅ |
| بوابة المعلم (حضور وغياب + رصد درجات + إضافة واجبات) | ✅ |
| لوحة الإدارة (موافقات + إدارة أخبار الموقع) | ✅ |
| Demo Mode: يشتغل فورًا بدون Firebase ببيانات تجريبية | ✅ |
| Firestore Security Rules جاهزة | ✅ ملف firestore.rules |

---

## 🧪 وضع التجربة (Demo Mode)

**لو رفعت المشروع على Vercel من غير ما تضيف بيئات Firebase** → هيشتغل تلقائيًا في وضع التجربة:

- بيانات وهمية كاملة (طلاب، درجات، واجبات، أخبار)
- حسابات تجريبية جاهزة:

| الدور | Email | Password |
|---|---|---|
| طالب | student@demo.com | demo1234 |
| ولي أمر | parent@demo.com | demo1234 |
| معلم | teacher@demo.com | demo1234 |
| إدارة | admin@demo.com | demo1234 |

ده مثالي **لعرض المشروع على المدرسة قبل تجهيز Firebase**.

---

# 🔥 خطوات Firebase (بالترتيب)

## الخطوة 1 — إنشاء المشروع
1. افتح https://console.firebase.google.com
2. **Add project** → اسم المشروع: `franciscan-school` (أو أي اسم)
3. Google Analytics: **عطّله** (مش محتاجينه) → **Create project**

## الخطوة 2 — تفعيل Authentication
1. من القائمة الجانبية: **Build → Authentication**
2. اضغط **Get started**
3. تبويب **Sign-in method** → اختر **Email/Password**
4. فعّل الخيار الأول (Email/Password) → **Save**

## الخطوة 3 — إنشاء Firestore Database
1. من القائمة: **Build → Firestore Database**
2. **Create database**
3. Location: اختر **eur3 (europe-west)** — الأقرب لمصر
4. ابدأ بـ **Production mode** → **Create**

## الخطوة 4 — رفع قواعد الأمان (Rules)
1. في Firestore → تبويب **Rules**
2. امسح الموجود والصق محتوى ملف **`firestore.rules`** (موجود في جذر المشروع)
3. **Publish**

## الخطوة 5 — الحصول على بيانات الاتصال (Config)
1. اضغط ⚙️ **Project settings** (جنب Project Overview)
2. انزل تحت لقسم **Your apps** → اضغط أيقونة الويب **`</>`**
3. App nickname: `school-web` → **Register app** (بدون Hosting)
4. هيظهرلك كود فيه `firebaseConfig` — **انسخ القيم دي** (هنحتاجها في Vercel):

```
apiKey: "AIza..."
authDomain: "franciscan-school.firebaseapp.com"
projectId: "franciscan-school"
storageBucket: "franciscan-school.appspot.com"
messagingSenderId: "1234567890"
appId: "1:1234..."
```

## الخطوة 6 — إنشاء أول حساب إدارة (Admin)
> الحسابات الجديدة بتتسجل بحالة "معلقة" وتحتاج موافقة إدارة — فلازم أول admin يتعمل يدويًا:

1. افتح موقعك بعد النشر → صفحة **إنشاء حساب** → سجّل بإيميلك (اختر أي دور)
2. ارجع Firebase Console → **Authentication → Users** → انسخ الـ **User UID**
3. روح **Firestore Database → users → المستند بنفس الـ UID**
4. عدّل الحقول:
   - `role` → `admin`
   - `approved` → `true`
5. سجّل دخول من الموقع → هتدخل على لوحة الإدارة ✅
6. من لوحة الإدارة → **إدارة المستخدمين** → وافق على باقي الحسابات

## الخطوة 7 — ربط الطلاب بالفصول وأولياء الأمور (من Firestore مباشرة حاليًا)
- **الفصول**: أنشئ collection اسمها `classes` → مستند بـ ID مثل `class-3a`:
  ```json
  { "name": "الصف الثالث أ", "studentIds": [] }
  ```
- **الطالب**: في مستند المستخدم أضف حقل `classId: "class-3a"`
- **ولي الأمر**: أضف حقل `childrenIds` (array) فيه UIDs الأبناء

---

# 🚀 خطوات النشر على Vercel

## الطريقة الأولى: عبر GitHub (المفضلة)
1. ارفع محتويات هذا المجلد على GitHub repo جديد (بدون node_modules — الـ .gitignore جاهز)
2. https://vercel.com → **Add New → Project** → اختر الـ repo
3. Framework Preset: **Next.js** (هيتحدد تلقائيًا)
4. **قبل الضغط على Deploy** → افتح **Environment Variables** وأضف الستة دول (من الخطوة 5 فوق):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | AIza... |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | xxx.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | xxx |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | xxx.appspot.com |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 1234567890 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 1:1234... |

5. **Deploy** 🎉

> 💡 لو نشرت **بدون** المتغيرات → الموقع هيشتغل Demo Mode تلقائيًا (مفيد للعرض).
> بعد إضافة المتغيرات لاحقًا اعمل **Redeploy** من Vercel dashboard.

## الخطوة الأخيرة — السماح للدومين في Firebase
1. Firebase Console → **Authentication → Settings → Authorized domains**
2. **Add domain** → أضف دومين Vercel بتاعك مثل `franciscan-school.vercel.app`

---

## 💻 التشغيل محليًا

```bash
npm install
cp .env.example .env.local   # واملأ القيم (أو سيبها فاضية لوضع التجربة)
npm run dev
# http://localhost:3000
```

---

## 📁 هيكل المشروع

```
app/
  page.tsx              → الرئيسية
  about/ admissions/ news/ library/   → الموقع العام
  login/ register/      → المصادقة
  portal/
    layout.tsx          → حارس الأدوار + Sidebar
    student/            → لوحة + درجات + واجبات
    parent/             → متابعة الأبناء
    teacher/            → لوحة + حضور + رصد درجات + واجبات
    admin/              → لوحة + مستخدمون + أخبار
components/             → PublicNav, Footer, KpiCard, LangSwitcher
lib/
  firebase.ts           → التهيئة + كشف Demo Mode
  auth-context.tsx      → Auth + جلسة Demo
  db.ts                 → كل عمليات Firestore (+ fallback تجريبي)
  i18n.ts               → قواميس AR/EN/FR
  demo-data.ts          → البيانات التجريبية
firestore.rules         → قواعد أمان Firestore الجاهزة
```

---

## 🗄️ Collections في Firestore

| Collection | الوصف |
|---|---|
| `users/{uid}` | name, email, role, approved, classId?, childrenIds? |
| `grades/{studentId_subject_term}` | oral, written, practical |
| `homework/{auto}` | classId, subject, title, teacherName, dueDate |
| `attendance/{date_classId}` | records: {studentId: present/absent/late} |
| `news/{auto}` | title, tag, emoji, date |
| `classes/{classId}` | name, studentIds |
