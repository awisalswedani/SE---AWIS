import { getSellerProducts, getConfig, getSellerCategories } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import ProductCardProducts from '@/components/ProductCardProducts';
import CartIcon from '@/components/CartIcon';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : Array.isArray(params.search) ? params.search[0] : '';
  const category = typeof params.category === 'string' ? params.category : Array.isArray(params.category) ? params.category[0] : '';
  const page = typeof params.page === 'string' ? params.page : Array.isArray(params.page) ? params.page[0] : '1';
  const limit = typeof params.limit === 'string' ? params.limit : Array.isArray(params.limit) ? params.limit[0] : '12';

  const apiParams = {
    limit,
    offset: ((parseInt(page) - 1) * parseInt(limit)).toString(),
    ...(search ? { search } : {}),
    ...(category ? { category } : {}),
  };

  const config = await getConfig();
  const categories = await getSellerCategories();
  const productsResponse = await getSellerProducts(apiParams);
  const products = productsResponse.products || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-gray-900 hover:text-gray-600">
                Home
              </Link>
              <Link href="/products" className="text-blue-600 font-medium">
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

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCardProducts key={product.id} product={product} config={config} />
              ))}
            </div>
          )}
        </div>
      </section>
      <div className="h-20 md:hidden" />
    </div>
  );
} 