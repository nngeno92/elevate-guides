import Image from 'next/image';

export default function BonusResources() {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 text-4xl">🎁</div>
        <div className="absolute bottom-4 left-4 text-3xl">🔥</div>
        <div className="absolute top-1/2 left-1/4 text-2xl">💡</div>
      </div>
      
      <div className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* Content */}
          <div className="space-y-4">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎁 Bonus Resources Included
              </h2>
              <p className="text-base text-gray-700 mb-4">
                Buy today and also get our Business in Kenya Mobile App with exclusive access to:
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-xl">🧠</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">In-depth Analysis</h3>
                  <p className="text-gray-700 text-xs">100+ Business Ideas in Kenya</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-xl">💡</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">General Business Tips</h3>
                  <p className="text-gray-700 text-xs">To Be Profitable</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-xl">📲</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Daily Digital Marketing Tips</h3>
                  <p className="text-gray-700 text-xs">Stay ahead of the competition</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="text-xl">🧮</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Business Tools</h3>
                  <p className="text-gray-700 text-xs">Tax, Loan & Profit Calculators</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
              <p className="text-red-800 font-semibold text-sm">
                🔥 Bonuses available for a limited time only!
              </p>
            </div>
          </div>
          
          {/* App Thumbnail */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-4 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="https://businessinkenya.co.ke/wp-content/uploads/2025/05/business_in_kenya_app_mockup_transparent.webp"
                  alt="Business in Kenya Mobile App"
                  width={300}
                  height={400}
                  className="rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 