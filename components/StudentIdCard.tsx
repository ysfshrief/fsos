'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import type { AppUser } from '@/lib/types';

/**
 * A printable student ID card ("كارنيه") with a QR code.
 * The QR encodes the student's uid (and name) so it can be scanned for
 * attendance / identification. Admin can print or download it, then place it
 * on the physical card design.
 */
export default function StudentIdCard({ student, className }: { student: AppUser; className?: string }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Encode a compact payload the school can scan
    const payload = JSON.stringify({ id: student.uid, n: student.name, r: 'student' });
    QRCode.toDataURL(payload, {
      margin: 1,
      width: 260,
      color: { dark: '#6E1E2B', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [student.uid, student.name]);

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${student.name.replace(/\s+/g, '-')}.png`;
    a.click();
  };

  return (
    <div className={className}>
      <div ref={cardRef}
        className="mx-auto w-[340px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
        {/* Header */}
        <div className="p-4 text-white text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Image src="/logo.png" alt="Logo" width={34} height={34} className="brightness-125" />
            <div className="text-[13px] font-bold leading-tight">مدرسة الراهبات<br />الفرنسيسكانيات</div>
          </div>
          <div className="text-[10px] text-white/70">بطاقة طالب — Student ID</div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col items-center">
          {qrDataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={qrDataUrl} alt="QR" className="w-40 h-40" />
          ) : (
            <div className="w-40 h-40 bg-gray-100 rounded-lg animate-pulse" />
          )}
          <div className="mt-4 text-center">
            <div className="text-lg font-bold text-burgundy">{student.name}</div>
            {student.classId && (
              <div className="text-xs text-gray-500 mt-0.5">الفصل: {student.classId}</div>
            )}
            <div className="text-[10px] text-gray-400 mt-1" dir="ltr">ID: {student.uid.slice(0, 10)}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gold-pale px-4 py-2 text-center text-[10px] text-burgundy font-semibold">
          امسح الكود للتعريف والحضور
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2 mt-4">
        <button onClick={downloadQr}
          className="px-4 py-2 rounded-lg bg-burgundy text-white text-xs font-bold hover:bg-burgundy/90">
          ⬇️ تحميل الـ QR
        </button>
        <button onClick={() => window.print()}
          className="px-4 py-2 rounded-lg bg-gold text-white text-xs font-bold hover:bg-gold/90">
          🖨️ طباعة البطاقة
        </button>
      </div>
    </div>
  );
}
