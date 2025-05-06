
import { useRef, useState, useEffect, useCallback } from "react";

interface UseGoogleMapOptions {
  center: google.maps.LatLngLiteral;
  zoom?: number;
  mapTypeId?: google.maps.MapTypeId | string;
  styles?: google.maps.MapTypeStyle[];
}

export function useGoogleMap({
  center,
  zoom = 16,
  mapTypeId = "roadmap",
  styles = []
}: UseGoogleMapOptions) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map function
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || isMapInitialized) return;
    
    try {
      // Convert string mapTypeId to google.maps.MapTypeId enum value
      let mapTypeIdValue: google.maps.MapTypeId;
      
      if (typeof mapTypeId === 'string') {
        mapTypeIdValue = google.maps.MapTypeId[mapTypeId.toUpperCase() as keyof typeof google.maps.MapTypeId] || 
                          google.maps.MapTypeId.ROADMAP;
      } else {
        mapTypeIdValue = mapTypeId;
      }
      
      const mapOptions: google.maps.MapOptions = {
        zoom,
        center,
        mapTypeId: mapTypeIdValue,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
        styles
      };
      
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setIsMapInitialized(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error initializing Google Map');
      console.error('Error initializing Google Map:', err);
    }
  }, [center, zoom, mapTypeId, styles, isMapInitialized]);

  return {
    mapRef,
    map,
    initializeMap,
    isMapInitialized,
    error
  };
}
