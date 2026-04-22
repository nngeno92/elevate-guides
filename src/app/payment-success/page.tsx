'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { CheckCircle, Download, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { trackPurchase } from '@/lib/analytics';
// import { updateOrderEmail } from '@/lib/orderManagement';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { state } = useCart();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [deliveryTriggered, setDeliveryTriggered] = useState(false);

  useEffect(() => {
    // Get payment verification data
    const storedData = localStorage.getItem('paymentVerification');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPaymentData(data);
      } catch (error) {
        console.error('Error parsing payment data:', error);
        router.push('/cart');
      }
    } else {
      // No payment data, redirect to cart
      router.push('/cart');
    }
  }, [router]);

  // Automatically trigger purchase tracking when payment data is available
  useEffect(() => {
    if (!paymentData || deliveryTriggered || !paymentData.email || state.items.length === 0) {
      return;
    }

    const triggerDeliveryAutomatically = async () => {
      setDeliveryTriggered(true);
      setIsTracking(true);

      try {
        console.log('🚀 Automatically triggering delivery for successful payment...');
        
        // Step 1: Track Meta conversion
        console.log('📊 Starting Meta conversion tracking...');
        await trackPurchase(
          state.items,
          state.total,
          paymentData.orderId,
          paymentData.email,
          paymentData.clickId,
          paymentData.phoneNumber
        );
        console.log('✅ Meta conversion tracking completed');

        setIsTracking(false);
      } catch (error) {
        console.error('❌ Error during purchase tracking:', error);
        setIsTracking(false);
        // Still continue - tracking was attempted
      }
    };

    triggerDeliveryAutomatically();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentData, deliveryTriggered, state.items, state.total]);

  const handleGoToSuccess = () => {
    // Navigate to success page - delivery is already triggered automatically
    const productIds = state.items.map(item => item.product_id).join(',');
    router.push(`/success?products=${productIds}`);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6528F7] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6">
            <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your payment has been processed successfully. You can now access your business guides and resources.
          </p>

          {/* Top Action Button */}
          <div className="mb-8">
            <button
              onClick={handleGoToSuccess}
              disabled={isTracking}
              className="w-full max-w-md mx-auto bg-[#6528F7] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isTracking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>View Your Products</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Reference Number:</p>
                <p className="font-semibold text-gray-900">{paymentData.receiptNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method:</p>
                <p className="font-semibold text-gray-900 capitalize">{paymentData.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order ID:</p>
                <p className="font-semibold text-gray-900">{paymentData.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(paymentData.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Products Purchased */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Products Purchased</h2>
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
              onClick={handleGoToSuccess}
              disabled={isTracking}
              className="w-full bg-[#6528F7] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isTracking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Get What I Bought</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-600">
              {isTracking 
                ? "We're processing your order. This will take a few seconds..."
                : "Click the button above to view your download links."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 