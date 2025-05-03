
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";

interface GoogleMapProps {
  address?: string;
  height?: string;
}

declare global {
  interface Window {
    initMap: () => void;
    google?: any;
  }
}

const GoogleMap = ({ 
  address = "Caritas University, Enugu, Nigeria", 
  height = "400px" 
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Function to load Google Maps API
    const loadGoogleMapsAPI = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }
      
      const googleMapScript = document.createElement('script');
      // Using a valid API key for production
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCrw5o26thUGFYdC7fwNDH_dZVZYKGLYdQ&libraries=places&callback=initMap`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      
      // Define the global callback function
      window.initMap = () => {
        setMapLoaded(true);
        initializeMap();
      };
      
      googleMapScript.onerror = () => {
        console.error('Failed to load Google Maps API');
        setError('Map failed to load. Please try again later.');
      };
      
      window.document.body.appendChild(googleMapScript);
    };
    
    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;
      
      try {
        // Default to Caritas University coordinates
        const defaultPosition = { lat: 6.4698, lng: 7.5101 };
        
        const mapOptions = {
          zoom: 15,
          center: defaultPosition,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        };
        
        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        
        // If address is provided, try to geocode it
        if (address) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address }, (results: any, status: any) => {
            if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
              const position = results[0].geometry.location;
              map.setCenter(position);
              
              const marker = new window.google.maps.Marker({
                map,
                position,
                title: address,
                animation: window.google.maps.Animation.DROP,
              });
              
              // Add info window with address
              const infoWindow = new window.google.maps.InfoWindow({
                content: `<div class="p-2 text-sm"><strong>PFCU</strong><br>${address}</div>`
              });
              
              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });
              
              // Open info window by default
              infoWindow.open(map, marker);
            } else {
              console.warn(`Geocoding failed for address: ${address}`);
              setError(`Couldn't find exact location for: ${address}`);
              // Fall back to default position
              map.setCenter(defaultPosition);
              new window.google.maps.Marker({
                map,
                position: defaultPosition,
                title: "Caritas University",
                animation: window.google.maps.Animation.DROP,
              });
            }
          });
        } else {
          // Use default position if no address
          const marker = new window.google.maps.Marker({
            map,
            position: defaultPosition,
            title: "Caritas University",
            animation: window.google.maps.Animation.DROP,
          });
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div class="p-2 text-sm"><strong>PFCU</strong><br>Caritas University</div>`
          });
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
          
          // Open info window by default
          infoWindow.open(map, marker);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map. Please refresh the page.');
      }
    };
    
    loadGoogleMapsAPI();
    
    // Clean up
    return () => {
      window.initMap = undefined;
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [address]);

  // Handle external navigation to the location
  const handleGetDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="relative w-full">
      <div 
        ref={mapRef} 
        className="w-full rounded-lg overflow-hidden border border-gray-300 shadow-md relative"
        style={{ height }}
      >
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 flex-col p-4">
            <MapIcon className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-center mb-3">{error}</p>
            <Button onClick={handleGetDirections} variant="outline" size="sm">
              View on Google Maps
            </Button>
          </div>
        )}
      </div>
      <div className="mt-3 flex justify-end">
        <Button 
          onClick={handleGetDirections}
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1"
        >
          <MapIcon className="h-3 w-3" />
          <span>Get Directions</span>
        </Button>
      </div>
    </div>
  );
};

export default GoogleMap;
