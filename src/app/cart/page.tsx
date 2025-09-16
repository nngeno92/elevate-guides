'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { Trash2, CreditCard } from 'lucide-react';
import PaystackPayment from '@/components/PaystackPayment';

export default function CartPage() {
  const { state, removeItem } = useCart();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPaystackModal, setShowPaystackModal] = useState(false);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleProceedToPay = () => {
    setShowPaystackModal(true);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-6">Your Cart</h1>
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
        <h1 className="text-xl font-bold text-gray-900 mb-6">Your Cart</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">Ksh. {item.sale_price.toLocaleString()}</div>
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

          {/* Payment Section */}
          <div className="bg-gradient-to-br from-[#6528F7] to-[#5a1fd8] rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Complete Your Purchase</h2>
            
            <div className="space-y-6">
              {/* Total */}
              <div className="flex justify-between text-2xl font-bold text-white border-b border-white/20 pb-4">
                <span>Total Amount:</span>
                <span>Ksh. {state.total.toLocaleString()}</span>
              </div>
              
              {/* Contact Information Section */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    📧 Email Address for Delivery
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-black bg-white font-medium"
                  />
                  <p className="text-xs text-white/80 mt-2">
                    Your business guides and resources will be delivered to this email address.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                    📱 WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0712345678 or 0112333444"
                    className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-black bg-white font-medium"
                  />
                  <p className="text-xs text-white/80 mt-2">
                    We will send your order links via Whatsapp to this number. Please ensure it is a working Whatsapp number. Enter your phone number in the format: 0712345678 or 0112333444 (without +254)
                  </p>
                </div>
              </div>
              
              {/* Payment Button */}
              <div className="space-y-3">
                <button
                  onClick={handleProceedToPay}
                  disabled={!email || !email.includes('@') || !phoneNumber || phoneNumber.length < 10}
                  className="w-full bg-white text-[#6528F7] py-4 px-6 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Proceed to Pay</span>
                </button>
                
                <p className="text-xs text-white/80 text-center">
                  🔒 You will be redirected to Paystack to complete your payment securely
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Payment Modal */}
      <PaystackPayment
        isOpen={showPaystackModal}
        onClose={() => setShowPaystackModal(false)}
        email={email}
        phoneNumber={phoneNumber}
      />
    </div>
  );
} 