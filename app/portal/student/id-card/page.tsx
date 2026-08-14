'use client';
import { useAuth } from '@/lib/auth-context';
import StudentIdCard from '@/components/StudentIdCard';

export default function StudentIdCardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">🪪 بطاقة الطالب (الكارنيه)</h2>
      <p className="text-sm text-gray-500 mb-6">امسح الكود للتعريف أو تسجيل الحضور. يمكنك طباعته أو تحميله.</p>
      <StudentIdCard student={user} />
    </div>
  );
}
