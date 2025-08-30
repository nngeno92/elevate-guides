'use client';

import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, getItemQuantity, canAddItem } = useCart();
  const quantity = getItemQuantity(product.product_id);

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity > 0) {
      // Remove from cart if already in cart
      removeItem(product.product_id);
    } else if (canAddItem(product.product_id)) {
      // Add to cart if not in cart
      addItem(product);
    }
  };

  return (
    <Link href={`/products/${product.product_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={product.product_image}
            alt={product.product_name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#6528F7] transition-colors duration-200">
            {product.product_name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {product.short_description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-[#6528F7]">
                Ksh. {product.sale_price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 line-through">
                Ksh. {product.price.toLocaleString()}
              </div>
            </div>
            
                           <button
                 onClick={handleCartAction}
                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                   quantity > 0
                     ? 'bg-red-500 text-white hover:bg-red-600'
                     : canAddItem(product.product_id)
                     ? 'bg-[#6528F7] text-white hover:bg-[#5a1fd8]'
                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                 }`}
               >
                 <ShoppingCart className="h-4 w-4" />
                 <span>{quantity > 0 ? `Remove from Cart` : 'Add to Cart'}</span>
               </button>
          </div>
        </div>
      </div>
    </Link>
  );
} 