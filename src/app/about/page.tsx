import Header from '@/components/Header';
import { CheckCircle, Users, Award, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Business in Kenya
          </h1>
                      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are dedicated to empowering Kenyan entrepreneurs with the tools and knowledge they need to succeed in today&apos;s competitive business environment.
            </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To provide accessible, high-quality business plans and guides that help Kenyan entrepreneurs start and grow successful businesses. We believe that every entrepreneur deserves access to professional business resources.
            </p>
            <p className="text-gray-600">
              Our comprehensive business guides are designed specifically for the Kenyan market, taking into account local regulations, market conditions, and business practices.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-[#6528F7] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Local Expertise</h3>
                  <p className="text-gray-600 text-sm">All our business plans are tailored specifically for the Kenyan market.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-[#6528F7] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Access</h3>
                  <p className="text-gray-600 text-sm">Get your business plan immediately after payment - no waiting required.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-[#6528F7] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Mobile Friendly</h3>
                  <p className="text-gray-600 text-sm">Access your business guides on any device - phone, tablet, or computer.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-[#6528F7] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="text-gray-600 text-sm">Safe and secure MPESA payment processing for your convenience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#6528F7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
              <p className="text-gray-600">Entrepreneurs Helped</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#6528F7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <p className="text-gray-600">Business Plans Available</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#6528F7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <p className="text-gray-600">Secure Transactions</p>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="bg-[#6528F7] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Business Journey?</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Join thousands of successful entrepreneurs who have used our business guides to start and grow their businesses in Kenya.
          </p>
          <a
            href="/products"
            className="bg-white text-[#6528F7] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
          >
            Browse Our Business Guides
          </a>
        </div>
      </div>
    </div>
  );
} 