'use client';

import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import { Download, CheckCircle, ArrowLeft, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { Product } from '@/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [debugLogs, setDebugLogs] = useState<any>(null);
  
  useEffect(() => {
    // Check payment verification
    const checkPaymentVerification = () => {
      try {
        // Helper function to get cookie value
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
          return null;
        };

        // Try localStorage first, then cookie
        let storedVerification = localStorage.getItem('paymentVerification');
        let verificationSource = 'localStorage';
        
        if (!storedVerification) {
          // Try cookie if localStorage is empty
          storedVerification = getCookie('paymentVerification');
          verificationSource = 'cookie';
        }

        console.log('Verification check:', { storedVerification, verificationSource });

        if (!storedVerification) {
          // No payment verification found - redirect to home
          console.log('No verification found - redirecting to home');
          window.location.href = '/';
          return;
        }

        const verification = JSON.parse(storedVerification);
        const currentTime = Date.now();
        const timeDiff = currentTime - verification.timestamp;
        
        console.log('Verification data:', verification);
        console.log('Time difference (hours):', timeDiff / (1000 * 60 * 60));
        
        // Check if verification is within last 7 days (604800000 ms) since we're using cookies
        if (timeDiff > 604800000) {
          // Verification expired - redirect to home
          console.log('Verification expired - redirecting to home');
          localStorage.removeItem('paymentVerification');
          // Clear cookie too
          document.cookie = 'paymentVerification=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/';
          return;
        }

        // Check if product IDs match
        const urlProductIds = searchParams.get('products')?.split(',').filter(Boolean) || [];
        const verifiedProductIds = verification.productIds || [];
        
        console.log('Product ID comparison:', { urlProductIds, verifiedProductIds });
        
        if (urlProductIds.length === 0 || verifiedProductIds.length === 0) {
          // No products in URL or verification - redirect to home
          console.log('No products found - redirecting to home');
          localStorage.removeItem('paymentVerification');
          document.cookie = 'paymentVerification=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/';
          return;
        }

        // Check if at least one product ID matches
        const hasMatchingProduct = urlProductIds.some(id => verifiedProductIds.includes(id));
        console.log('Product match result:', hasMatchingProduct);
        
        if (!hasMatchingProduct) {
          // Product IDs don't match - redirect to home
          console.log('Product IDs don\'t match - redirecting to home');
          localStorage.removeItem('paymentVerification');
          document.cookie = 'paymentVerification=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/';
          return;
        }

        // Verification successful - load products
        const products = urlProductIds.map(id => getProductById(id)).filter(Boolean) as Product[];
        setPurchasedProducts(products);
        setIsAuthorized(true);
        setIsLoading(false);
        
        // Set customer email from verification data
        if (verification.email) {
          setCustomerEmail(verification.email);
        }
        
        console.log('Verification successful - access granted');
        
        // Don't clear verification - let it persist for the full 7 days
        // This allows users to return to the success page multiple times
        
      } catch (error) {
        console.error('Error checking payment verification:', error);
        // Error occurred - redirect to home
        localStorage.removeItem('paymentVerification');
        window.location.href = '/';
      }
    };

    checkPaymentVerification();

    // Retrieve debug logs for order creation
    const storedLogs = localStorage.getItem('orderCreationLogs');
    if (storedLogs) {
      try {
        const logs = JSON.parse(storedLogs);
        setDebugLogs(logs);
        console.log('📋 Retrieved order creation logs:', logs);
      } catch (error) {
        console.error('Error parsing debug logs:', error);
      }
    }

    // Don't clear verification automatically - let it persist for 7 days
    // Users can return to the success page multiple times during this period
  }, [searchParams]);

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6528F7]"></div>
              <span className="text-gray-600">Verifying your purchase...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized state (this should redirect automatically, but just in case)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-8">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Access Denied
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                This page is only accessible after a successful payment.
              </p>
              <Link
                href="/"
                className="bg-[#6528F7] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors duration-200"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-8">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. You can now download your business guides.
            </p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Downloads</h2>
            
            {purchasedProducts.length > 0 ? (
              <div className="space-y-4">
                {purchasedProducts.map((product) => (
                  <div key={product.product_id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.product_name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{product.short_description}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={product.google_download_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 bg-[#6528F7] text-white px-4 py-2 rounded-lg hover:bg-[#5a1fd8] transition-colors duration-200 text-sm font-medium"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Guide</span>
                      </a>
                      <a
                        href={product.google_download_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 border border-[#6528F7] text-[#6528F7] px-4 py-2 rounded-lg hover:bg-[#6528F7] hover:text-white transition-colors duration-200 text-sm font-medium"
                      >
                        <span>View Details</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Your business guides are ready for download. Please check your email for download links.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> If you don&apos;t see your downloads above, please check your email or contact our support team.
                  </p>
                </div>
              </div>
            )}
            
            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="flex items-center justify-center space-x-2 bg-[#6528F7] text-white px-6 py-3 rounded-lg hover:bg-[#5a1fd8] transition-colors duration-200 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Browse More Products</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center space-x-2 border border-[#6528F7] text-[#6528F7] px-6 py-3 rounded-lg hover:bg-[#6528F7] hover:text-white transition-colors duration-200 font-medium"
                >
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Debug Section - Only show in development */}
          {debugLogs && process.env.NODE_ENV === 'development' && (
            <div className="mt-8 border-t pt-6">
              <details className="bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  🔍 Debug: Order Creation Logs
                </summary>
                <div className="text-left text-sm">
                  <div className="mb-2">
                    <strong>Timestamp:</strong> {debugLogs.timestamp}
                  </div>
                  <div className="mb-2">
                    <strong>Success:</strong> {debugLogs.success ? '✅ Yes' : '❌ No'}
                  </div>
                  <div className="mb-2">
                    <strong>Order Data:</strong>
                    <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                      {JSON.stringify(debugLogs.orderData, null, 2)}
                    </pre>
                  </div>
                  <div className="mb-2">
                    <strong>Order Result:</strong>
                    <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                      {JSON.stringify(debugLogs.orderResult, null, 2)}
                    </pre>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('orderCreationLogs');
                      setDebugLogs(null);
                    }}
                    className="text-red-600 text-xs hover:text-red-800"
                  >
                    Clear Debug Logs
                  </button>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6528F7] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
} 