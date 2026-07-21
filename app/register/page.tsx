'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { isDemoMode } from '@/lib/firebase';
import type { Role } from '@/lib/types';

const roles: { role: Role; icon: string; key: string }[] = [
  { role: 'student', icon: '🎓', key: 'student' },
  { role: 'parent', icon: '👨‍👩‍👧', key: 'parent' },
  { role: 'teacher', icon: '📚', key: 'teacher' },
  { role: 'driver', icon: '🚌', key: 'driver' },
];

export default function RegisterPage() {
  const { t } = useLocale();
  const { registerUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('يرجى ملء جميع الحقول (كلمة المرور 6 أحرف على الأقل)');
      return;
    }
    setBusy(true);
    try {
      await registerUser(email.trim(), password, name.trim(), role);
      setDone(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'demo-no-register') setError('التسجيل غير متاح في وضع التجربة');
      else if (msg.includes('email-already-in-use')) setError('البريد الإلكتروني مستخدم بالفعل');
      else setError('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 shadow max-w-md text-center border border-gray-100">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-display text-xl font-bold text-burgundy mb-3">تم إنشاء الحساب</h1>
          <p className="text-sm text-gray-600 mb-6">{t('pendingApproval')}</p>
          <Link href="/login" className="inline-block px-6 py-2.5 rounded-xl bg-burgundy text-white text-sm font-semibold">
            {t('login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 shadow w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="mx-auto object-contain mb-3" />
          <h1 className="font-display text-xl font-bold text-burgundy">{t('register')}</h1>
        </div>

        {isDemoMode && (
          <div className="mb-4 bg-amber-500/5 border border-amber-500/25 rounded-lg p-3 text-[11px] text-amber-800">
            🧪 {t('demoMode')}
          </div>
        )}

        {error && <div className="mb-4 bg-red-500/5 border border-red-500/20 text-red-700 rounded-lg p-3 text-xs">{error}</div>}

        <div className="text-xs font-bold text-gray-500 mb-2">{t('chooseRole')}</div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {roles.map((r) => (
            <button key={r.role} onClick={() => setRole(r.role)}
              className={`p-3 rounded-lg border-2 text-center transition
                ${role === r.role ? 'border-burgundy bg-burgundy/5' : 'border-gray-200 hover:border-gold'}`}>
              <div className="text-xl">{r.icon}</div>
              <div className="text-[11px] font-bold text-gray-700 mt-1">{t(r.key)}</div>
            </button>
          ))}
        </div>

        <div className="space-y-3.5 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('name')}</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('email')}</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" dir="ltr"
              className="w-full px-4 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('password')}</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" dir="ltr"
              className="w-full px-4 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
          </div>
        </div>

        <button onClick={handleRegister} disabled={busy}
          className="w-full py-3 rounded-xl bg-burgundy text-white font-semibold hover:bg-burgundy-light transition disabled:opacity-60">
          {busy ? '...' : t('register')}
        </button>

        <div className="mt-4 text-center text-xs text-gray-400">
          {t('haveAccount')}{' '}
          <Link href="/login" className="text-burgundy font-semibold hover:underline">{t('login')}</Link>
        </div>
      </div>
    </div>
  );
}
