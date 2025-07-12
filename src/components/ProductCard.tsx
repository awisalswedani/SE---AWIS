'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from './CartContext';
import { formatPrice } from '@/utils/api';
import { useRouter } from 'next/navigation';
import i18n from '../i18n';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: any;
  config: any;
}

export default function ProductCard({ product, config }: ProductCardProps) {
  const { addToCart } = useCart();
  const { direction, language } = useLanguage();
  const [isAddingAdd, setIsAddingAdd] = useState(false);
  const [isAddingBuy, setIsAddingBuy] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [isSlidingDown, setIsSlidingDown] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const router = useRouter();

  // Debug logging
  console.log('ProductCard render:', {
    productId: product.id,
    productName: product.name,
    unitPrice: product.unit_price,
    config: config,
    currencyList: config?.currency_list,
    productFull: product
  });

  // Add to cart only (no redirect)
  const handleAddToCartOnly = async (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setIsAddingAdd(true);
    try {
      await addToCart(product.id, 1);
      setShowSuccess(true);
      setIsSlidingUp(true);
      setIsSlidingDown(false);
      setTimeout(() => {
        setIsSlidingUp(false);
        setIsSlidingDown(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsSlidingDown(false);
        }, 350); // slide down duration
      }, 2000); // visible duration
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingAdd(false);
    }
  };

  // Add to cart and go to cart
  const handleBuyNow = async (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setIsAddingBuy(true);
    try {
      await addToCart(product.id, 1);
      router.push('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingBuy(false);
    }
  };

  // Get the correct image URL
  const imageUrl = product.thumbnail_full_url?.path || 
                  (product.images_full_url && product.images_full_url.length > 0 ? product.images_full_url[0].path : null);

  // Format price with debugging
  const formattedPrice = formatPrice(product.unit_price, config);
  console.log('Price formatting:', {
    rawPrice: product.unit_price,
    formattedPrice: formattedPrice,
    config: config
  });

  // Determine if the product has variants
  const hasVariants = (product.colors_formatted && product.colors_formatted.length > 0) || (product.choice_options && product.choice_options.length > 0);

  return (
    <div
      className={`bg-white border-none shadow-none rounded-md p-0 flex flex-col items-center w-full ${direction}`}
      style={{ minWidth: 150, maxWidth: 220 }}
      dir={direction}
    >
      <Link href={`/product/${product.slug}`} className="w-full block">
        <div className={`relative w-full h-40 bg-white rounded-md border border-gray-200 overflow-hidden flex items-center ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}> 
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain rounded-md"
              style={{ border: '1px solid #eee' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="w-full flex-1 flex flex-col items-center px-2 pt-2 pb-3">
        <Link href={`/product/${product.slug}`} className="w-full block">
          <h3 className={`text-base font-medium text-black mb-1 truncate w-full ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>{product.name}</h3>
        </Link>
        <div className={`flex items-center gap-2 mb-3 w-full ${direction === 'rtl' ? 'justify-end flex-row-reverse' : 'justify-start'}`}> 
          <span className="text-lg font-bold text-black">
            {formattedPrice}
          </span>
          {product.discount && Number(product.discount) > 0 ? (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(parseFloat(product.unit_price) + parseFloat(product.discount), config)}
            </span>
          ) : null}
        </div>
        <div className={`flex w-full gap-2 mt-auto ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {hasVariants ? (
            <Link href={`/product/${product.slug}`} className="flex-1">
              <button
                className="w-full border border-[#991b1b] text-[#991b1b] bg-transparent rounded-md py-1.5 text-sm font-medium transition-colors hover:bg-[#991b1b]/10"
                type="button"
              >
                {language === 'ar' ? '+ أضف' : i18n.t('add_to_cart')}
              </button>
            </Link>
          ) : (
            <button
              onClick={handleAddToCartOnly}
              disabled={isAddingAdd || isAddingBuy}
              className="flex-1 border border-[#991b1b] text-[#991b1b] bg-transparent rounded-md py-1.5 text-sm font-medium transition-colors hover:bg-[#991b1b]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              type="button"
            >
              {isAddingAdd ? (
                <svg className="animate-spin h-5 w-5 text-[#991b1b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                language === 'ar' ? '+ أضف' : i18n.t('add_to_cart')
              )}
            </button>
          )}
          {hasVariants ? (
            <Link href={`/product/${product.slug}`} className="flex-1">
              <button
                className="w-full bg-[#991b1b] text-white rounded-md py-1.5 text-sm font-medium transition-colors hover:bg-[#7a1818]"
                type="button"
              >
                {language === 'ar' ? 'اشتري الآن' : i18n.t('buy_now')}
              </button>
            </Link>
          ) : (
            <button
              onClick={handleBuyNow}
              disabled={isAddingAdd || isAddingBuy}
              className="flex-1 bg-[#991b1b] text-white rounded-md py-1.5 text-sm font-medium transition-colors hover:bg-[#7a1818] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              type="button"
            >
              {isAddingBuy ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                language === 'ar' ? 'اشتري الآن' : i18n.t('buy_now')
              )}
            </button>
          )}
        </div>
      </div>
      {showSuccess && (
        <>
          {/* Mobile: Toast overlays nav bar, full width, no border radius, slides up then down */}
          <div
            className={`fixed bottom-0 left-0 w-full h-16 flex items-center justify-center bg-green-600 text-white text-lg font-bold z-[100] shadow-lg md:hidden transition-transform duration-300
              ${isSlidingUp ? 'animate-slideUpMobile' : ''}
              ${isSlidingDown ? 'animate-slideDownMobile' : ''}`}
            style={{ borderRadius: 0, boxShadow: '0 -4px 24px 0 rgba(0,0,0,0.12)' }}
          >
            تمت الاضافة بنجاح
          </div>
          {/* Desktop: previous style */}
          <div
            className={`hidden md:flex fixed right-6 bottom-6 px-4 py-3 bg-green-600 text-white rounded-2xl shadow-lg z-[100] text-lg font-bold animate-slideUp`}
            style={{ borderRadius: '1.5rem', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}
          >
            تمت الاضافة بنجاح
          </div>
        </>
      )}
    </div>
  );
} 