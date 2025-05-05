
import { useRef, useState, useEffect, useCallback } from "react";

interface UseGoogleMapOptions {
  center: google.maps.LatLngLiteral;
  zoom?: number;
  mapTypeId?: google.maps.MapTypeId;
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

  // Initialize map function
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || isMapInitialized) return;
    
    try {
      const mapOptions: google.maps.MapOptions = {
        zoom,
        center,
        mapTypeId: window.google.maps.MapTypeId[mapTypeId.toUpperCase() as keyof typeof google.maps.MapTypeId],
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
        styles
      };
      
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setIsMapInitialized(true);
    } catch (err) {
      console.error('Error initializing Google Map:', err);
    }
  }, [center, zoom, mapTypeId, styles, isMapInitialized]);

  return {
    mapRef,
    map,
    initializeMap,
    isMapInitialized
  };
}
