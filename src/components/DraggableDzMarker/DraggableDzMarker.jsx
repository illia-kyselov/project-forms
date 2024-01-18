import React, { useRef, useState, useEffect } from "react";
import { Popup, Marker, useMap } from "react-leaflet";
import markerImage from "../../img/1.39z.png";
import L from "leaflet";
import "leaflet-rotatedmarker"; // Import the leaflet-rotatedmarker library

const customIcon = new L.Icon({
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [60, 60],
  iconAngle: 100,
  iconAnchor: [30, 30],
});

const DraggableDzMarker = ({ handleMarkerPosition, setDraggableDzMarkerWKT, rotationAngle }) => {
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState(map.getCenter());
  const selectMarkerRef = useRef(null);

  const handleDragEnd = (e) => {
    const newPosition = e.target.getLatLng();
    setMarkerPosition([newPosition.lat, newPosition.lng]);
    handleMarkerPosition(newPosition);

    setDraggableDzMarkerWKT([newPosition.lat, newPosition.lng]);
  };

  useEffect(() => {
    if (selectMarkerRef.current) {
      selectMarkerRef.current.openPopup();
    }
  }, []);

  useEffect(() => {
    if (selectMarkerRef.current) {
      // Update the marker rotation when the rotationAngle prop changes
      selectMarkerRef.current.setRotationAngle(rotationAngle);
    }
  }, [rotationAngle]);

  return (
    <Marker
      draggable={true}
      position={markerPosition}
      ref={selectMarkerRef}
      icon={customIcon}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    >
      <Popup openPopup={true}>Перемістіть знак у потрібне місце</Popup>
    </Marker>
  );
};

export default DraggableDzMarker;
