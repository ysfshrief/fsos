import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from '@/lib/locale-context';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'مدرسة الراهبات الفرنسيسكانيات الخاصة بدمنهور | Franciscan School OS',
  description: 'Franciscan Sisters Private School – Damanhour. Since 1936.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LocaleProvider>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
