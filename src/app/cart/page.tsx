'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { formatPrice } from '@/utils/api';
import CartIcon from '@/components/CartIcon';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useLanguage } from '../../context/LanguageContext';
import i18n from '../../i18n';

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, loadCart } = useCart();
  const { language } = useLanguage();
  const [config, setConfig] = useState<any>(null);
  const router = useRouter();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // Load config for price formatting
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('https://awisapp.com/api/v1/config');
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };
    loadConfig();
  }, []);

  const handleQuantityChange = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(cartId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    setPendingDeleteId(cartId);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId !== null) {
      try {
        await removeFromCart(pendingDeleteId);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const getImageUrl = (item: any) => {
    // Try to get image from product info first, then fallback to thumbnail
    if (item.product?.thumbnail_full_url?.path) {
      return item.product.thumbnail_full_url.path;
    }
    if (item.thumbnail) {
      return `https://awisapp.com/storage/app/public/product/thumbnail/${item.thumbnail}`;
    }
    return '/placeholder-product.jpg';
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center py-2 border-b border-gray-100 min-h-[48px]">
              <Link href="/" aria-label="Back to home" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]">
                <svg className="w-5 h-5 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="mx-auto flex flex-col items-center w-full">
                <h1 className="text-xl font-bold text-gray-900 truncate max-w-xs md:max-w-lg text-center w-full mt-1">{language === 'ar' ? 'قم بمراجعة طلبك' : i18n.t('review_order')}</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">{language === 'ar' ? 'جاري تحميل السلة...' : 'Loading cart...'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{language === 'ar' ? 'خطأ:' : 'Error:'} {state.error}</p>
            <button 
              onClick={loadCart}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {language === 'ar' ? 'إعادة المحاولة' : i18n.t('retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    // Prevent scrolling when cart is empty
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Bar: only show on mobile */}
        <header className="bg-white shadow-sm block md:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center py-2 border-b border-gray-100 min-h-[48px]">
              <Link href="/" aria-label="Back to home" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]">
                <svg className="w-5 h-5 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="mx-auto flex flex-col items-center w-full">
                <h1 className="text-xl font-bold text-gray-900 truncate max-w-xs text-center w-full mt-1">{language === 'ar' ? 'سلة التسوق' : i18n.t('cart')}</h1>
              </div>
            </div>
          </div>
        </header>
        {/* Body: below bar on mobile, centered on desktop */}
        <div
          className="flex-1 w-full px-4 py-8 md:py-12 flex flex-col items-center md:justify-center"
          dir="rtl"
        >
          <div className="w-full max-w-md mx-auto flex flex-col items-center">
            <Image
              src="/bag-dark.png"
              alt="سلة التسوق فارغة"
              width={96}
              height={96}
              className="mx-auto mb-6 w-24 h-24 md:w-32 md:h-32 object-contain"
              priority
            />
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">{language === 'ar' ? 'سلة التسوق الخاصة بك فارغة' : i18n.t('cart_empty')}</div>
            <div className="text-base md:text-lg text-gray-600 mb-8 text-center">{language === 'ar' ? 'ابدأ التسوق واختر المنتج المناسب' : i18n.t('start_shopping_message')}</div>
            <Link
              href="/"
              className="inline-block bg-[#8B2323] hover:bg-[#a03a3a] text-white font-bold rounded-lg px-8 py-3 text-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
            >
              {language === 'ar' ? 'ابدأ التسوق' : i18n.t('start_shopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    // Restore scrolling when cart is not empty
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-2 border-b border-gray-100 min-h-[48px]">
            <Link href="/" aria-label="Back to home" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]">
              <svg className="w-5 h-5 text-[#991b1b]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="mx-auto flex flex-col items-center w-full">
              <h1 className="text-xl font-bold text-gray-900 truncate max-w-xs md:max-w-lg text-center w-full mt-1">{language === 'ar' ? 'قم بمراجعة طلبك' : i18n.t('review_order')}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'عناصر السلة' : i18n.t('cart_items')} ({state.totalItems})
                </h2>
                
                <div className="space-y-4">
                  {state.items.map((item) => {
                    const isRTL = language === 'ar';
                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 border rounded-lg bg-white shadow-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                        dir="ltr"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border bg-gray-50 flex items-center justify-center">
                          <Image
                            src={getImageUrl(item)}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {/* Product Info */}
                        <div className="flex flex-col flex-1 min-w-0">
                          {/* Product Name */}
                          <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}> 
                            <span className="font-semibold text-gray-900 text-base mb-2 truncate inline-block max-w-full">{item.name}</span>
                          </div>
                          {/* Quantity Controls, Delete, Price */}
                          <div className={`flex items-center gap-2 mt-auto w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-red-400 flex items-center justify-center text-red-700 text-lg font-bold disabled:text-gray-300 disabled:bg-gray-50"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-base font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-red-400 flex items-center justify-center text-red-700 text-lg font-bold"
                            >
                              +
                            </button>
                            {/* Delete Icon */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-red-600"
                              title={isRTL ? 'حذف' : i18n.t('delete')}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            {/* Price */}
                            <span className="text-base font-bold text-gray-900">
                              {formatPrice((item.price - item.discount) * item.quantity, config)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Promo Code Section */}
            <div className="my-6">
              <div className="bg-white rounded-lg shadow p-4 max-w-md mx-auto">
                <div className="mb-2">
                  <span className="block text-gray-800 font-semibold text-base mb-2">{language === 'ar' ? 'رمز الخصم' : i18n.t('promo_code')}</span>
                </div>
                <div className={`flex items-center gap-3 w-full ${language === 'ar' ? 'flex-row' : 'flex-row'}`}>
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'أدخل رمز الخصم' : i18n.t('enter_promo_code')}
                    className={`flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base ${language === 'ar' ? 'text-right' : 'text-left'}`}
                  />
                  <button
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors text-base font-semibold whitespace-nowrap"
                  >
                    {language === 'ar' ? 'تطبيق' : i18n.t('apply')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{language === 'ar' ? 'ملخص الطلب' : i18n.t('order_summary')}</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{language === 'ar' ? 'المجموع الفرعي' : i18n.t('subtotal')}</span>
                  <span className="font-medium">{formatPrice(state.subtotal, config)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{language === 'ar' ? 'المجموع' : i18n.t('total')}</span>
                    <span>{formatPrice(state.total, config)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors mt-6"
                onClick={() => router.push('/checkout')}
              >
                {language === 'ar' ? 'إتمام الطلب' : i18n.t('proceed_to_checkout')}
              </button>
              
              <Link 
                href="/products"
                className="block w-full text-center text-blue-600 hover:text-blue-800 mt-4"
              >
                {language === 'ar' ? 'مواصلة التسوق' : i18n.t('continue_shopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-20 md:hidden" />
      <ConfirmDialog
        open={pendingDeleteId !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        message={language === 'ar' ? 'هل انت متأكد من حذف هذا المنتج من سلة التسوق؟' : i18n.t('delete_confirmation')}
        confirmText={language === 'ar' ? 'نعم' : i18n.t('yes')}
        cancelText={language === 'ar' ? 'لا' : i18n.t('no')}
      />
    </div>
  );
} 