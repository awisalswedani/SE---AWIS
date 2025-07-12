'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import { formatPrice } from '@/utils/api';

interface ProductCardProductsProps {
  product: any;
  config: any;
}

export default function ProductCardProducts({ product, config }: ProductCardProductsProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product.id, 1);
      // Show success feedback (you could add a toast notification here)
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-48 bg-gray-200">
          {(product.thumbnail_full_url?.path || 
            (product.images_full_url && product.images_full_url.length > 0 ? product.images_full_url[0].path : null)) ? (
            <Image
              src={product.thumbnail_full_url?.path || 
                   (product.images_full_url && product.images_full_url.length > 0 ? product.images_full_url[0].path : '')}
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
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.details ? product.details.replace(/<[^>]*>/g, '') : product.description || 'No description available'}
          </p>
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-600">
                {formatPrice(product.unit_price, config)}
              </span>
              {product.discount && product.discount > 0 ? (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(parseFloat(product.unit_price) + parseFloat(product.discount), config)}
                </span>
              ) : null}
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {(product.reviews_count && product.reviews_count > 0) && (
                <span className="ml-1 text-sm text-gray-600">({product.reviews_count})</span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <button 
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleViewClick}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
} 