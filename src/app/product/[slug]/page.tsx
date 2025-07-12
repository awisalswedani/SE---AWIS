import { getConfig, formatPrice } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import CartIcon from '@/components/CartIcon';
import ProductCard from '@/components/ProductCard';
import { useState, useMemo } from 'react';
import VariantSelectionWrapper from './VariantSelectionWrapper';
import ProductImageGallery from './ProductImageGallery';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: any = null;
  let config: any = null;
  let error: string | null = null;

  function getAverageRating(product: any): number {
    if (product.reviews && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum: number, r: any) => {
        let rating = 0;
        if (typeof r.rating === 'number') {
          rating = r.rating;
        } else if (typeof r.rating === 'string') {
          rating = parseFloat(r.rating) || 0;
        }
        return sum + rating;
      }, 0);
      return totalRating / product.reviews.length;
    }
    return 0;
  }

  // Helper to get guest_id from localStorage or fetch if missing
  async function getOrCreateGuestId() {
    if (typeof window !== 'undefined') {
      let guestId = localStorage.getItem('guest_id');
      if (guestId) return guestId;
      const res = await fetch('https://awisapp.com/api/v1/get-guest-id');
      const data = await res.json();
      if (data.guest_id) {
        localStorage.setItem('guest_id', data.guest_id.toString());
        return data.guest_id.toString();
      }
      throw new Error('No guest_id in backend response');
    }
    // fallback for SSR: use 1
    return '1';
  }

  let guestId = '1';
  if (typeof window !== 'undefined') {
    guestId = await getOrCreateGuestId();
  }

  try {
    config = await getConfig();
    const apiUrl = `https://awisapp.com/api/v1/products/details/${slug}?guest_id=${guestId}`;
    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const debugText = `URL: ${apiUrl}\nGuestId: ${guestId}\nStatus: ${res.status}\nStatusText: ${res.statusText}`;
    let raw = await res.text();
    let parsed = {};
    try { parsed = JSON.parse(raw); } catch (e) { parsed = { error: 'Invalid JSON', raw }; }
    product = parsed;
    product._debug = debugText;
    if (!product || Object.keys(product).length === 0) {
      notFound();
    }
  } catch (err: any) {
    console.error('Failed to fetch product:', err);
    error = err.message;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Get the main product image
  const mainImage = product.thumbnail_full_url?.path || 
    (product.images_full_url && product.images_full_url.length > 0 ? product.images_full_url[0].path : null);

  // Get all product images for gallery
  const allImages = [
    ...(product.images_full_url || []),
    ...(product.thumbnail_full_url ? [product.thumbnail_full_url] : [])
  ].filter((img, index, arr) => arr.findIndex(t => t.path === img.path) === index);

  // Fetch suggested products (random, same seller, exclude current)
  let suggestedProducts: any[] = [];
  try {
    const res = await fetch(`https://awisapp.com/api/v1/products/latest?guest_id=${guestId}&limit=12&offset=1&seller_id=${product.user_id}`);
    const data = await res.json();
    suggestedProducts = (data.products || []).filter((p: any) => p.slug !== slug);
    // Shuffle and pick 4
    suggestedProducts = suggestedProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
  } catch (e) {
    suggestedProducts = [];
  }

  // --- VARIANT SELECTION LOGIC (Client Component) ---
  // This block will be rendered above AddToCartButton
  // We'll use a client-side wrapper for the variant selection UI

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
            <h1 className="mx-auto text-xl font-bold text-gray-900 truncate max-w-xs md:max-w-lg text-center w-full">{product.name}</h1>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-900 hover:text-gray-600">
              Home
            </Link>
            <Link href="/products" className="text-gray-900 hover:text-gray-600">
              Products
            </Link>
            <Link href="/about" className="text-gray-900 hover:text-gray-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-900 hover:text-gray-600">
              Contact
            </Link>
            <CartIcon />
          </nav>
        </div>
      </header>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ProductImageGallery product={product} />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                {/* Rating Block (matches Flutter app and image) */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < (parseFloat(product.average_review) || getAverageRating(product)) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-800 font-semibold mr-2">
                    {(parseFloat(product.average_review) || getAverageRating(product)).toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({product.reviews_count || (product.reviews ? product.reviews.length : 0)})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.unit_price, config)}
                </span>
              </div>

              {/* Variant and Quantity Block (moved below price) */}
              <VariantSelectionWrapper product={product} config={config} />

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.current_stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.current_stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.current_stock > 0 && (
                  <span className="text-sm text-gray-600">
                    {product.current_stock} available
                  </span>
                )}
              </div>

              {/* Description */}
              {product.details && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <div 
                    className="text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.details }}
                  />
                </div>
              )}

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dl className="space-y-2">
                      {product.specifications.map((spec: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <dt className="text-gray-600 font-medium">{spec.name}:</dt>
                          <dd className="text-gray-900">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Suggested Products
              </h2>
              <p className="text-lg text-gray-600">
                You might also like these products from this seller
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} config={config} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer (copied from homepage) */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{product.seller?.shop?.name || product.seller?.f_name || 'Seller Store'}</h3>
              <p className="text-gray-400">
                Your trusted source for quality products.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/products" className="text-gray-400 hover:text-white">Products</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-400">
                {product.seller?.shop?.address || 'Address not available'}
              </p>
              <p className="text-gray-400">
                {product.seller?.phone || 'Phone not available'}
              </p>
              <p className="text-gray-400">
                {product.seller?.email || 'Email not available'}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 {product.seller?.shop?.name || product.seller?.f_name || 'Seller Store'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function generateStaticParams() {
  // Fetch all products for the seller (increase limit for full export)
  const res = await fetch('https://awisapp.com/api/v1/products/latest?limit=1000&offset=1&seller_id=6');
  const data = await res.json();
  const products = data.products || [];
  return products.map((product: any) => ({ id: product.id.toString() }));
} 