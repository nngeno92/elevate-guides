import { CheckCircle, CreditCard, Shield } from 'lucide-react';

export default function ProductBenefits() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Instant Delivery */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Instant Delivery</h3>
            <p className="text-sm text-gray-600">Via Email or WhatsApp</p>
          </div>
        </div>

        {/* Convenient Payment */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Convenient Payment</h3>
            <p className="text-sm text-gray-600">Via Mpesa or Card</p>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">100% Money-Back</h3>
            <p className="text-sm text-gray-600">Guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
} 