'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '@/types';

interface ReviewsSliderProps {
  reviews: Review[];
}

export default function ReviewsSlider({ reviews }: ReviewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToReview = (direction: 'prev' | 'next') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Responsive card width calculation
    const isMobile = window.innerWidth < 640; // sm breakpoint
    const cardWidth = isMobile ? 320 : 384; // w-80 = 320px, w-96 = 384px
    const gap = 24; // Gap between cards (space-x-6 = 24px)
    const totalCardWidth = cardWidth + gap;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, reviews.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    
    const scrollPosition = newIndex * totalCardWidth;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentIndex(newIndex);
  };

  // Update currentIndex based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Responsive card width calculation
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const cardWidth = isMobile ? 320 : 384; // w-80 = 320px, w-96 = 384px
      const gap = 24;
      const totalCardWidth = cardWidth + gap;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / totalCardWidth);
      setCurrentIndex(Math.max(0, Math.min(newIndex, reviews.length - 1)));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [reviews.length]);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < reviews.length - 1;

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">
              4.8 ({reviews.length} reviews)
            </span>
            <span className="ml-2 text-sm text-green-600">
              {reviews.filter(review => review.stars === 5).length} five-star reviews
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => scrollToReview('prev')}
            disabled={!canScrollLeft}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => scrollToReview('next')}
            disabled={!canScrollRight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Reviews Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{review.name}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.stars
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const container = scrollContainerRef.current;
              if (container) {
                // Responsive card width calculation
                const isMobile = window.innerWidth < 640; // sm breakpoint
                const cardWidth = isMobile ? 320 : 384; // w-80 = 320px, w-96 = 384px
                const gap = 24;
                const totalCardWidth = cardWidth + gap;
                const scrollPosition = index * totalCardWidth;
                
                container.scrollTo({
                  left: scrollPosition,
                  behavior: 'smooth'
                });
                
                setCurrentIndex(index);
              }
            }}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentIndex ? 'bg-[#6528F7]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 