'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Download, ExternalLink } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  receiptNumber: string;
  onClose: () => void;
}

export default function PaymentSuccessModal({ isOpen, receiptNumber, onClose }: PaymentSuccessModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is rendered before showing content
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Success Animation */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-8 text-center">
          <div className={`transition-all duration-700 ease-out transform ${
            showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}>
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-green-100">Your order has been confirmed</p>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 transition-all duration-700 delay-300 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="text-center mb-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Receipt Number</p>
              <p className="font-mono font-semibold text-gray-900">{receiptNumber}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Payment confirmed</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Download className="h-5 w-5" />
                <span className="text-sm font-medium">Resources ready for download</span>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6528F7]"></div>
              <span className="text-sm">Preparing your resources...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 