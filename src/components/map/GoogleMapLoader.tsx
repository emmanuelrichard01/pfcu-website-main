
import { useEffect, useState } from 'react';

interface GoogleMapLoaderProps {
  apiKey: string;
  onLoad: () => void;
  onError: (error: string) => void;
}

const GoogleMapLoader = ({ apiKey, onLoad, onError }: GoogleMapLoaderProps) => {
  useEffect(() => {
    // If Google Maps API is already loaded
    if (window.google?.maps) {
      onLoad();
      return;
    }
    
    // Create script element for loading Google Maps API
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    
    // Define global callback function for when the API loads
    window.initMap = () => {
      onLoad();
    };
    
    // Handle script loading error
    googleMapScript.onerror = () => {
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
  }, [apiKey, onLoad, onError]);
  
  return null; // This is just for loading functionality, not rendering UI
};

export default GoogleMapLoader;
