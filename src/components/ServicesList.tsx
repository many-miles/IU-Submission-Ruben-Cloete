// src/components/ServicesList.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { ServiceTypeCard } from '@/types/service';
import ServiceCard from '@/components/ServiceCard';
import { getUserLocation, calculateDistance } from '@/lib/distance';

/**
 * Services List Component
 *
 * Client-side wrapper that enriches the server-provided `initialServices`
 * with distance information when the user grants geolocation access.
 * 
 * Distance is calculated once and persisted across category changes.
 */
export default function ServicesList({
  initialServices,
  query,
  currentCategory,
}: {
  initialServices: ServiceTypeCard[];
  query?: string;
  currentCategory?: string;
}) {
  const [services, setServices] = useState<ServiceTypeCard[]>(initialServices);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hasTriedLocation, setHasTriedLocation] = useState(false);

  // Get user location once when component mounts
  useEffect(() => {
    if (hasTriedLocation) return;

    let mounted = true;

    async function fetchUserLocation() {
      try {
        const loc = await getUserLocation();
        if (mounted) {
          setUserLocation(loc);
          setHasTriedLocation(true);
        }
      } catch (e) {
        console.log('Could not get user location:', e);
        if (mounted) setHasTriedLocation(true);
      }
    }

    fetchUserLocation();

    return () => {
      mounted = false;
    };
  }, [hasTriedLocation]);

  // Calculate distance for services when user location or services change
  useEffect(() => {
    if (!userLocation) {
      setServices(initialServices);
      return;
    }

    // Add distance to each service
    const enrichedServices = initialServices.map((service) => ({
      ...service,
      // @ts-ignore - Adding distance property dynamically
      distance: service.location 
        ? calculateDistance(userLocation, service.location)
        : null,
    }));

    setServices(enrichedServices as ServiceTypeCard[]);
  }, [initialServices, userLocation]);

  // Client-side filtering (should match server-side)
  const filteredServices = query
    ? services.filter((s) =>
        (s.title ?? '').toLowerCase().includes(query.toLowerCase()) ||
        (s.description ?? '').toLowerCase().includes(query.toLowerCase()) ||
        (s.author?.name ?? '').toLowerCase().includes(query.toLowerCase()) ||
        (s.author?.username ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : services;

  return (
    <ul className="mt-7 card_grid">
      {filteredServices.length > 0 ? (
        filteredServices.map((post) => (
          <li key={post._id}>
            <ServiceCard post={post as any} />
          </li>
        ))
      ) : (
        <li className="col-span-full">
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-2">No services found</p>
            {query && (
              <p className="text-sm text-gray-400">
                Try adjusting your search term or <a href="/" className="text-primary hover:underline">clear filters</a>
              </p>
            )}
            {currentCategory && !query && (
              <p className="text-sm text-gray-400">
                No services in this category yet. <a href="/" className="text-primary hover:underline">View all services</a>
              </p>
            )}
          </div>
        </li>
      )}
    </ul>
  );
}