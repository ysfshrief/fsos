'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { isDemoMode } from '@/lib/firebase';
import LangSwitcher from '@/components/LangSwitcher';
import JoeBadge from '@/components/JoeBadge';

const demoAccounts = [
  { email: 'student@demo.com', roleKey: 'student', icon: '🎓' },
  { email: 'parent@demo.com', roleKey: 'parent', icon: '👨‍👩‍👧' },
  { email: 'teacher@demo.com', roleKey: 'teacher', icon: '📚' },
  { email: 'admin@demo.com', roleKey: 'admin', icon: '⚙️' },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(isDemoMode ? 'student@demo.com' : '');
  const [password, setPassword] = useState(isDemoMode ? 'demo1234' : '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Prefill demo credentials based on ?role= from the portal cards
  useEffect(() => {
    if (!isDemoMode) return;
    const role = searchParams.get('role');
    const match = demoAccounts.find((a) => a.roleKey === role);
    if (match) {
      setEmail(match.email);
      setPassword('demo1234');
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setError('');
    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      router.push(`/portal/${user.role}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'pending-approval') setError(t('pendingApproval'));
      else setError('بيانات الدخول غير صحيحة');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Visual side */}
      <div className="hidden md:flex flex-col items-center justify-center p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg,#4A1219,#6E1E2B 55%,#8B2535)' }}>
        <Image src="/logo.png" alt="Logo" width={150} height={150} className="object-contain drop-shadow-2xl mb-7 animate-float" />
        <div className="text-2xl font-bold text-white text-center mb-1.5">{t('schoolName')}</div>
        <div className="font-display italic text-sm text-white/60 mb-1.5">École des Sœurs Franciscaines – Damanhour</div>
        <div className="font-display italic text-xs text-white/40 mb-10">&quot;Veritas, Pax et Bonum&quot;</div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-[340px]">
          {[['1936', t('founded')], ['2,400', t('students')], ['98%', t('successRate')]].map(([n, l]) => (
            <div key={l} className="bg-white/[.08] border border-white/10 rounded-xl p-3.5 text-center">
              <span className="text-xl font-bold text-gold-light block">{n}</span>
              <span className="text-[10px] text-white/55">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form side */}
      <div className="bg-ivory flex flex-col items-center justify-center p-10 md:p-14">
        <div className="w-full max-w-[390px]">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-burgundy mb-7">
            ← {t('backToSite')}
          </Link>
          <h1 className="font-display text-2xl font-bold text-burgundy mb-1">{t('welcome')} 👋</h1>
          <p className="text-[13px] text-gray-500 mb-7">{t('loginSub')}</p>

          <div className="mb-6"><LangSwitcher /></div>

          {isDemoMode && (
            <div className="mb-5 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
              <div className="text-[11px] text-blue-800 mb-2">🧪 {t('demoMode')}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {demoAccounts.map((acc) => {
                  const active = email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => { setEmail(acc.email); setPassword('demo1234'); setError(''); }}
                      className={`px-2 py-1.5 rounded-md border text-[11px] font-semibold transition text-start
                        ${active
                          ? 'border-burgundy bg-burgundy/5 text-burgundy'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gold'}`}
                    >
                      {acc.icon} {t(acc.roleKey)}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 font-mono text-[10px] text-blue-800/70">
                {email || 'اختر بوابة'} · password: <b>demo1234</b>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-500/5 border border-red-500/20 text-red-700 rounded-lg p-3 text-xs">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('email')}</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" dir="ltr"
              className="w-full px-4 py-2.5 rounded-md border-2 border-gray-200 bg-white text-sm outline-none focus:border-burgundy transition" />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('password')}</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" dir="ltr"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2.5 rounded-md border-2 border-gray-200 bg-white text-sm outline-none focus:border-burgundy transition" />
          </div>

          <button onClick={handleLogin} disabled={busy}
            className="w-full py-3 rounded-xl bg-burgundy text-white font-semibold hover:bg-burgundy-light transition disabled:opacity-60">
            {busy ? '...' : `${t('login')} ←`}
          </button>

          {!isDemoMode && (
            <div className="mt-5 text-center text-xs text-gray-400">
              {t('noAccount')}{' '}
              <Link href="/register" className="text-burgundy font-semibold hover:underline">{t('register')}</Link>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-center">
            <JoeBadge width={150} />
          </div>
        </div>
      </div>
    </div>
  );
}
