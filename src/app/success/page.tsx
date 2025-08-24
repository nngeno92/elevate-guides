'use client';

import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import { Download, CheckCircle, ArrowLeft, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { Product } from '@/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  useEffect(() => {
    // In a real app, you would get the purchased products from the order
    // For now, we'll show all products as an example
    const productIds = searchParams.get('products')?.split(',') || [];
    const products = productIds.map(id => getProductById(id)).filter(Boolean) as Product[];
    setPurchasedProducts(products);
  }, [searchParams]);

  const sendOrderToMakeWebhook = async (email: string) => {
    try {
      // Generate order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create product HTML
      const productHtml = purchasedProducts.map(product => `
        <li style="background:#f8f8f8; padding:10px; border-radius:5px; margin-bottom:10px; font-size:16px;">
          <strong>${product.product_name}</strong><br>
          <a class="download-link primary" href="${product.google_download_link}" target="_blank">Download</a>
          <a class="download-link secondary" href="${product.google_file_link}" target="_blank">Backup Download Link</a>
        </li>
      `).join('');

      // Create plain text email
      const productTextEmail = purchasedProducts.map(product => 
        `Product: ${product.product_name}\nGoogle Drive: ${product.google_download_link}\n`
      ).join('\n');

      // Get UTM parameters from URL
      const utmSource = searchParams.get('utm_source') || '';
      const utmMedium = searchParams.get('utm_medium') || '';
      const utmCampaign = searchParams.get('utm_campaign') || '';
      const utmTerm = searchParams.get('utm_term') || '';
      const utmContent = searchParams.get('utm_content') || '';

      const data = {
        order_id: orderId,
        total: purchasedProducts.reduce((sum, product) => sum + product.sale_price, 0),
        currency: 'KES',
        customer_email: email,
        customer_name: 'Customer', // Could be enhanced to collect name
        product_html: `<ul class="product-list" style="list-style:none; padding:0;">${productHtml}</ul>`,
        product_text_email: `Hi, incase you did not see the email with the order you made on Business in Kenya, you can find the same links below:\n\n${productTextEmail}`,
        products: purchasedProducts.map(product => product.product_name),
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

      return true;
    } catch (error) {
      console.error('Make.com API Request Error:', error);
      return false;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    const success = await sendOrderToMakeWebhook(email);
    setIsSubmitting(false);

    if (success) {
      setEmailSubmitted(true);
    } else {
      alert('Failed to submit email. Please try again.');
    }
  };

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
            
            {/* Bonus Mobile App Section */}
            <div className="border-t pt-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Bonus Gift: Mobile App Access!</h3>
                  <p className="text-gray-700 mb-4">
                    As a special thank you for your purchase, we&apos;re giving you exclusive access to our Business in Kenya Mobile App!
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📱 What&apos;s Included in Your Bonus:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• 🧠 In-depth Analysis of 100+ Business Ideas in Kenya</li>
                    <li>• 💡 General Business Tips to Be Profitable</li>
                    <li>• 📲 Daily Digital Marketing Tips</li>
                    <li>• 🧮 Business Tools – Tax, Loan & Profit Calculators</li>
                  </ul>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <p className="text-yellow-800 text-sm font-medium">🔥 Limited Time Bonus - Download Now!</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">⚠️ Important Installation Note:</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Because this is a direct app file (APK), your phone may ask you to allow installation from unknown sources. 
                    You may also need to temporarily disable Play Protect during installation. After installation, you can turn Play Protect back on for security.
                  </p>
                </div>
                
                <div className="text-center">
                  <a
                    href="https://drive.google.com/file/d/1YGs7DjBUEM7junRn6Rpf2e5Ag31PKocV/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Mobile App</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Email Collection Section */}
            <div className="border-t pt-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">📧 Get Resources via Email</h3>
                  <p className="text-gray-700 mb-4">
                    You can also provide your email for these resources to be shared directly to your inbox.
                  </p>
                </div>
                
                {!emailSubmitted ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Resources to Email</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold">✅ Email Submitted Successfully!</p>
                    <p className="text-green-700 text-sm mt-1">
                      Check your inbox for the download links. If you don&apos;t see it, please check your SPAM folder.
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 text-center">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> If you cannot see the email in your inbox, please check your SPAM folder.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h3>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Download your business guide(s)</li>
                  <li>• Review the content thoroughly</li>
                  <li>• Customize the plan for your specific needs</li>
                  <li>• Start implementing your business strategy</li>
                </ul>
              </div>
              
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