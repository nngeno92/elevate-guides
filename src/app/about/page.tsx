import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Elevate Guides Africa</h1>
          <p className="text-gray-700">
            We create practical digital guides that help Africans learn faster, apply knowledge, and achieve real results — in business, fitness, careers, and skills.
          </p>
        </div>
      </div>
    </div>
  );
} 