import { getSellerProducts, getConfig, formatPrice } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import CartIcon from '@/components/CartIcon';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product: any = null;
  let config: any = null;
  let products: any[] = [];
  let error: string | null = null;

  // Helper to calculate average rating
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

  try {
    // Fetch config first for currency settings
    config = await getConfig();
    
    // Fetch all products to find the specific one
    const response = await getSellerProducts({ limit: '100' });
    products = response.products || [];
    
    // Find the specific product by ID
    product = products.find((p: any) => p.id.toString() === id);
    
    if (!product) {
      notFound();
    }
    
    // Debug rating data
    console.log('Product rating data:', {
      rating: product.rating,
      reviews_count: product.reviews_count,
      reviews: product.reviews,
      average_review: product.average_review,
      averageReview: product.averageReview
    });
    
    // Debug individual rating items
    if (product.rating && product.rating.length > 0) {
      console.log('Rating items details:', product.rating.map((r: any, index: number) => ({
        index,
        average: r.average,
        averageType: typeof r.average,
        count: r.count,
        countType: typeof r.count,
        fullItem: r
      })));
    }
    
    // Debug reviews data
    if (product.reviews && product.reviews.length > 0) {
      console.log('Reviews data:', product.reviews.map((r: any, index: number) => ({
        index,
        rating: r.rating,
        ratingType: typeof r.rating,
        comment: r.comment,
        customer: r.customer,
        fullItem: r
      })));
      
      // Calculate and log the actual average rating
      const totalRating = product.reviews.reduce((sum: number, r: any, index: number) => {
        const rating = typeof r.rating === 'number' ? r.rating : 0;
        console.log(`Review ${index}: rating = ${r.rating}, type = ${typeof r.rating}, calculated = ${rating}`);
        return sum + rating;
      }, 0);
      const avgRating = totalRating / product.reviews.length;
      console.log(`Total rating: ${totalRating}, Reviews count: ${product.reviews.length}, Average: ${avgRating}`);
    }
  } catch (err) {
    console.error('Failed to fetch product:', err);
    error = 'Failed to load product. Please try again later.';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-gray-900 hover:text-gray-600 mr-4">
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
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

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Image Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.slice(0, 4).map((image: any, index: number) => (
                    <div key={index} className="relative h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={image.path}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                {/* Rating */}
                {product.reviews && product.reviews.length > 0 && (
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < getAverageRating(product) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {getAverageRating(product).toFixed(1)} ({product.reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.unit_price, config)}
                </span>
                {product.discount && product.discount > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(parseFloat(product.unit_price) + parseFloat(product.discount), config)}
                  </span>
                )}
              </div>

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

              {/* Add to Cart Section */}
              <div className="border-t pt-6">
                <AddToCartButton product={product} config={config} />
              </div>

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

      {/* Another Products Section */}
      {products.length > 1 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You might also like
              </h2>
              <p className="text-lg text-gray-600">
                Discover more products from our collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter((p: any) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct: any) => (
                  <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <Link href={`/product/${relatedProduct.id}`} className="block">
                      <div className="relative h-48 bg-gray-200">
                        {(relatedProduct.thumbnail_full_url?.path || 
                          (relatedProduct.images_full_url && relatedProduct.images_full_url.length > 0 ? relatedProduct.images_full_url[0].path : null)) ? (
                          <Image
                            src={relatedProduct.thumbnail_full_url?.path || 
                                 (relatedProduct.images_full_url && relatedProduct.images_full_url.length > 0 ? relatedProduct.images_full_url[0].path : '')}
                            alt={relatedProduct.name}
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
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-green-600">
                            {formatPrice(relatedProduct.unit_price, config)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
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