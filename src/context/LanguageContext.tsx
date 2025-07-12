import React, { createContext, useContext, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext({
  language: 'ar',
  direction: 'rtl',
  setLanguage: (lang: string) => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLang] = useState('ar');
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  // Initialize document direction on first load
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLang(lang);
    i18n.changeLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 