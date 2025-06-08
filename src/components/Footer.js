// src/components/Footer.js
'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('common.footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-orange-50 border-t border-orange-200 text-gray-700 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-orange-600">Fury Foods</h2>
          <p className="text-sm">{t('copyright', { year: currentYear })}</p>
        </div>

        <div className="flex space-x-6">
          <Link href="/about" className="hover:text-orange-600 transition">
            {t('about')}
          </Link>
          <Link href="/privacy" className="hover:text-orange-600 transition">
            {t('privacy')}
          </Link>
          <Link href="/terms" className="hover:text-orange-600 transition">
            {t('terms')}
          </Link>
          <Link href="/contact" className="hover:text-orange-600 transition">
            {t('contact')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
