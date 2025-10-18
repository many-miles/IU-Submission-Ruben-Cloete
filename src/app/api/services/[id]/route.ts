// src/app/api/services/[id]/route.ts

import { NextResponse } from 'next/server';
import servicesData from '@/data/services.json';

/**
 * GET handler for fetching a single service by its ID.
 * 
 * Searches the server-side JSON database for the requested service.
 * Returns 404 if the service is not found.
 * 
 * @param request - Incoming HTTP request object
 * @param params - URL parameters containing the service ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Attempt to find the service in the JSON database
  const service = servicesData.services.find(s => s._id === params.id);
  
  // Return 404 if service is not found
  if (!service) {
    return NextResponse.json(
      { error: 'Service not found' }, 
      { status: 404 }
    );
  }
  
  // Return the found service as JSON
  return NextResponse.json(service);
}

/**
 * PATCH handler to update service data.
 * 
 * Note: This is a placeholder for future implementation.
 * Currently, view counting is handled client-side via localStorage.
 * For production, this would update the database.
 * 
 * @param request - Incoming HTTP request object
 * @param params - URL parameters containing the service ID
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Parse request body for future use
  const body = await request.json();
  
  // In production, this would update the JSON file or database
  // For now, view counting is handled client-side
  
  // Respond with success message
  return NextResponse.json({ 
    success: true,
    message: 'View count updated client-side' 
  });
}