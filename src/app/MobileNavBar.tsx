"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useState, useEffect, useRef } from "react";
import Copyright from '@/components/Copyright';
import { WEB_CONSTANTS } from './web_constantsthe';
import CartIcon from '@/components/CartIcon';
import ContactInfoBlock from '@/components/ContactInfoBlock';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../i18n';

export default function MobileNavBar() {
  const pathname = usePathname();
  const { state } = useCart();
  const { language } = useLanguage();
  const [showMore, setShowMore] = useState(false);
  const [isSlidingDown, setIsSlidingDown] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showMore]);

  const [touchDeltaY, setTouchDeltaY] = useState(0);

  // Handle closing with animation
  const closeSheet = () => {
    setIsSlidingDown(true);
    setTimeout(() => {
      setShowMore(false);
      setIsSlidingDown(false);
    }, 350); // match slide down duration
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center justify-center text-xs font-semibold transition-colors group pt-1 w-full ${pathname === "/" ? "text-[#991b1b] border-t-2 border-[#991b1b]" : "text-gray-700 hover:text-[#991b1b]"}`}>
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor"/>
          </svg>
          {language === 'ar' ? 'القائمة' : i18n.t('menu')}
        </Link>
        <Link href="/orders" className={`flex flex-col items-center justify-center text-xs font-semibold transition-colors group pt-1 w-full ${pathname.startsWith("/orders") ? "text-[#991b1b] border-t-2 border-[#991b1b]" : "text-gray-700 hover:text-[#991b1b]"}`}>
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/>
            <path d="M8 10h8M8 14h5" stroke="currentColor"/>
          </svg>
          {language === 'ar' ? 'حالة الطلب' : i18n.t('order_status')}
        </Link>
        <Link href="/cart" className={`relative flex flex-col items-center justify-center text-xs font-semibold transition-colors group pt-1 w-full ${pathname.startsWith("/cart") ? "text-[#991b1b] border-t-2 border-[#991b1b]" : "text-gray-700 hover:text-[#991b1b]"}`}>
          <CartIcon variant="dark" />
          {language === 'ar' ? 'السلة' : i18n.t('cart')}
        </Link>
        <button
          type="button"
          onClick={() => { setShowMore(true); setIsSlidingDown(false); }}
          className={`flex flex-col items-center justify-center text-xs font-semibold transition-colors group pt-1 w-full ${pathname.startsWith("/more") ? "text-[#991b1b] border-t-2 border-[#991b1b]" : "text-gray-700 hover:text-[#991b1b]"}`}
          aria-label={language === 'ar' ? 'المزيد' : i18n.t('more')}
        >
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" />
            <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor" />
          </svg>
          {language === 'ar' ? 'المزيد' : i18n.t('more')}
        </button>
      </nav>
      {/* Bottom Sheet Modal */}
      {showMore && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.2)] transition-opacity" onClick={closeSheet} aria-label="إغلاق المزيد" />
          {/* Sheet */}
          <div
            className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl overflow-hidden max-h-[60vh] min-h-[60vh] flex flex-col ${isSlidingDown ? 'animate-bottomSheetSlideDown' : 'animate-bottomSheetSlideUp'}`}
            style={{
              boxShadow: '0 -8px 32px 0 rgba(0,0,0,0.10)',
              transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
              transition: dragY === 0 ? 'transform 0.25s cubic-bezier(0.4,0,0.2,1)' : undefined,
            }}
            onTouchStart={e => setTouchStartY(e.touches[0].clientY)}
            onTouchMove={e => {
              if (touchStartY !== null) {
                const deltaY = e.touches[0].clientY - touchStartY;
                if (deltaY > 0) setDragY(deltaY);
              }
            }}
            onTouchEnd={() => {
              if (dragY > 80) {
                closeSheet();
              }
              setTouchStartY(null);
              setDragY(0);
            }}
          >
            {/* Header */}
            <div
              ref={headerRef}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-200 touch-none select-none cursor-grab active:cursor-grabbing"
              onTouchStart={e => setTouchStartY(e.touches[0].clientY)}
              onTouchMove={e => {
                if (touchStartY !== null) {
                  const deltaY = e.touches[0].clientY - touchStartY;
                  if (deltaY > 0) setDragY(deltaY);
                }
              }}
              onTouchEnd={() => {
                if (dragY > 80) {
                  setShowMore(false);
                }
                setTouchStartY(null);
                setDragY(0);
              }}
            >
              <span className="text-lg font-bold text-gray-900">{language === 'ar' ? 'المزيد' : i18n.t('more')}</span>
              <button onClick={closeSheet} aria-label={language === 'ar' ? 'إغلاق' : 'Close'} className="text-2xl text-gray-400 hover:text-red-500 focus:outline-none">❌</button>
            </div>
            {/* First Section */}
            <div className="divide-y divide-gray-100">
              <button onClick={() => { setShowMore(false); window.location.href = '/contact'; }} className="w-full flex flex-row-reverse items-center px-4 py-4 text-right hover:bg-gray-50 focus:outline-none">
                <span className="ml-3 flex-shrink-0">{/* icon */}
                  <svg className="w-6 h-6 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92V19a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2h2.09a1 1 0 01.95.68l1.13 3.39a1 1 0 01-.23 1.09l-1.27 1.27a16 16 0 006.6 6.6l1.27-1.27a1 1 0 011.09-.23l3.39 1.13a1 1 0 01.68.95z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="flex-1 text-base font-medium text-gray-900 text-right">{language === 'ar' ? 'اتصل بنا' : i18n.t('contact')}</span>
                <span className="mr-3 flex-shrink-0 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </button>
              <button onClick={() => { setShowMore(false); window.location.href = '/about'; }} className="w-full flex flex-row-reverse items-center px-4 py-4 text-right hover:bg-gray-50 focus:outline-none">
                <span className="ml-3 flex-shrink-0"><svg className="w-6 h-6 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg></span>
                <span className="flex-1 text-base font-medium text-gray-900 text-right">{language === 'ar' ? 'من نحن' : i18n.t('about')}</span>
                <span className="mr-3 flex-shrink-0 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </button>
            </div>
            {/* Second Section */}
            <div className="my-2 border-t border-gray-100" />
            <div className="divide-y divide-gray-100">
              <button onClick={() => { setShowMore(false); window.location.href = '/privacy'; }} className="w-full flex flex-row-reverse items-center px-4 py-4 text-right hover:bg-gray-50 focus:outline-none">
                <span className="ml-3 flex-shrink-0"><svg className="w-6 h-6 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span className="flex-1 text-base font-medium text-gray-900 text-right">{language === 'ar' ? 'سياسة الخصوصية' : i18n.t('privacy_policy')}</span>
                <span className="mr-3 flex-shrink-0 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </button>
              <button className="w-full flex flex-row-reverse items-center px-4 py-4 text-right hover:bg-gray-50 focus:outline-none">
                <span className="ml-3 flex-shrink-0"><svg className="w-6 h-6 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span className="flex-1 text-base font-medium text-gray-900 text-right">{language === 'ar' ? 'اللغة' : i18n.t('language')}</span>
                <span className="mr-3 flex-shrink-0 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </button>
            </div>
            {/* Social Media Section */}
            <ContactInfoBlock className="py-6" onlySocial />
            {/* Footer Section */}
            <Copyright className="mt-2 mb-1" />
            <div className="flex justify-center py-2">
              <img src="/payment-logos.png" alt="طرق الدفع" className="h-8 object-contain" />
            </div>
          </div>
        </>
      )}
    </>
  );
} 