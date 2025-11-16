'use client';

import Header from '@/components/Header';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">💼 What We Offer</h1>
          <p className="text-gray-700">At Elevate Guides Africa, we deliver high-quality digital guides designed to help you take real action — not just read and forget.</p>
        </div>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">📘 1. Digital Guide Library</h2>
          <p className="text-gray-700">Instant-access downloadable PDFs covering:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>• Business start-up guides</li>
            <li>• Workout & fitness programs</li>
            <li>• Side hustle blueprints</li>
            <li>• Skill-building and self-improvement</li>
          </ul>
          <p className="text-gray-700">Perfect for:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>✔ Entrepreneurs</li>
            <li>✔ Fitness lovers</li>
            <li>✔ Job seekers</li>
            <li>✔ Hustlers & creatives</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">🛒 2. Bundled Collections</h2>
          <p className="text-gray-700">We offer themed bundles for maximum value:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>• Strength & Shape Complete Fitness Bundle</li>
            <li>• Business Plans Bundle</li>
            <li>• Digital Side Hustle Starter Pack</li>
          </ul>
          <p className="text-gray-700 font-medium">Bundles = bigger savings + more value.</p>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">🎯 3. Personalized Guide Recommendations</h2>
          <p className="text-gray-700">Not sure where to start?</p>
          <p className="text-gray-700">We help you pick the right guide based on:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>• Your goals</li>
            <li>• Your level</li>
            <li>• Your resources</li>
          </ul>
          <p className="text-gray-700">We’re not just selling PDFs — we’re building a knowledge ecosystem for Africa.</p>
        </section>
      </div>
    </div>
  );
}