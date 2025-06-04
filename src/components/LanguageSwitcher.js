'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Supported locales — adjust if needed
  const locales = ['en', 'es'];

  // Extract current locale from pathname: /en/restaurants => 'en'
  const segments = pathname.split('/');
  const currentLocale = segments[1] || 'en';

  // Change locale by replacing segment[1]
  const handleChange = (e) => {
    const newLocale = e.target.value;

    // Replace the locale segment in URL path
    segments[1] = newLocale;
    const newPath = segments.join('/') || '/';

    router.push(newPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      className="border border-gray-300 rounded-md p-1 text-sm"
      aria-label="Select language"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
