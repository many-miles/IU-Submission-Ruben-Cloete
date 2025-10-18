"use client";

import React, { useEffect, useState } from 'react';
import { MapPinIcon } from 'lucide-react';
import { Location, calculateDistance, formatDistance, getUserLocation } from '@/lib/distance';

export default function ServiceDistance({ location }: { location?: Location | null }) {
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) {
      setLoading(false);
      return;
    }

    let mounted = true;

    getUserLocation()
      .then((userLoc) => {
        if (!mounted) return;
        const d = calculateDistance(userLoc, location!);
        setDistance(d);
      })
      .catch(() => {
        // If user denies or geolocation fails, leave distance null
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [location]);

  if (!location) return null;

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-gray-600">
        <MapPinIcon className="w-4 h-4 text-gray-500" />
        <span>Calculating distance…</span>
      </p>
    );
  }

  if (distance === null) return null;

  return (
    <p className="flex items-center gap-2 text-sm text-gray-700">
      <MapPinIcon className="w-4 h-4 text-gray-500" />
      <span>Approximately {formatDistance(distance)}</span>
    </p>
  );
}
