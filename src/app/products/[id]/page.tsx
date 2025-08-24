'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getProductById } from '@/lib/products';
import { Product } from '@/types';
import { ShoppingCart, Star, ArrowLeft, Loader2 } from 'lucide-react';
import ReviewsSlider from '@/components/ReviewsSlider';
import ProductBenefits from '@/components/ProductBenefits';
import BonusResources from '@/components/BonusResources';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addItem, getItemQuantity, canAddItem } = useCart();

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);
    
    // Simulate a small delay to ensure the component has mounted
    const timer = setTimeout(() => {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [productId]);

  const handleAddToCart = () => {
    if (product && canAddItem(product.product_id)) {
      addItem(product);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#6528F7] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Product...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link
              href="/products"
              className="bg-[#6528F7] text-white px-6 py-3 rounded-lg hover:bg-[#5a1fd8] transition-colors duration-200"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quantity = getItemQuantity(product.product_id);
  const averageRating = product.reviews.reduce((sum, review) => sum + review.stars, 0) / product.reviews.length;
  const fiveStarReviews = product.reviews.filter(review => review.stars === 5).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="flex items-center text-[#6528F7] hover:text-[#5a1fd8] transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative h-96 w-full overflow-hidden bg-gray-100 rounded-lg">
              <Image
                src={product.product_image}
                alt={product.product_name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.product_name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
                <span className="ml-2 text-sm text-green-600">
                  {fiveStarReviews} five-star reviews
                </span>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-[#6528F7]">
                    Ksh. {product.sale_price.toLocaleString()}
                  </div>
                  <div className="text-xl text-gray-500 line-through">
                    Ksh. {product.price.toLocaleString()}
                  </div>
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Save Ksh. {(product.price - product.sale_price).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-lg text-gray-700 mb-6">
                {product.short_description}
              </p>

              {/* Product Benefits */}
              <ProductBenefits />

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!canAddItem(product.product_id)}
                className={`w-full py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 text-lg ${
                  canAddItem(product.product_id)
                    ? 'bg-[#6528F7] text-white hover:bg-[#5a1fd8]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>{quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bonus Resources */}
        <BonusResources />

        {/* Second Add to Cart Button */}
        <div className="my-8">
          <button
            onClick={handleAddToCart}
            disabled={!canAddItem(product.product_id)}
            className={`w-full py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 text-lg ${
              canAddItem(product.product_id)
                ? 'bg-[#6528F7] text-white hover:bg-[#5a1fd8]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-6 w-6" />
            <span>{quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}</span>
          </button>
        </div>

        {/* Detailed Description */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div 
            className="max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <ReviewsSlider reviews={product.reviews} />
        </div>

        {/* Third Add to Cart Button */}
        <div className="mt-12">
          <button
            onClick={handleAddToCart}
            disabled={!canAddItem(product.product_id)}
            className={`w-full py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 text-lg ${
              canAddItem(product.product_id)
                ? 'bg-[#6528F7] text-white hover:bg-[#5a1fd8]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-6 w-6" />
            <span>{quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}</span>
          </button>
        </div>

        {/* Floating Proceed to Pay Button */}
        {quantity > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Link
              href="/cart"
              className="bg-[#6528F7] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5a1fd8] transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Proceed to Pay ({quantity})</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 