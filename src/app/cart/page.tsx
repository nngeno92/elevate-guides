'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { Trash2, CreditCard, Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { MpesaPaymentRequest, MpesaPaymentResponse, MpesaTransactionStatusResponse } from '@/types';
import { trackInitiateCheckout, trackPurchase } from '@/lib/analytics';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { createOrder } from '@/lib/orderManagement';

export default function CartPage() {
  const { state, removeItem, clearCart } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const checkPaymentStatus = async (checkoutRequestId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/money/transaction-status?checkout_request_id=${checkoutRequestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: MpesaTransactionStatusResponse = await response.json();

      // Debug logging to see what we're getting
      console.log('Payment status check result:', result);

      if (!result.success) {
        // API error
        setPaymentStatus('error');
        setPaymentMessage(result.error || 'Error checking payment status');
        setIsProcessing(false);
        
        // Clear polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        return true;
      }

      if (result.is_completed && result.is_successful) {
        // Payment confirmed
        setPaymentStatus('success');
        setReceiptNumber(result.mpesa_receipt_number || 'N/A');
        
        // Track purchase event
        const orderId = result.transaction_id || `order_${Date.now()}`;
        await trackPurchase(state.items, state.total, orderId, phoneNumber);
        
        // Create order in backend
        const orderData = {
          phone_number: phoneNumber.startsWith('0') ? `254${phoneNumber.slice(1)}` : phoneNumber,
          products: state.items.map(item => item.product_name).join(', '),
          date_time: new Date().toISOString(),
          order_id: orderId,
          source: 'bizz.ke'
        };
        
        const orderResult = await createOrder(orderData);
        if (orderResult.success) {
          console.log('Order created successfully:', orderResult.order);
        } else {
          console.error('Failed to create order:', orderResult.error);
        }
        
        // Clear any ongoing polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Store payment verification data in both localStorage and cookie
        const paymentVerification = {
          timestamp: Date.now(),
          receiptNumber: result.mpesa_receipt_number || 'N/A',
          productIds: state.items.map(item => item.product_id),
          orderId: orderId
        };
        
        // Store in localStorage for immediate access
        localStorage.setItem('paymentVerification', JSON.stringify(paymentVerification));
        
        // Store in cookie for persistence (7 days)
        const cookieValue = JSON.stringify(paymentVerification);
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // 7 days from now
        document.cookie = `paymentVerification=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        
        // Show success modal
        setShowSuccessModal(true);
        
        // Clear cart and redirect after modal animation
        setTimeout(() => {
          clearCart();
          const productIds = state.items.map(item => item.product_id).join(',');
          window.location.href = `/success?products=${productIds}`;
        }, 3000);
        
        return true;
      } else if (result.is_completed && !result.is_successful) {
        // Payment failed
        setPaymentStatus('error');
        const errorMessage = result.result_description || 'Payment failed. Please try again.';
        setPaymentMessage(errorMessage === 'Request Cancelled by user.' ? 'Transaction Cancelled' : errorMessage);
        setIsProcessing(false);
        
        // Clear polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        return true;
      } else if (result.success && result.status && ['FAILED', 'CANCELLED', 'TIMEOUT'].includes(result.status)) {
        // Payment failed based on status (even if not marked as completed)
        setPaymentStatus('error');
        let errorMessage = 'Payment failed. Please try again.';
        
        if (result.status === 'CANCELLED') {
          errorMessage = 'Transaction Cancelled';
        } else if (result.status === 'FAILED') {
          errorMessage = result.result_description || 'Payment failed. Please try again.';
        } else if (result.status === 'TIMEOUT') {
          errorMessage = 'Payment timeout. Please try again.';
        }
        
        setPaymentMessage(errorMessage);
        setIsProcessing(false);
        
        // Clear polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        return true;
      } else if (result.success && result.result_description && 
                 (result.result_description.toLowerCase().includes('cancelled') || 
                  result.result_description.toLowerCase().includes('insufficient') ||
                  result.result_description.toLowerCase().includes('failed') ||
                  result.result_description.toLowerCase().includes('declined'))) {
        // Payment failed based on error description (even if status is still PENDING)
        setPaymentStatus('error');
        let errorMessage = 'Payment failed. Please try again.';
        
        if (result.result_description.toLowerCase().includes('cancelled')) {
          errorMessage = 'Transaction Cancelled';
        } else if (result.result_description.toLowerCase().includes('insufficient')) {
          errorMessage = 'Insufficient balance. Please check your MPESA balance and try again.';
        } else {
          errorMessage = result.result_description;
        }
        
        setPaymentMessage(errorMessage);
        setIsProcessing(false);
        
        // Clear polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        return true;
      }
      
      // Still pending, continue polling
      return false;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  };

  const startPaymentPolling = (checkoutRequestId: string) => {
    // Wait 10 seconds before starting to poll (give user time to enter MPESA PIN)
    setTimeout(() => {
      // Start polling every 2 seconds (more frequent to catch failures faster)
      pollingIntervalRef.current = setInterval(async () => {
        const isComplete = await checkPaymentStatus(checkoutRequestId);
        if (isComplete) {
          // Stop polling if payment is complete
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      }, 2000);

      // Set timeout for 1 minute (60 seconds)
      timeoutRef.current = setTimeout(() => {
        setPaymentStatus('error');
        setPaymentMessage('Payment timeout. Please try again.');
        setIsProcessing(false);
        
        // Clear polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }, 60000);
    }, 10000);
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setPaymentMessage('Please enter a valid phone number');
      setPaymentStatus('error');
      return;
    }

    if (state.items.length === 0) {
      setPaymentMessage('Your cart is empty');
      setPaymentStatus('error');
      return;
    }

    // Track initiate checkout event
    await trackInitiateCheckout(state.items, state.total, phoneNumber);

    setIsProcessing(true);
    setPaymentStatus('idle');
    setPaymentMessage('');

    try {
      const paymentRequest: MpesaPaymentRequest = {
        phone_number: phoneNumber.startsWith('0') ? `254${phoneNumber.slice(1)}` : phoneNumber,
        amount: state.total,
        account_reference: `ORDER${Date.now()}`,
        transaction_desc: `Payment for ${state.items.length} business guide(s)`
      };

      const response = await fetch('/money/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      const result: MpesaPaymentResponse = await response.json();

      if (result.success && result.checkout_request_id) {
        setPaymentStatus('processing');
        setPaymentMessage('MPESA prompt sent! Please check your phone and enter your PIN. We\'ll confirm your payment shortly.');
        setCheckoutRequestId(result.checkout_request_id);
        
        // Start polling for payment confirmation
        startPaymentPolling(result.checkout_request_id);
      } else {
        setPaymentStatus('error');
        setPaymentMessage(result.error || 'Payment failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      setPaymentStatus('error');
      setPaymentMessage('Network error. Please check your connection and try again.');
      setIsProcessing(false);
    }
  };

  // Cleanup polling on component unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
            <p className="text-gray-600 mb-8">Your cart is empty</p>
            <a
              href="/products"
              className="bg-[#6528F7] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors duration-200"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Ksh. {item.sale_price.toLocaleString()} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="font-semibold text-gray-900">{item.quantity}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">Ksh. {(item.quantity * item.sale_price).toLocaleString()}</div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">Ksh. {state.total.toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-[#6528F7]">Ksh. {state.total.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      MPESA Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g., 0712345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6528F7] focus:border-transparent text-black"
                    />
                  </div>
                  

                  
                  {paymentStatus === 'processing' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                        <p className="text-blue-800">{paymentMessage}</p>
                      </div>
                      <div className="mt-2 text-sm text-blue-600">
                        <p>⏱️ Waiting for payment confirmation...</p>
                        <p>⏰ This may take up to 1 minute</p>
                      </div>
                    </div>
                  )}
                  
                  {paymentStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                        <p className="text-red-800">{paymentMessage}</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || state.items.length === 0 || paymentStatus === 'processing'}
                    className="w-full bg-[#6528F7] text-white py-3 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing || paymentStatus === 'processing' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{paymentStatus === 'processing' ? 'Confirming Payment...' : 'Processing...'}</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        <span>Pay with MPESA</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    You will receive an MPESA prompt on your phone to complete the payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        receiptNumber={receiptNumber}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
} 