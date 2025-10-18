//src/components/ServiceCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon, MapPinIcon, PhoneIcon, DollarSignIcon, RadiusIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { formatDistance } from "@/lib/distance";
import { ServiceTypeCard } from "@/types/service";
import { getServiceViews } from "@/lib/local-storage";

interface ServiceCardProps {
  post: ServiceTypeCard; // The service object to display. Contains all details about the service.
}

/**
 * ServiceCard Component
 * 
 * Displays a single service in a card format.
 * Includes:
 * - Image with hover effect
 * - Title, category, and description
 * - Details like location, price range, service radius, and contact method
 * - Author info and link to full service page
 * - Views counter stored in local storage
 */
export default function ServiceCard({ post }: ServiceCardProps) {
  const {
    _id,
    _createdAt,
    title,
    category,
    image,
    description,
    author,
    priceRange,
    contactMethod,
    serviceRadius,
    location,
  } = post;

  // Track how many times this service has been viewed (from localStorage)
  const [views, setViews] = useState(0);

  // Load views on mount
  useEffect(() => {
    const viewsData = getServiceViews();
    setViews(viewsData[_id] || 0);
  }, [_id]);

  /**
   * Convert internal price range codes to human-readable strings
   * e.g. "budget" => "R0 - R100", "quote" => "Contact for Quote"
   */
  const getPriceDisplay = (price: string | null) => {
    if (!price) return null;
    const priceMap: Record<string, string> = {
      free: "Free",
      budget: "R0 - R100",
      moderate: "R100 - R500",
      premium: "R500 - R1000",
      luxury: "R1000+",
      quote: "Contact for Quote",
    };
    return priceMap[price] || price;
  };

return (
  <article className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all flex flex-col relative">
    
    {/* Featured Badge */}
    {post.featured && (
      <div className="absolute top-3 right-3 z-10 bg-amber-100 text-black text-[10px] font-extrabold px-2 py-1 rounded-lg border-2 border-black shadow-md uppercase tracking-wide">
        Featured
      </div>
    )}
      
      {/* Image section */}
      {image && (
        <Link href={`/service/${_id}`} className="relative block aspect-video">
          <Image
            src={image}
            alt={title || "Service image"} // Fallback alt for accessibility
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105" // Smooth zoom on hover
          />
          {/* Gradient overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      )}

      {/* Main content section */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Header: date created and views */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>{formatDate(_createdAt)}</p>
          <div className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" />
            <span>{views} view{views !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Title and category */}
        <div>
          <Link href={`/service/${_id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
              {title || "Untitled Service"}
            </h3>
          </Link>
          {category && (
            <p className="text-xs text-gray-500 uppercase mt-1">{category}</p>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        )}

        {/* Details section: location, price, radius, contact */}
        <div className="space-y-1 text-sm text-gray-700 pt-2 border-t border-gray-100">
          {location && (
            <p className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span>Jeffreys Bay</span>
            </p>
          )}

          {/* Show computed distance if API attached one */}
          {(post as any).distance !== undefined && (post as any).distance !== null && (
            <p className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span>{formatDistance((post as any).distance)}</span>
            </p>
          )}

          {priceRange && (
            <p className="flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4 text-gray-500" />
              <span>{getPriceDisplay(priceRange)}</span>
            </p>
          )}

          {serviceRadius && (
            <p className="flex items-center gap-2">
              <RadiusIcon className="w-4 h-4 text-gray-500" />
              <span>{serviceRadius} km radius</span>
            </p>
          )}

          {contactMethod && (
            <p className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-gray-500" />
              <span className="capitalize">{contactMethod} available</span>
            </p>
          )}
        </div>

        {/* Footer: author and view details link */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            {author?.image ? (
              <Image
                src={author.image}
                alt={author.name ?? "Service Image"}
                width={28}
                height={28}
                className="rounded-full border border-gray-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">
                  {(author?.name || "A")[0].toUpperCase()}
                </span>
              </div>
            )}
            <p className="text-sm font-medium text-gray-800 truncate">
              {author?.name || "Service Provider"}
            </p>
          </div>

          <Link
            href={`/service/${_id}`}
            className="bg-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
