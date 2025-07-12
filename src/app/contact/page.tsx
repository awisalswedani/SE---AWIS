"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { WEB_CONSTANTS } from "../web_constantsthe";
import { getSellerInfo } from "../../utils/api";
import ContactInfoBlock from '@/components/ContactInfoBlock';
import { useLanguage } from '../../context/LanguageContext';
import i18n from '../../i18n';

export default function ContactPage() {
  const { language } = useLanguage();
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getSellerInfo().then(seller => {
      const logoUrl = seller?.seller?.image_full_url?.path || seller?.seller?.shop?.logo_full_url?.path || null;
      setLogo(logoUrl);
      setLoading(false);
    });
    // Prevent scrolling
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center" dir="rtl">
      {/* Top Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-2 border-b border-gray-100 min-h-[48px]">
            <Link href="/" aria-label="Back to home" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]">
              <svg className="w-5 h-5 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="mx-auto text-xl font-bold text-gray-900 truncate max-w-xs md:max-w-lg text-center w-full">{language === 'ar' ? 'اتصل بنا' : i18n.t('contact')}</h1>
          </div>
        </div>
      </header>
      {/* Body */}
      <main className="flex flex-col items-center w-full flex-1 justify-start px-4 pt-8 pb-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center w-full h-[300px]">
            <svg className="animate-spin h-12 w-12 text-[#991b1b] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-[#991b1b] text-lg font-semibold">{language === 'ar' ? 'جاري التحميل...' : i18n.t('loading')}</span>
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col md:flex-row md:items-start md:gap-8">
            {/* Seller Logo */}
            <div className="flex justify-center md:justify-start mb-4 md:mb-0">
              <div className="rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center" style={{ width: 110, height: 110 }}>
                {logo && (
                  <Image
                    src={logo}
                    alt="شعار المتجر"
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                    priority
                  />
                )}
              </div>
            </div>
            {/* Contact Info Block */}
            <div className="w-full max-w-md bg-white rounded-lg shadow p-6 flex flex-col gap-6">
              <ContactInfoBlock />
            </div>
          </div>
        )}
      </main>
      <div className="h-20 md:hidden" />
    </div>
  );
} 