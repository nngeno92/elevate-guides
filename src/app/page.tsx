import Header from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#6528F7] via-[#6b36ff] to-[#5a1fd8] text-white py-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Welcome to Elevate Guides Africa
            </h1>
            <p className="text-lg md:text-xl text-purple-100 leading-relaxed">
              Your trusted source for practical, ready-to-use digital guides designed to help you learn, grow, and take action anytime, anywhere.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-[#6528F7] font-semibold hover:bg-purple-50 transition-colors">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <p className="text-gray-700 text-lg">
            We specialize in ebooks, business plans, fitness programs, career guides, and skill-building resources tailored for the African market. Whether you&apos;re looking to start a business, level up your fitness, or acquire high-income skills, we make learning easier, faster, and affordable.
          </p>
          <h2 className="text-3xl font-bold text-gray-900">Learn. Apply. Elevate.</h2>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">⚡ Why Choose Elevate Guides Africa?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '100% downloadable & offline-friendly',
              'Created for Kenyan & African audiences',
              'Proven guides used by thousands',
              'Instant access to start learning immediately',
              'Affordable, practical, results-focused',
              'Mobile-first and easy to use',
            ].map((text) => (
              <div key={text} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-sm font-medium text-gray-800">✔ {text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 Our Growing Library Includes:</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Business & Entrepreneurship Guides',
              'Fitness Programs & Meal Plans',
              'Personal Development Resources',
              'Digital Skills & Online Hustle Playbooks',
            ].map((text) => (
              <div key={text} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-gray-800">• {text}</div>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-gray-300 p-4 text-gray-600">
              … and much more coming soon.
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">✨ Our Mission</h3>
          <p className="text-gray-700 text-lg">
            To empower you with knowledge that creates growth – financially, mentally, and physically.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Accessible', desc: 'Available anytime, anywhere' },
              { title: 'Affordable', desc: 'Great value for everyone' },
              { title: 'Actionable', desc: 'Learn today, apply today' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="text-lg font-semibold text-gray-900 mb-1">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-3xl font-extrabold text-gray-900">🛍️ Start Learning Today</h3>
          <p className="text-gray-700 text-lg">Browse our digital library & transform your goals into reality. Your next level is one guide away.</p>
          <div className="pt-2 flex items-center justify-center">
            <Link href="/products" className="inline-flex items-center justify-center bg-[#6528F7] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5a1fd8] transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}