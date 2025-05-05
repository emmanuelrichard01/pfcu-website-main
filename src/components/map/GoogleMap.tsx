
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Navigation } from "lucide-react";
import { useGoogleMap } from "@/hooks/useGoogleMap";
import GoogleMapLoader from "./GoogleMapLoader";
import GoogleMapMarker from "./GoogleMapMarker";

interface GoogleMapProps {
  address?: string;
  height?: string;
}

const GoogleMap = ({ 
  address = "Caritas University, Amorji-Nike, Enugu", 
  height = "400px" 
}: GoogleMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Caritas University coordinates (more accurate)
  const caritasPosition = { lat: 6.4700, lng: 7.5413 };
  
  // Use custom hook for map functionality
  const { mapRef, map, initializeMap } = useGoogleMap({
    center: caritasPosition,
    styles: [
      {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  // Handle API loading completion
  const handleMapLoad = () => {
    setMapLoaded(true);
    initializeMap();
  };

  // Handle external navigation to the location
  const handleGetDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  // Custom info window content
  const infoWindowContent = `
    <div class="p-3">
      <div class="font-semibold text-purple-800 mb-1">Pentecostal Fellowship of Caritas University</div>
      <div class="text-sm text-gray-600">Caritas University, Amorji-Nike, Enugu</div>
    </div>
  `;

  return (
    <div className="relative w-full">
      {/* Load Google Maps API */}
      <GoogleMapLoader 
        apiKey="AIzaSyCrw5o26thUGFYdC7fwNDH_dZVZYKGLYdQ"
        onLoad={handleMapLoad}
        onError={setError}
      />
      
      {/* Map container */}
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
      
      {/* Render marker when map is ready */}
      {map && mapLoaded && (
        <GoogleMapMarker
          map={map}
          position={caritasPosition}
          title="PFCU - Caritas University"
          content={infoWindowContent}
        />
      )}
      
      {/* Directions button */}
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
