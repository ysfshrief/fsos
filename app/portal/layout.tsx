'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { isDemoMode } from '@/lib/firebase';
import LangSwitcher from '@/components/LangSwitcher';
import JoeBadge from '@/components/JoeBadge';

const navByRole: Record<string, { href: string; icon: string; key: string }[]> = {
  student: [
    { href: '/portal/student', icon: '🏠', key: 'dashboard' },
    { href: '/portal/student/grades', icon: '📊', key: 'myGrades' },
    { href: '/portal/student/homework', icon: '📝', key: 'homework' },
  ],
  parent: [
    { href: '/portal/parent', icon: '🏠', key: 'dashboard' },
  ],
  teacher: [
    { href: '/portal/teacher', icon: '🏠', key: 'dashboard' },
    { href: '/portal/teacher/attendance', icon: '📅', key: 'attendance' },
    { href: '/portal/teacher/grading', icon: '📊', key: 'gradeEntry' },
    { href: '/portal/teacher/homework', icon: '📝', key: 'homework' },
  ],
  admin: [
    { href: '/portal/admin', icon: '📊', key: 'dashboard' },
    { href: '/portal/admin/users', icon: '👥', key: 'users' },
    { href: '/portal/admin/news', icon: '📰', key: 'newsManage' },
  ],
};

const roleGradients: Record<string, string> = {
  student: 'linear-gradient(135deg,#6E1E2B,#8B2535)',
  parent: 'linear-gradient(135deg,#7C3AED,#8B5CF6)',
  teacher: 'linear-gradient(135deg,#059669,#10B981)',
  admin: 'linear-gradient(135deg,#1F2937,#374151)',
};

const roleEmojis: Record<string, string> = {
  student: '👦', parent: '👨', teacher: '👩‍🏫', admin: '⚙️',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const pathRole = pathname.split('/')[2] ?? '';

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== pathRole) router.replace(`/portal/${user.role}`);
  }, [user, loading, pathRole, router]);

  if (loading || !user || user.role !== pathRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
        {t('loading')}
      </div>
    );
  }

  const nav = navByRole[user.role] ?? [];

  return (
    <div className="min-h-screen grid md:grid-cols-[256px_1fr] bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col bg-white border-e border-gray-100 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2.5">
          <Image src="/logo.png" alt="Logo" width={34} height={34} className="object-contain" />
          <div>
            <div className="text-[11px] font-bold text-burgundy leading-tight">{t('schoolName')}</div>
            <div className="text-[9px] text-gray-400">School OS 2026</div>
          </div>
        </div>
        <div className="m-2.5 p-3 rounded-lg flex items-center gap-2.5" style={{ background: roleGradients[user.role] }}>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-base shrink-0">
            {roleEmojis[user.role]}
          </div>
          <div>
            <div className="text-xs font-bold text-white">{user.name}</div>
            <div className="text-[10px] text-white/60">{t(user.role)}</div>
          </div>
        </div>
        <nav className="p-2.5 flex-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-md text-[13px] font-medium mb-0.5 transition
                ${pathname === n.href
                  ? 'bg-burgundy/10 text-burgundy font-bold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}>
              <span className="text-base w-5 text-center">{n.icon}</span>
              {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="p-2.5 border-t border-gray-100">
          <button onClick={async () => { await logout(); router.push('/'); }}
            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-md text-[13px] font-medium text-gray-600 hover:bg-gray-50 w-full">
            <span className="text-base w-5 text-center">🚪</span>{t('logout')}
          </button>
          <div className="mt-2 pt-2.5 border-t border-gray-50 flex justify-center [&_span.text-gold-light]:!text-burgundy [&_span.text-white\\/40]:!text-gray-400">
            <JoeBadge variant="compact" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 h-[62px] flex items-center px-5 gap-3 sticky top-0 z-40">
          <div className="flex-1">
            <div className="text-[15px] font-bold text-gray-800">{t('dashboard')}</div>
            {isDemoMode && <div className="text-[10px] text-amber-600">🧪 {t('demoMode')}</div>}
          </div>
          <LangSwitcher />
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm text-white font-bold"
            style={{ background: 'linear-gradient(135deg,#6E1E2B,#C9A227)' }}>
            {user.name.charAt(0)}
          </div>
        </header>
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Mobile nav */}
          <div className="md:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border
                  ${pathname === n.href ? 'border-burgundy text-burgundy bg-burgundy/5' : 'border-gray-200 text-gray-500 bg-white'}`}>
                {n.icon} {t(n.key)}
              </Link>
            ))}
            <button onClick={async () => { await logout(); router.push('/'); }}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-500 bg-white">
              🚪 {t('logout')}
            </button>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
