"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSellerProducts, getSellerInfo, getSellerBanners, getConfig, formatPrice, getSellerCategories } from '@/utils/api';
import ProductCard from '@/components/ProductCard';
import CartIcon from '@/components/CartIcon';
import Header from '@/components/Header';
import clsx from 'clsx';
import Copyright from '@/components/Copyright';
import { WEB_CONSTANTS } from './web_constantsthe';
import ContactInfoBlock from '@/components/ContactInfoBlock';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../i18n';

export default function Home() {
  const { language } = useLanguage();
  const [productList, setProductList] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | number>('all');
  const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});
  const [showInitialLoading, setShowInitialLoading] = useState(false);

  useEffect(() => {
    // Only show spinner if first visit in this session
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    if (!hasVisited) {
      setShowInitialLoading(true);
      sessionStorage.setItem('hasVisitedHome', 'true');
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [configRes, productsRes, sellerRes, categoriesRes] = await Promise.all([
          getConfig(),
          getSellerProducts({ limit: '1000', offset: '1' }),
          getSellerInfo(),
          getSellerCategories()
        ]);
        setConfig(configRes);
        setSeller(sellerRes);
        setCategories(categoriesRes || []);
        setProductList(productsRes?.products || []);
        // Group products by category
        const byCat: Record<string, any[]> = {};
        (categoriesRes || []).forEach((cat: any) => {
          byCat[cat.id] = [];
        });
        (productsRes?.products || []).forEach((product: any) => {
          const catId = product.category_id || product.categoryId || (product.category && product.category.id);
          if (catId && byCat[catId]) {
            byCat[catId].push(product);
          }
        });
        setProductsByCategory(byCat);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && showInitialLoading) {
      // Hide spinner after data is loaded
      setTimeout(() => setShowInitialLoading(false), 600); // short delay for smoothness
    }
  }, [loading, showInitialLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <svg className="animate-spin h-14 w-14 text-[#991b1b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    );
  }

  // Helper to render products grid
  function ProductsGrid({ products }: { products: any[] }) {
    if (!products || products.length === 0) {
      return <div className="text-center text-gray-400 py-8">لا يوجد منتجات في هذا القسم</div>;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-5">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} config={config} />
        ))}
      </div>
    );
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Shop Banner */}
      <section className="relative p-0 m-0 bg-white">
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-[1200px] mx-auto px-0 md:px-8">
            <div className="relative w-full h-[250px] md:h-[340px] rounded-none overflow-hidden bg-gray-200">
              {seller?.seller?.shop?.banner_full_url?.path ? (
                <Image
                  src={seller.seller.shop.banner_full_url.path}
                  alt={`${seller.seller.shop.name} - Shop Banner`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - horizontal scrollable list */}
      {categories.length > 0 && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 flex justify-center">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-2 md:gap-3 w-max px-2">
                {/* Custom 'All Products' category as pill */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border shadow-sm',
                    selectedCategory === 'all'
                      ? 'bg-[#991b1b] text-white border-[#991b1b] shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-[#991b1b] hover:text-[#991b1b]'
                  )}
                  style={{ minWidth: '80px' }}
                >
                  {seller?.seller?.image_full_url?.path && (
                    <Image
                      src={seller.seller.image_full_url.path}
                      alt="الكل"
                      width={28}
                      height={28}
                      className="rounded-full border border-gray-200 bg-white"
                    />
                  )}
                  <span>{language === 'ar' ? 'الكل' : i18n.t('all')}</span>
                </button>
                {categories.map((category: any) => {
                  const categoryName = category.name || category.title || category.category_name || 'Category';
                  const categoryImage = category.icon_full_url?.path || category.icon || category.image?.path || category.image_full_url?.path;
                  return (
                    <button
                      type="button"
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={clsx(
                        'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border shadow-sm',
                        selectedCategory === category.id
                          ? 'bg-[#991b1b] text-white border-[#991b1b] shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-[#991b1b] hover:text-[#991b1b]'
                      )}
                      style={{ minWidth: '80px' }}
                    >
                      {categoryImage && (
                        <Image
                          src={categoryImage}
                          alt={categoryName}
                          width={28}
                          height={28}
                          className="rounded-full border border-gray-200 bg-white"
                        />
                      )}
                      <span>{categoryName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Category/Product Display */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory === 'all' ? (
            categories.map((category: any) => (
              <div key={category.id} className="mb-10">
                <div className="flex flex-col items-center my-2">
                  <h2 className="text-3xl font-extrabold text-gray-900 text-center tracking-wide mb-2" style={{letterSpacing: '0.02em'}}>
                    {category.name || category.title || category.category_name || 'Category'}
                  </h2>
                  <div className="w-16 h-1 rounded-full bg-[#991b1b] opacity-70 mb-2"></div>
                </div>
                <ProductsGrid products={productsByCategory[category.id] || []} />
              </div>
            ))
          ) : (
            <div>
              <div className="flex flex-col items-center my-2">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center tracking-wide mb-2" style={{letterSpacing: '0.02em'}}>
                  {categories.find((cat: any) => cat.id === selectedCategory)?.name || 'Category'}
                </h2>
                <div className="w-16 h-1 rounded-full bg-[#991b1b] opacity-70 mb-2"></div>
              </div>
              <ProductsGrid products={productsByCategory[selectedCategory] || []} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-xl mx-auto flex flex-col items-center space-y-6 px-4">
          {/* Seller Logo */}
          {seller?.seller?.image_full_url?.path && (
            <Image
              src={seller.seller.image_full_url.path}
              alt="Seller Logo"
              width={80}
              height={80}
              className="rounded-full border border-gray-200 bg-white p-2 shadow mb-2"
            />
          )}
          <ContactInfoBlock />
          {/* Copyright */}
          <Copyright className="mt-6" />
        </div>
      </footer>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden flex justify-around items-center h-16">
        <a href="/" className="flex flex-col items-center justify-center text-xs font-semibold transition-colors group text-[#991b1b] border-t-2 border-[#991b1b] pt-1 w-full">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor"/>
          </svg>
          {language === 'ar' ? 'القائمة' : i18n.t('menu')}
        </a>
        <a href="/orders" className="flex flex-col items-center justify-center text-xs font-semibold transition-colors group text-gray-700 hover:text-[#991b1b] pt-1 w-full">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/>
            <path d="M8 10h8M8 14h5" stroke="currentColor"/>
          </svg>
          {language === 'ar' ? 'حالة الطلب' : i18n.t('order_status')}
        </a>
        <a href="/cart" className="flex flex-col items-center justify-center text-xs font-semibold transition-colors group text-gray-700 hover:text-[#991b1b] pt-1 w-full">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 6h18M7 6v14a2 2 0 002 2h6a2 2 0 002-2V6" stroke="currentColor"/>
            <circle cx="9" cy="21" r="1" stroke="currentColor"/>
            <circle cx="15" cy="21" r="1" stroke="currentColor"/>
          </svg>
          {language === 'ar' ? 'السلة' : i18n.t('cart')}
        </a>
        <a href="/login" className="flex flex-col items-center justify-center text-xs font-semibold transition-colors group text-gray-700 hover:text-[#991b1b] pt-1 w-full">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" stroke="currentColor"/>
            <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke="currentColor"/>
          </svg>
          {language === 'ar' ? 'تسجيل دخول' : i18n.t('login')}
        </a>
        <a href="/more" className="flex flex-col items-center justify-center text-xs font-semibold transition-colors group text-gray-700 hover:text-[#991b1b] pt-1 w-full">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/>
            <path d="M8 8h8M8 12h8M8 16h8" stroke="currentColor"/>
          </svg>
          {language === 'ar' ? 'المزيد' : i18n.t('more')}
        </a>
      </nav>
      <div className="h-20 md:hidden" />
    </div>
  );
}

/* Add this to the bottom of the file if using CSS-in-JS, or add to global CSS if not: */
/*
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
