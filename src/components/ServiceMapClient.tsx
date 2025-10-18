// src/components/ServiceMapClient.tsx

"use client";

import dynamic from "next/dynamic";
import { MapService } from "@/types/service";

/**
 * Dynamically import the main ServiceMap component.
 * This ensures the map is only rendered on the client side,
 * preventing server-side rendering issues with Leaflet (which depends on `window`).
 */
const ServiceMap = dynamic(() => import("@/components/ServiceMap"), {
  ssr: false, // disable server-side rendering
});

interface Props {
  services: MapService[]; // Array of services to display on the map
  height?: string;        // Optional height for the map container
  zoom?: number;          // Optional initial zoom level
}

/**
 * ServiceMapClient Component
 * 
 * Lightweight wrapper that loads the full ServiceMap component dynamically.
 * Benefits:
 * - Avoids SSR errors with Leaflet
 * - Lets you pass in services, height, and zoom
 * - Keeps the main component clean and focused
 */
export default function ServiceMapClient({ services, height = "500px", zoom = 12 }: Props) {
  return <ServiceMap services={services} height={height} zoom={zoom} />;
}
