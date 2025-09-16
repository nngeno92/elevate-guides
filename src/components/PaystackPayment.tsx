'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/constants';
import { useRouter } from 'next/navigation';

interface PaystackPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  phoneNumber: string;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackPayment({ isOpen, onClose, email, phoneNumber }: PaystackPaymentProps) {
  const { state } = useCart();
  const router = useRouter();
  const paystackRef = useRef<any>(null);

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) {
        paystackRef.current = window.PaystackPop;
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!paystackRef.current || !email || state.items.length === 0) {
      return;
    }

    const amount = state.total * 100; // Convert to kobo (smallest currency unit)
    const reference = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const handler = paystackRef.current.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount,
      currency: 'KES',
      ref: reference,
      channels: ['mobile_money', 'card', 'bank', 'ussd', 'qr', 'bank_transfer'],
      callback: function(response: any) {
        // Payment successful
        console.log('Payment successful:', response);
        
        // Get click ID from URL or stored UTM params
        const getClickId = () => {
          // First check URL for fbclid
          const urlClickId = new URLSearchParams(window.location.search).get('fbclid');
          if (urlClickId) return urlClickId;
          
          // Then check stored UTM params
          const cookies = document.cookie.split(';');
          const utmCookie = cookies.find(cookie => cookie.trim().startsWith('bik_utm_params='));
          if (utmCookie) {
            try {
              const cookieValue = utmCookie.split('=')[1];
              const utmParams = JSON.parse(decodeURIComponent(cookieValue));
              return utmParams.fbclid || undefined;
            } catch (error) {
              console.error('Error parsing UTM cookie:', error);
            }
          }
          return undefined;
        };

        // Store payment verification data
        const paymentVerification = {
          timestamp: Date.now(),
          receiptNumber: response.reference,
          productIds: state.items.map(item => item.product_id),
          orderId: reference,
          transactionId: response.reference,
          paymentMethod: 'paystack',
          email: email,
          phoneNumber: phoneNumber,
          clickId: getClickId()
        };
        
        localStorage.setItem('paymentVerification', JSON.stringify(paymentVerification));
        
        // Store in cookie for persistence (7 days)
        const cookieValue = JSON.stringify(paymentVerification);
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `paymentVerification=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        
        // Redirect to payment success page
        router.push('/payment-success');
      },
      onClose: function() {
        // Payment cancelled or failed
        console.log('Payment cancelled or failed');
        
        // Redirect to payment failed page
        router.push('/payment-failed');
      }
    });

    handler.openIframe();
  };

  useEffect(() => {
    if (isOpen && paystackRef.current) {
      handlePayment();
    }
  }, [isOpen]);

  return null; // This component doesn't render anything visible
} 