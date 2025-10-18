// src/components/ServiceMapWrapper.tsx

"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ServiceTypeCard } from "@/types/service";

// Dynamically import ServiceMap with SSR disabled
const ServiceMap = dynamic(() => import("@/components/ServiceMap"), { ssr: false });

interface ServiceMapWrapperProps {
  services: Partial<ServiceTypeCard>[]; // Array of services to display
  center: [number, number];             // Map center coordinates [lat, lng]
  height?: string;                      // Optional map height
  zoom?: number;                        // Optional zoom level
}

/**
 * ServiceMapWrapper Component
 * 
 * Wraps the client-side ServiceMap with Suspense.
 * Provides:
 * - Fallback UI while the map is loading
 * - Safe client-side only rendering
 * - Accepts services, map center, height, and zoom
 */
export default function ServiceMapWrapper({ services, center, height, zoom }: ServiceMapWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      }
    >
      <ServiceMap
        services={services}
        center={center}
        height={height}
        zoom={zoom}
      />
    </Suspense>
  );
}
