
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
      // Using the provided API key
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
        // Default to Caritas University coordinates (more accurate)
        const caritasPosition = { lat: 6.4700, lng: 7.5413 }; // Updated coordinates for accuracy
        
        const mapOptions = {
          zoom: 16,
          center: caritasPosition,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi.business",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "poi.school",
              elementType: "labels",
              stylers: [{ visibility: "on" }]
            },
            {
              featureType: "transit",
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
                title: "PFCU - " + address,
                animation: window.google.maps.Animation.DROP,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: '#8B5CF6', // Purple to match theme
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: 10
                }
              });
              
              // Add info window with address
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div class="p-3">
                    <div class="font-semibold text-purple-800 mb-1">Pentecostal Fellowship of Caritas University</div>
                    <div class="text-sm text-gray-600">${address}</div>
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
            } else {
              console.warn(`Geocoding failed, using default coordinates for: ${address}`);
              // Fall back to default position
              map.setCenter(caritasPosition);
              const marker = new window.google.maps.Marker({
                map,
                position: caritasPosition,
                title: "PFCU - Caritas University",
                animation: window.google.maps.Animation.DROP,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: '#8B5CF6',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: 10
                }
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
              
              setTimeout(() => {
                infoWindow.open(map, marker);
              }, 1000);
            }
          });
        } else {
          // Use default position if no address
          const marker = new window.google.maps.Marker({
            map,
            position: caritasPosition,
            title: "PFCU - Caritas University",
            animation: window.google.maps.Animation.DROP,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#8B5CF6',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 10
            }
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
          
          setTimeout(() => {
            infoWindow.open(map, marker);
          }, 1000);
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
