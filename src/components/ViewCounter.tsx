//src/components/ViewCounter.tsx

"use client";

import { useEffect, useState, useRef } from 'react';
import { EyeIcon } from 'lucide-react';
import { getServiceViews, incrementServiceView } from '@/lib/local-storage';

/**
 * ViewCounter Component
 * 
 * Displays and tracks the number of times a service has been viewed.
 * Stores views in localStorage for persistence.
 *
 * Props:
 * - serviceId: string → Unique ID of the service
 * - floating?: boolean → If true, shows a floating counter at bottom-right
 */
export default function ViewCounter({ serviceId, floating = false }: { 
  serviceId: string;
  floating?: boolean;
}) {
  const [views, setViews] = useState(0);         // Current view count
  const hasIncremented = useRef(false);          // Prevent multiple increments per session

  useEffect(() => {
    try {
      const viewsData = getServiceViews();        // Load all stored views
      const currentViews = viewsData[serviceId] || 0;

      // Only increment once per client session
      if (typeof window !== 'undefined' && !hasIncremented.current) {
        hasIncremented.current = true;
        const newViewCount = incrementServiceView(serviceId); // Increment and persist
        setViews(newViewCount);
      } else {
        setViews(currentViews);                   // Just display existing views
      }
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  }, [serviceId]);

  // Floating style variant
  if (floating) {
    return (
      <div
        style={{ zIndex: 9999 }}
        className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 border border-gray-200"
      >
        <EyeIcon className="w-5 h-5 text-gray-600" />
        <span className="font-medium">
          {views} view{views !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  // Inline style variant
  return (
    <div className="inline-flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
      <EyeIcon className="w-4 h-4" />
      {views} view{views !== 1 ? 's' : ''}
    </div>
  );
}
