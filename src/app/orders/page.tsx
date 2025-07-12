"use client";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from '../../context/LanguageContext';
import i18n from '../../i18n';

export default function OrderStatusPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [orderCode, setOrderCode] = useState("");
  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar (same as product details) */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-2 border-b border-gray-100 min-h-[48px]">
            <Link href="/" aria-label="Back to home" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]">
              <svg className="w-5 h-5 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="mx-auto text-xl font-bold text-gray-900 truncate max-w-xs md:max-w-lg text-center w-full">{isRTL ? i18n.t('order_status') : i18n.t('order_status')}</h1>
          </div>
        </div>
      </header>
      {/* Body */}
      <main className="flex flex-col items-center px-4 pt-8 pb-12 min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6 flex flex-col gap-6">
          <p className={`text-gray-700 text-center text-base md:text-lg font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? i18n.t('order_status_hint') : i18n.t('order_status_hint')}</p>
          <label className={`block ${isRTL ? 'text-right' : 'text-left'} text-gray-900 font-semibold text-base md:text-lg mb-1`}>{isRTL ? i18n.t('order_code') : i18n.t('order_code')}</label>
          <input
            type="text"
            className={`w-full border border-gray-300 rounded-md px-4 py-3 text-lg ${isRTL ? 'text-right' : 'text-left'} focus:outline-none focus:ring-2 focus:ring-[#991b1b] placeholder-gray-400`}
            placeholder="------"
            value={orderCode}
            onChange={e => setOrderCode(e.target.value)}
            dir="ltr"
            inputMode="text"
            autoComplete="off"
          />
          <button
            className="w-full bg-[#991b1b] text-white py-3 px-4 rounded-md hover:bg-[#b24545] transition-colors text-lg font-bold mt-2 shadow"
            type="button"
          >
            {isRTL ? i18n.t('search_now') : i18n.t('search_now')}
          </button>
        </div>
      </main>
      <div className="h-20 md:hidden" />
    </div>
  );
} 