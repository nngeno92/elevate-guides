'use client';

import { useEffect } from 'react';
import { initUTMTracking } from '@/lib/analytics';

export default function UTMTracker() {
  useEffect(() => {
    // Initialize UTM tracking on component mount
    initUTMTracking();
  }, []);

  return null; // This component doesn't render anything
} 