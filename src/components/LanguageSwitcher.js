'use client';

import { useRouter, usePathname, locales } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Map of locale codes to their display names
  const localeNames = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Change locale by using next-intl router
  const handleLocaleChange = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 hover:bg-orange-600 text-white focus:outline-none"
        aria-label="Select language"
      >
        <span className="text-lg">{localeNames[locale]?.flag}</span>
        <span className="hidden sm:inline-block">{localeNames[locale]?.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 overflow-hidden">
          {locales.map((localeOption) => (
            <button
              key={localeOption}
              onClick={() => handleLocaleChange(localeOption)}
              className={`w-full text-left flex items-center gap-2 px-4 py-3 hover:bg-orange-50 transition-colors duration-200 ${
                localeOption === locale ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{localeNames[localeOption]?.flag}</span>
              <span>{localeNames[localeOption]?.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
