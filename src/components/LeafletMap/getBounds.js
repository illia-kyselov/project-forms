import { useEffect, useRef } from "react";
import { useMapEvents } from "react-leaflet";

const MapBoundsHandler = ({ setMapBounds, onMapBoundsChange }) => {
  const mapRef = useRef();

  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      const bounds = map.getBounds();
      const updatedBounds = {
        _southWest: [bounds._southWest.lat, bounds._southWest.lng],
        _northEast: [bounds._northEast.lat, bounds._northEast.lng],
      };
      setMapBounds(updatedBounds);
      onMapBoundsChange(updatedBounds);
    },
  });

  useEffect(() => {
    // Fetch data from the backend using the initial bounds (current map bounds)
    const map = mapRef.current;
    if (map != null) {
      const bounds = map.getBounds();
      const initialBounds = {
        _southWest: [bounds._southWest.lat, bounds._southWest.lng],
        _northEast: [bounds._northEast.lat, bounds._northEast.lng],
      };
      setMapBounds(initialBounds);
      onMapBoundsChange(initialBounds);
    }
  }, [setMapBounds, onMapBoundsChange]);

  return null;
};

export default MapBoundsHandler;
