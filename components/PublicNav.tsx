'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/locale-context';
import { getSiteSettings } from '@/lib/db';
import { resolveImageUrl } from '@/lib/drive';
import type { SiteSettings } from '@/lib/types';
import LangSwitcher from './LangSwitcher';

const allLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/admissions', key: 'admissions' },
  { href: '/hall-of-fame', key: 'hallOfFame' },
  { href: '/courses', key: 'courses' },
  { href: '/staff', key: 'staff' },
  { href: '/facilities', key: 'facilities' },
  { href: '/activities', key: 'activities' },
  { href: '/partnerships', key: 'partnerships' },
  { href: '/careers', key: 'careers' },
  { href: '/social-specialist', key: 'socialSpecialist' },
  { href: '/location', key: 'location' },
  { href: '/news', key: 'news' },
  { href: '/library', key: 'library' },
];

const primaryLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/admissions', key: 'admissions' },
  { href: '/hall-of-fame', key: 'hallOfFame' },
  { href: '/activities', key: 'activities' },
  { href: '/news', key: 'news' },
];

export default function PublicNav() {
  const { t, tx } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => { getSiteSettings().then(setSettings).catch(() => {}); }, []);

  const logoSrc = settings?.logoUrl && settings.logoUrl !== '/logo.png'
    ? resolveImageUrl(settings.logoUrl) : '/logo.png';
  const schoolName = tx(settings?.schoolName) || t('schoolName');

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-[70px] bg-ivory/95 backdrop-blur border-b border-ivory-dark flex items-center">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between gap-2">
        {/* Logo + name (name hidden on very small screens) */}
        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0" onClick={() => setOpen(false)}>
          {logoSrc === '/logo.png' ? (
            <Image src="/logo.png" alt="Logo" width={38} height={38} className="object-contain shrink-0" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="Logo" width={38} height={38} className="object-contain shrink-0 w-[38px] h-[38px]" />
          )}
          <div className="leading-tight min-w-0">
            <div className="text-[12px] sm:text-[13px] font-bold text-burgundy truncate">{schoolName}</div>
            <div className="hidden sm:block text-[9px] text-gray-400 truncate">École des Sœurs Franciscaines – Damanhour</div>
          </div>
        </Link>

        {/* Desktop primary links (lg+) */}
        <div className="hidden lg:flex items-center gap-0.5">
          {primaryLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className={`px-2.5 py-2 rounded-md text-[13px] font-medium transition
                ${pathname === l.href ? 'text-burgundy font-bold' : 'text-gray-600 hover:text-burgundy hover:bg-gold-pale'}`}>
              {t(l.key)}
            </Link>
          ))}
          <button onClick={() => setOpen(!open)}
            className={`px-2.5 py-2 rounded-md text-[13px] font-medium transition flex items-center gap-1
              ${open ? 'text-burgundy font-bold bg-gold-pale' : 'text-gray-600 hover:text-burgundy hover:bg-gold-pale'}`}>
            {t('menuMore')} <span className="text-[9px]">▾</span>
          </button>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Lang switcher — hidden on smallest screens (available inside drawer) */}
          <div className="hidden sm:flex"><LangSwitcher /></div>
          <Link href="/login"
            className="hidden md:inline-flex px-3.5 py-2 rounded-md bg-burgundy text-white text-[13px] font-semibold hover:bg-burgundy-light transition whitespace-nowrap">
            🔑 {t('portalLogin')}
          </Link>
          {/* Hamburger (below lg) — always visible, fixed size */}
          <button onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 rounded-md border border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-burgundy transition shrink-0"
            aria-label="menu">
            <span className={`block w-5 h-0.5 bg-burgundy transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-burgundy transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-burgundy transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Drawer (all sizes when open) */}
      {open && (
        <>
          <div className="fixed inset-0 top-[70px] bg-black/40 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-[70px] inset-x-0 bg-ivory border-b border-ivory-dark shadow-xl z-50 max-h-[calc(100vh-70px)] overflow-y-auto">
            {/* Lang switcher inside drawer (for small screens) */}
            <div className="sm:hidden max-w-6xl mx-auto px-4 pt-3 flex justify-center">
              <LangSwitcher />
            </div>
            <div className="max-w-6xl mx-auto p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {allLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`px-3 py-3 rounded-md text-sm font-medium text-center transition
                    ${pathname === l.href ? 'bg-burgundy/10 text-burgundy font-bold' : 'text-gray-700 bg-white border border-gray-100 hover:bg-gold-pale'}`}>
                  {t(l.key)}
                </Link>
              ))}
            </div>
            <div className="max-w-6xl mx-auto p-3 pt-0">
              <Link href="/login" onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light transition">
                🔑 {t('portalLogin')}
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
