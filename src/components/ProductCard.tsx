'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from './CartContext';
import { formatPrice } from '@/utils/api';

interface ProductCardProps {
  product: any;
  config: any;
}

export default function ProductCard({ product, config }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Debug logging
  console.log('ProductCard render:', {
    productId: product.id,
    productName: product.name,
    unitPrice: product.unit_price,
    config: config,
    currencyList: config?.currency_list
  });

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 bg-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
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
      
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-2xl font-bold text-blue-600 mb-4">
          {formattedPrice}
        </p>
        
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
} 