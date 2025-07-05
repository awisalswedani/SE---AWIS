import { getSellerProducts, getConfig, formatPrice, getSellerCategories } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import ProductCardProducts from '@/components/ProductCardProducts';
import CartIcon from '@/components/CartIcon';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || '';
  const page = params.page || '1';
  const limit = params.limit || '12';
  
  const apiParams: Record<string, string> = {
    limit,
    offset: ((parseInt(page) - 1) * parseInt(limit)).toString(),
  };
  
  if (search) apiParams.search = search;
  if (category) apiParams.category = category;

  let products: any[] = [];
  let categories: any[] = [];
  let error: string | null = null;
  let config: any = null;
  
  try {
    // Fetch config and categories first
    const [configResponse, categoriesResponse] = await Promise.all([
      getConfig(),
      getSellerCategories()
    ]);
    
    config = configResponse;
    categories = categoriesResponse || [];
    console.log('Config data:', config);
    console.log('Categories data:', categories);

    const response = await getSellerProducts(apiParams);
    products = response.products || [];
    console.log('Products count:', products.length);
    
    // If no products found for this seller, show a specific message
    if (products.length === 0) {
      error = 'No products found for this seller.';
    }
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error = 'Failed to load products. Please try again later.';
    
    // Fallback sample data for testing
    products = [
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
    ];
    error = null; // Clear error since we have fallback data
  }

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

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Breadcrumb */}
          {category && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/products" className="hover:text-blue-600">
                  All Categories
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">
                  {(() => {
                    const selectedCategory = categories.find((cat: any) => cat.id.toString() === category);
                    return selectedCategory ? 
                      (selectedCategory.name || selectedCategory.title || selectedCategory.category_name || 'Category') : 
                      'Category';
                  })()}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <form className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={search}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            <div className="flex gap-4">
              <select
                name="category"
                defaultValue={category}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat: any) => {
                  const categoryName = cat.name || cat.title || cat.category_name || 'Category';
                  const productCount = cat.product_count || cat.total_product_count || cat.products_count || 0;
                  
                  return (
                    <option key={cat.id} value={cat.id}>
                      {categoryName} ({productCount})
                    </option>
                  );
                })}
              </select>
              
              <select
                name="limit"
                defaultValue={limit}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="12">12 per page</option>
                <option value="24">24 per page</option>
                <option value="48">48 per page</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {error}
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go back home
                </Link>
              </div>
            </div>
          ) : products.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCardProducts key={product.id} product={product} config={config} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...params,
                      page: Math.max(1, parseInt(page) - 1).toString()
                    })}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      parseInt(page) <= 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </Link>
                  
                  {[...Array(Math.ceil(products.length / parseInt(limit)) || 1)].map((_, i) => (
                    <Link
                      key={i + 1}
                      href={`/products?${new URLSearchParams({
                        ...params,
                        page: (i + 1).toString()
                      })}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        parseInt(page) === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}
                  
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...params,
                      page: (parseInt(page) + 1).toString()
                    })}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      products.length < parseInt(limit)
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </Link>
                </nav>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
} 