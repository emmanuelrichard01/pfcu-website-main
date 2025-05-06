
import { useEffect, useState } from 'react';

interface GoogleMapLoaderProps {
  apiKey: string;
  onLoad: () => void;
  onError: (error: string) => void;
}

const GoogleMapLoader = ({ apiKey, onLoad, onError }: GoogleMapLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If Google Maps API is already loaded
    if (window.google?.maps) {
      onLoad();
      return;
    }
    
    // Prevent multiple script loads
    if (isLoading || document.getElementById('google-maps-script')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create script element for loading Google Maps API
      const googleMapScript = document.createElement('script');
      googleMapScript.id = 'google-maps-script';
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      
      // Define global callback function for when the API loads
      window.initMap = () => {
        setIsLoading(false);
        onLoad();
      };
      
      // Handle script loading error
      googleMapScript.onerror = () => {
        setIsLoading(false);
        console.error('Failed to load Google Maps API');
        onError('Map failed to load. This could be due to API restrictions or network issues.');
      };
      
      // Add script to document
      window.document.body.appendChild(googleMapScript);
      
      // Clean up
      return () => {
        window.initMap = undefined;
        if (googleMapScript.parentNode) {
          googleMapScript.parentNode.removeChild(googleMapScript);
        }
      };
    } catch (error: any) {
      setIsLoading(false);
      onError(error.message || 'Error loading Google Maps');
      console.error('Error setting up Google Maps:', error);
    }
  }, [apiKey, onLoad, onError, isLoading]);
  
  return null; // This is just for loading functionality, not rendering UI
};

export default GoogleMapLoader;
