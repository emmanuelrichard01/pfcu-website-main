
import { useEffect, useRef } from "react";

interface GoogleMapProps {
  address?: string;
  height?: string;
}

const GoogleMap = ({ 
  address = "Caritas University, Enugu, Nigeria", 
  height = "400px" 
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Function to load Google Maps API
    const loadGoogleMapsAPI = () => {
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initMap`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      window.document.body.appendChild(googleMapScript);
      
      // Define the global callback function
      window.initMap = initializeMap;
      
      googleMapScript.onerror = () => {
        console.error('Failed to load Google Maps API');
        if (mapRef.current) {
          mapRef.current.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">Map loading failed. Please refresh.</div>';
        }
      };
    };
    
    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      // Default to Caritas University coordinates (approximate)
      const defaultPosition = { lat: 6.4698, lng: 7.5101 };
      
      const mapOptions = {
        zoom: 15,
        center: defaultPosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
      };
      
      const map = new google.maps.Map(mapRef.current, mapOptions);
      
      // If address is provided, try to geocode it
      if (address) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const position = results[0].geometry.location;
            map.setCenter(position);
            
            new google.maps.Marker({
              map,
              position,
              title: address,
              animation: google.maps.Animation.DROP,
            });
          } else {
            console.warn(`Geocoding failed for address: ${address}`);
            // Fall back to default position
            map.setCenter(defaultPosition);
            new google.maps.Marker({
              map,
              position: defaultPosition,
              title: "Caritas University",
              animation: google.maps.Animation.DROP,
            });
          }
        });
      } else {
        // Use default position if no address
        new google.maps.Marker({
          map,
          position: defaultPosition,
          title: "Caritas University",
          animation: google.maps.Animation.DROP,
        });
      }
    };
    
    // Check if Google Maps API is already loaded
    if (!window.google?.maps) {
      loadGoogleMapsAPI();
    } else {
      initializeMap();
    }
    
    // Clean up
    return () => {
      // Remove the global callback when component unmounts
      window.initMap = undefined;
      // Clean up the script tag
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [address]);

  return (
    <div 
      ref={mapRef} 
      className="w-full rounded-lg overflow-hidden border border-gray-300 shadow-md"
      style={{ height }}
    />
  );
};

// Define the global initMap property on window object
declare global {
  interface Window {
    initMap: () => void;
    google?: any;
  }
}

export default GoogleMap;
