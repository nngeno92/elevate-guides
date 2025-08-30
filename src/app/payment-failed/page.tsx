'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function PaymentFailedPage() {
  const router = useRouter();
  const { state } = useCart();

  const handleRetryPayment = () => {
    router.push('/cart');
  };

  const handleBackToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Failed Icon */}
          <div className="mx-auto mb-6">
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Failed Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            We couldn&apos;t process your payment. This could be due to insufficient funds, network issues, or payment cancellation.
          </p>

          {/* Products in Cart */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items in Your Cart</h2>
            <div className="space-y-2">
              {state.items.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.product_name}</span>
                  <span className="font-semibold text-gray-900">Ksh. {item.sale_price.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-[#6528F7]">Ksh. {state.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-[#6528F7] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Payment Again</span>
            </button>
            
            <button
              onClick={handleBackToCart}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </button>
            
            <p className="text-sm text-gray-600">
              Don&apos;t worry, your items are still in your cart. You can try the payment again or contact us if you need assistance.
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Common Issues:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Insufficient account balance</li>
                  <li>• Network connectivity issues</li>
                  <li>• Payment method not supported</li>
                  <li>• Transaction timeout</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Contact Support:</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you continue to experience issues, please contact our support team.
                </p>
                <a 
                  href="mailto:info@businessinkenya.co.ke"
                  className="text-[#6528F7] hover:text-[#5a1fd8] font-medium"
                >
                  info@businessinkenya.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 