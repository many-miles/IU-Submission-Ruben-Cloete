// src/components/ServiceMap.tsx

"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ServiceTypeCard } from '@/types/service';

/**
 * Fix default Leaflet marker icons (required because Webpack/Next.js doesn't load them automatically)
 */
(L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Props for ServiceMap
 */
interface ServiceMapProps {
  services: Partial<ServiceTypeCard>[]; // Services to display on the map
  center?: [number, number];           // Initial map center coordinates
  zoom?: number;                       // Initial zoom level
  height?: string;                     // Map container height
}

/**
 * ServiceMap Component
 * 
 * Displays a Leaflet map with markers for each service.
 * Features:
 * - Lazy loads the map only on the client to avoid SSR issues
 * - Each service with a location gets a marker
 * - Popup shows title, category, price, author, and link to service
 * - Map has a default center (Jeffreys Bay) and zoom
 */
const ServiceMap = ({ 
  services, 
  center = [-34.0489, 24.9087], // Jeffreys Bay coordinates
  zoom = 13,
  height = "400px"
}: ServiceMapProps) => {
  
  // Track if we are on the client side
  const [isClient, setIsClient] = useState(false);

  // Only render the map on the client (Leaflet doesn't work on server)
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Placeholder while the map is not loaded
    return (
      <div 
        className="bg-gray-200 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div 
      style={{ height, position: 'relative', zIndex: 1 }} 
      className="rounded-lg overflow-hidden border-2 border-gray-300"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false} // Disable scroll zoom to avoid accidental zooming
      >
        {/* Map tiles from OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Place markers for each service */}
        {services.map((service) => (
          service.location && (
            <Marker
              key={service._id}
              position={[service.location.lat, service.location.lng]}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold text-black">{service.title || "Service"}</h3>
                  <p className="text-gray-600 capitalize">{service.category || "Other"}</p>
                  {service.priceRange && (
                    <p className="text-gray-600">Price: {service.priceRange}</p>
                  )}
                  {service.author && (
                    <p className="text-gray-500">By: {service.author.name || "Unknown"}</p>
                  )}
                  <a 
                    href={`/service/${service._id}`}
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    View Details →
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default ServiceMap;
