'use client';

import Header from '@/components/Header';
import { ExternalLink, Calendar, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const blogPosts = [
  {
    id: 1,
    title: "Comprehensive Guide to Importing Goods from Dubai to Kenya",
    description: "Learn everything about importing goods from Dubai to Kenya, including regulations, documentation, shipping methods, and customs clearance procedures.",
    url: "https://businessinkenya.co.ke/importing-goods-from-dubai-to-kenya/",
    readTime: "15 min read",
    category: "Import/Export",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 2,
    title: "Top 12 Import and Export Companies in Kenya",
    description: "Discover the leading import and export companies in Kenya that are driving international trade and business growth in the region.",
    url: "https://businessinkenya.co.ke/top-12-import-and-export-companies-in-kenya/",
    readTime: "12 min read",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
  },
  {
    id: 3,
    title: "Most Profitable Items to Import from China to Kenya in 2025",
    description: "Explore the most profitable items to import from China to Kenya in 2025, including market analysis and business opportunities.",
    url: "https://businessinkenya.co.ke/most-profitable-items-to-import-from-china-to-kenya/",
    readTime: "18 min read",
    category: "Import/Export",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Insights & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights on importing, exporting, and growing your business in Kenya. 
            Discover valuable tips, strategies, and opportunities for business success.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Blog Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#6528F7] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>2025</span>
                  </div>
                </div>

                {/* Read More Button */}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-[#6528F7] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors duration-200 group"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#6528F7] to-[#5a1fd8] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Business Insights</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest business tips, import/export guides, and market opportunities delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button className="bg-white text-[#6528F7] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="#"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="h-6 w-6 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="font-semibold text-gray-900">Import/Export</h3>
              <p className="text-sm text-gray-600 mt-1">Trade guides</p>
            </a>
            
            <a
              href="#"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="h-6 w-6 text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="font-semibold text-gray-900">Business Plans</h3>
              <p className="text-sm text-gray-600 mt-1">Startup guides</p>
            </a>
            
            <a
              href="#"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="h-6 w-6 text-purple-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="font-semibold text-gray-900">Marketing</h3>
              <p className="text-sm text-gray-600 mt-1">Growth strategies</p>
            </a>
            
            <a
              href="#"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 text-center group"
            >
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="h-6 w-6 text-orange-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <h3 className="font-semibold text-gray-900">Finance</h3>
              <p className="text-sm text-gray-600 mt-1">Money management</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 