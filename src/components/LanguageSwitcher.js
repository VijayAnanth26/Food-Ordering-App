'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Supported locales — must match those in routing.js
  const locales = ['en', 'es'];

  // Change locale by using next-intl router
  const handleChange = (e) => {
    const newLocale = e.target.value;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="border border-gray-300 rounded-md p-1 text-sm"
      aria-label="Select language"
    >
      {locales.map((localeOption) => (
        <option key={localeOption} value={localeOption}>
          {localeOption.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
