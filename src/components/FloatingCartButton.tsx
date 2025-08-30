'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingCartButton() {
  const { state } = useCart();
  const pathname = usePathname();
  
  // Don't show on cart page, success pages, or if cart is empty
  if (pathname === '/cart' || pathname === '/success' || pathname === '/payment-success' || pathname === '/payment-failed' || state.items.length === 0) {
    return null;
  }

  const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/cart"
        className="bg-[#6528F7] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5a1fd8] transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>View Cart ({cartItemCount})</span>
      </Link>
    </div>
  );
} 