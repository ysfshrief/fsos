'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { isDemoMode } from '@/lib/firebase';
import LangSwitcher from '@/components/LangSwitcher';
import JoeBadge from '@/components/JoeBadge';

export default function LoginPage() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(isDemoMode ? 'student@demo.com' : '');
  const [password, setPassword] = useState(isDemoMode ? 'demo1234' : '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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
            <div className="mb-5 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-[11px] text-blue-800 leading-relaxed">
              🧪 {t('demoMode')}
              <div className="mt-1 font-mono text-[10px]">
                student@demo.com · parent@demo.com<br />teacher@demo.com · admin@demo.com<br />
                password: <b>demo1234</b>
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
            <div className="[&_span.text-gold-light]:!text-burgundy [&_span.text-white\\/40]:!text-gray-400">
              <JoeBadge variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
