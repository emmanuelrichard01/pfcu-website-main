
import { useEffect } from "react";

interface GoogleMapMarkerProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  title: string;
  content: string;
}

interface WindowWithGoogle extends Window {
  google?: any;
}

const GoogleMapMarker = ({ map, position, title, content }: GoogleMapMarkerProps) => {
  const windowWithGoogle = window as WindowWithGoogle;
  
  useEffect(() => {
    if (!map || !windowWithGoogle.google?.maps) return;

    try {
      // Create marker with animation
      const marker = new windowWithGoogle.google.maps.Marker({
        map,
        position,
        title,
        animation: windowWithGoogle.google.maps.Animation.DROP
      });

      // Create info window
      const infoWindow = new windowWithGoogle.google.maps.InfoWindow({
        content
      });

      // Add click listener to marker
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Open info window by default after a short delay (better UX)
      setTimeout(() => {
        infoWindow.open(map, marker);
      }, 1000);

      // Clean up
      return () => {
        marker.setMap(null);
      };
    } catch (err) {
      console.error("Error creating marker:", err);
    }
  }, [map, position, title, content, windowWithGoogle]);

  return null; // This is a behavior component, not a UI component
};

export default GoogleMapMarker;
