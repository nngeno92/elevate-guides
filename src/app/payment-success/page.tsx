'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { CheckCircle, Download, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { trackPurchase } from '@/lib/analytics';
import { getProductById } from '@/lib/products';
import { updateOrderEmail } from '@/lib/orderManagement';
import { Product } from '@/types';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { state } = useCart();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

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

  const triggerMakeAutomation = async (email: string, products: Product[], verification: any, phoneNumber: string) => {
    try {
      console.log('🚀 Automatically triggering make.com automation for email:', email);
      
      // First, send request to email delivery API
      try {
        const emailDeliveryData = {
          recipient_email: email,
          phone_number: phoneNumber,
          source: "business",
          product_ids: products.map(product => product.product_id)
        };
        
        const emailResponse = await fetch('https://shared-backend-bbb0ec9bc43a.herokuapp.com/api/email/deliver-products/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailDeliveryData),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('❌ Email delivery API Error:', emailResponse.status, errorText);
        } else {
          console.log('✅ Email delivery API Success');
        }
      } catch (emailError) {
        console.error('❌ Email delivery API Request Error:', emailError);
      }
      
      // Create business user
      try {
        const businessUserData = {
          email: email,
          phone_number: phoneNumber
        };
        
        const businessUserResponse = await fetch('https://shared-backend-bbb0ec9bc43a.herokuapp.com/api/business/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(businessUserData),
        });

        if (!businessUserResponse.ok) {
          const errorText = await businessUserResponse.text();
          console.error('❌ Business user creation API Error:', businessUserResponse.status, errorText);
        } else {
          console.log('✅ Business user creation API Success');
        }
      } catch (businessUserError) {
        console.error('❌ Business user creation API Request Error:', businessUserError);
      }
      
      // Generate order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create product HTML
      const productHtml = products.map(product => `
        <li style="background:#f8f8f8; padding:10px; border-radius:5px; margin-bottom:10px; font-size:16px;">
          <strong>${product.product_name}</strong><br>
          <a class="download-link primary" href="${product.google_download_link}" target="_blank">Download</a>
          <a class="download-link secondary" href="${product.google_file_link}" target="_blank">Backup Download Link</a>
        </li>
      `).join('');

      // Create plain text email
      const productTextEmail = products.map(product => 
        `Product: ${product.product_name}\nGoogle Drive: ${product.google_download_link}\n`
      ).join('\n');

      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || '';
      const utmMedium = urlParams.get('utm_medium') || '';
      const utmCampaign = urlParams.get('utm_campaign') || '';
      const utmTerm = urlParams.get('utm_term') || '';
      const utmContent = urlParams.get('utm_content') || '';

      const data = {
        order_id: orderId,
        total: products.reduce((sum, product) => sum + product.sale_price, 0),
        currency: 'KES',
        customer_email: email,
        customer_name: 'Customer', // Could be enhanced to collect name
        product_html: `<ul class="product-list" style="list-style:none; padding:0;">${productHtml}</ul>`,
        product_text_email: `Hi, incase you did not see the email with the order you made on Business in Kenya, you can find the same links below:\n\n${productTextEmail}`,
        products: products.map(product => product.product_name),
        utm: {
          source: utmSource,
          medium: utmMedium,
          campaign: utmCampaign,
          term: utmTerm,
          content: utmContent,
        }
      };

      const makeWebhookUrl = 'https://hook.eu2.make.com/tnx4xbvprr3unqmp3vgcnng4qa3xpgl6';

      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Make.com automation triggered successfully');
      
      // Update order in backend with email
      try {
        console.log('🔍 Looking for verification data...');
        
        const orderId = verification.orderId;
        console.log('🆔 Order ID found:', orderId);
        
        if (orderId) {
          console.log('📧 Updating order email for order:', orderId);
          
          const orderUpdateResult = await updateOrderEmail({
            order_id: orderId,
            email: email
          });
          
          if (orderUpdateResult.success) {
            console.log('✅ Order email updated successfully:', orderUpdateResult.order);
          } else {
            console.error('❌ Failed to update order email:', orderUpdateResult.error);
          }
        } else {
          console.error('❌ No order ID found in verification data');
        }
      } catch (error) {
        console.error('❌ Error updating order email:', error);
      }
      
    } catch (error) {
      console.error('❌ Make.com automation failed:', error);
    }
  };

  const handleGoToSuccess = async () => {
    if (!paymentData || isTracking) return;
    
    setIsTracking(true);
    
    try {
      console.log('📊 Starting Meta conversion tracking...');
      
      // Track purchase event with email, phone number and click ID
      await trackPurchase(
        state.items,
        state.total,
        paymentData.orderId,
        paymentData.email,
        paymentData.clickId,
        paymentData.phoneNumber
      );
      
      console.log('✅ Meta conversion tracking completed');
      
      // Trigger make.com automation after Meta conversion tracking
      if (paymentData.email) {
        const products = state.items.map(item => getProductById(item.product_id)).filter(Boolean) as Product[];
        await triggerMakeAutomation(paymentData.email, products, paymentData, paymentData.phoneNumber);
        console.log('✅ Make.com automation completed');
      }
      
      // Wait 2 seconds to ensure Meta receives the data
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Navigate to success page
      const productIds = state.items.map(item => item.product_id).join(',');
      router.push(`/success?products=${productIds}`);
      
    } catch (error) {
      console.error('❌ Error during Meta conversion tracking:', error);
      // Still navigate even if tracking fails
      const productIds = state.items.map(item => item.product_id).join(',');
      router.push(`/success?products=${productIds}`);
    }
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
                ? "Processing your order and reporting conversion data to Meta. This will take a few seconds..."
                : "You'll be redirected to the download page where you can access all your purchased business guides and bonus resources."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 