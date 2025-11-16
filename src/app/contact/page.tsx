'use client';

import Header from '@/components/Header';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📞 CONTACT US PAGE</h1>
          <p className="text-gray-700">We&apos;re Here to Help You Elevate</p>
          <p className="text-gray-700">Have a question, need help downloading, or want a guide recommendation?</p>
          <p className="text-gray-700">We respond fast because your growth matters.</p>
        </div>

        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900">📧 Email Us</h2>
          <p className="text-gray-700">info@elevateguides.co.ke</p>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900">💬 WhatsApp (Preferred)</h2>
          <p className="text-gray-700">Click to chat instantly:</p>
          <p className="text-gray-900 font-semibold">+254 724659062</p>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900">📱 Follow & DM Us</h2>
          <p className="text-gray-700">We’re active on social media:</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>• Facebook: Elevate Guides Africa</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900">🕒 Support Hours</h2>
          <p className="text-gray-700">Mon – Sat: 8:00 AM – 9:00 PM</p>
          <p className="text-gray-700">Sun & Holidays: 10:00 AM – 6:00 PM</p>
        </section>

        <div className="text-center text-gray-800 font-medium pt-2">
          Let’s elevate Africa, one guide at a time.
        </div>
      </div>
    </div>
  );
} 