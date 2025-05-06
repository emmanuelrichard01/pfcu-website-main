
import { useEffect } from "react";

interface GoogleMapMarkerProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  title: string;
  content: string;
}

const GoogleMapMarker = ({ map, position, title, content }: GoogleMapMarkerProps) => {
  useEffect(() => {
    if (!map || !window.google?.maps) return;

    try {
      // Create marker with animation
      const marker = new window.google.maps.Marker({
        map,
        position,
        title,
        animation: window.google.maps.Animation.DROP
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
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
  }, [map, position, title, content]);

  return null; // This is a behavior component, not a UI component
};

export default GoogleMapMarker;
