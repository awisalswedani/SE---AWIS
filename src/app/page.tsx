"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSellerProducts, getSellerInfo, getSellerBanners, getConfig, formatPrice, getSellerCategories } from '@/utils/api';
import ProductCard from '@/components/ProductCard';
import CartIcon from '@/components/CartIcon';

export default function Home() {
  const [productList, setProductList] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [configRes, productsRes, sellerRes, categoriesRes] = await Promise.all([
          getConfig(),
          getSellerProducts(),
          getSellerInfo(),
          getSellerCategories()
        ]);
        setConfig(configRes);
        setProductList(productsRes?.products || []);
        setSeller(sellerRes);
        setCategories(categoriesRes || []);
      } catch (error) {
        // Fallback to sample data if API fails
        setProductList([
          {
            id: 1,
            name: 'Sample Product 1',
            details: 'This is a sample product for testing purposes',
            unit_price: 29.99,
            thumbnail: 'https://via.placeholder.com/300x300?text=Product+1',
            thumbnail_full_url: { path: 'https://via.placeholder.com/300x300?text=Product+1' },
            images: ['https://via.placeholder.com/300x300?text=Product+1'],
            images_full_url: [{ path: 'https://via.placeholder.com/300x300?text=Product+1' }]
          },
          {
            id: 2,
            name: 'Sample Product 2',
            details: 'Another sample product for testing',
            unit_price: 49.99,
            thumbnail: 'https://via.placeholder.com/300x300?text=Product+2',
            thumbnail_full_url: { path: 'https://via.placeholder.com/300x300?text=Product+2' },
            images: ['https://via.placeholder.com/300x300?text=Product+2'],
            images_full_url: [{ path: 'https://via.placeholder.com/300x300?text=Product+2' }]
          },
          {
            id: 3,
            name: 'Sample Product 3',
            details: 'Yet another sample product for testing',
            unit_price: 79.99,
            thumbnail: 'https://via.placeholder.com/300x300?text=Product+3',
            thumbnail_full_url: { path: 'https://via.placeholder.com/300x300?text=Product+3' },
            images: ['https://via.placeholder.com/300x300?text=Product+3'],
            images_full_url: [{ path: 'https://via.placeholder.com/300x300?text=Product+3' }]
          }
        ]);
        setSeller({
          name: 'Sample Seller Store',
          description: 'A sample seller store for testing purposes',
          address: '123 Sample Street, Test City',
          phone: '+1 234 567 8900',
          email: 'sample@seller.com'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {seller?.seller?.image_full_url?.path && (
                <Image
                  src={seller.seller.image_full_url.path}
                  alt={`${seller.seller.f_name} ${seller.seller.l_name} - Store Logo`}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              )}
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {seller?.seller?.shop?.name || `${seller?.seller?.f_name || ''} ${seller?.seller?.l_name || ''}` || 'Seller Store'}
              </h1>
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
        </div>
      </header>

      {/* Hero Section with Shop Banner */}
      {seller?.seller?.shop?.banner_full_url?.path ? (
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-200">
              {/* Use Next.js Image component */}
        <Image
                src={seller.seller.shop.banner_full_url.path}
                alt={`${seller.seller.shop.name} - Shop Banner`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority
        />
            </div>
          </div>
        </section>
      ) : (
        // Fallback banner if no banner image
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {seller?.seller?.shop?.name || `${seller?.seller?.f_name || ''} ${seller?.seller?.l_name || ''}` || 'Welcome to Our Store'}
                  </h1>
                  <p className="text-lg opacity-90">
                    {seller?.seller?.shop?.address || 'Quality products and excellent service'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600">
                Browse our products by category
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map((category: any) => {
                // Debug logging for each category
                console.log('Category debug:', {
                  id: category.id,
                  name: category.name,
                  icon_full_url: category.icon_full_url,
                  icon: category.icon,
                  product_count: category.product_count,
                  total_product_count: category.total_product_count,
                  allKeys: Object.keys(category)
                });
                
                // Get category name with fallbacks
                const categoryName = category.name || category.title || category.category_name || 'Category';
                
                // Get category image with fallbacks
                const categoryImage = category.icon_full_url?.path || 
                                    category.icon || 
                                    category.image?.path || 
                                    category.image_full_url?.path;
                
                // Get product count with fallbacks
                const productCount = category.product_count || 
                                   category.total_product_count || 
                                   category.products_count || 
                                   0;
                
                return (
                  <Link 
                    key={category.id} 
                    href={`/products?category=${category.id}`}
                    className="group"
                  >
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden group-hover:bg-gray-200 transition-colors">
                        {categoryImage ? (
            <Image
                            src={categoryImage}
                            alt={categoryName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {categoryName}
                      </h3>
                      {productCount > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {productCount} products
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Discover our latest and most popular products
            </p>
          </div>

          {productList.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back soon for our latest products.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {productList.slice(0, 8).map((product: any) => (
                  <ProductCard key={product.id} product={product} config={config} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Seller */}
      {seller && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About {seller.seller?.shop?.name || `${seller.seller?.f_name || ''} ${seller.seller?.l_name || ''}`}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We are committed to providing high-quality products and excellent customer service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Products</h3>
                <p className="text-gray-600">We offer only the best quality products to our customers.</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable delivery to your doorstep.</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support for your needs.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{seller?.seller?.shop?.name || `${seller?.seller?.f_name || ''} ${seller?.seller?.l_name || ''}` || 'Seller Store'}</h3>
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
                {seller?.seller?.shop?.address || 'Address not available'}
              </p>
              <p className="text-gray-400">
                {seller?.seller?.phone || 'Phone not available'}
              </p>
              <p className="text-gray-400">
                {seller?.seller?.email || 'Email not available'}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 {seller?.seller?.shop?.name || `${seller?.seller?.f_name || ''} ${seller?.seller?.l_name || ''}` || 'Seller Store'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
