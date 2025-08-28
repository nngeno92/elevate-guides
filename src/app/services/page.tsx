'use client';

import Header from '@/components/Header';
import { Code, Globe, Smartphone, Database, Shield, Zap, Users, TrendingUp } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Web Design & Software Development
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your business with custom web solutions and innovative software development. 
            We create powerful, scalable applications that drive growth and efficiency.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Web Design Service */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Web Design & Development</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Create stunning, responsive websites that convert visitors into customers. 
              From simple landing pages to complex e-commerce platforms, we build websites 
              that look great and perform even better.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Responsive Design (Mobile-First)</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">E-commerce & Payment Integration</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">SEO Optimization</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Content Management Systems</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Performance Optimization</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Technologies We Use:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">React</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Next.js</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">WordPress</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Shopify</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
              </div>
            </div>
          </div>

          {/* Custom Software Development */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl mr-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Custom Software Development</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Build powerful, scalable software solutions tailored to your business needs. 
              From internal tools to customer-facing applications, we develop software 
              that streamlines operations and drives innovation.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Business Process Automation</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Mobile Applications (iOS/Android)</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">API Development & Integration</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Database Design & Management</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Cloud Deployment & DevOps</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Technologies We Use:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Python</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">React Native</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">PostgreSQL</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">AWS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Our Services?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick turnaround times without compromising quality</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 text-sm">Built with security best practices and robust architecture</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600 text-sm">Experienced developers with proven track records</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Scalable Solutions</h3>
              <p className="text-gray-600 text-sm">Built to grow with your business needs</p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Development Process</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#6528F7] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600 text-sm">Understanding your requirements and business goals</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#6528F7] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
              <p className="text-gray-600 text-sm">Creating detailed project roadmap and architecture</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#6528F7] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Development</h3>
              <p className="text-gray-600 text-sm">Building your solution with regular updates</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#6528F7] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Launch</h3>
              <p className="text-gray-600 text-sm">Deployment and ongoing support</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#6528F7] to-[#5a1fd8] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let&apos;s discuss your project and create something amazing together.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:info@businessinkenya.co.ke"
              className="bg-white text-[#6528F7] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Get Free Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 