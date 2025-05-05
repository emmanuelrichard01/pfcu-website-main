
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Navigation } from "lucide-react";

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
  address = "Caritas University, Amorji-Nike, Enugu", 
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
      // Using the API key but with proper error handling
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
        setError('Map failed to load. This could be due to API restrictions or network issues.');
      };
      
      window.document.body.appendChild(googleMapScript);
    };
    
    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;
      
      try {
        // Default to Caritas University coordinates (more accurate)
        const caritasPosition = { lat: 6.4700, lng: 7.5413 }; // Updated coordinates
        
        const mapOptions = {
          zoom: 16,
          center: caritasPosition,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
          // Removing any styling that might cause issues
          styles: [
            {
              featureType: "poi.business",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        };
        
        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        
        // Create marker and info window
        const marker = new window.google.maps.Marker({
          map,
          position: caritasPosition,
          title: "PFCU - Caritas University",
          animation: window.google.maps.Animation.DROP
        });
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3">
              <div class="font-semibold text-purple-800 mb-1">Pentecostal Fellowship of Caritas University</div>
              <div class="text-sm text-gray-600">Caritas University, Amorji-Nike, Enugu</div>
            </div>
          `
        });
        
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
        
        // Open info window by default after a short delay (better UX)
        setTimeout(() => {
          infoWindow.open(map, marker);
        }, 1000);
        
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map. Please refresh the page or try again later.');
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
        className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-md relative"
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
          className="flex items-center gap-1.5 hover:bg-pfcu-purple hover:text-white transition-colors"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Get Directions</span>
        </Button>
      </div>
    </div>
  );
};

export default GoogleMap;
