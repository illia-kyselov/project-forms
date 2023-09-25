import React, { useRef, useState, useEffect } from "react";
import { Popup, Marker, useMap } from "react-leaflet";
import markerImage from "../../img/1.39z.png";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [50, 50],
  iconAngle: 100,
});

const DraggableDzMarker = ({ handleMarkerPosition, setDraggableDzMarkerWKT }) => {
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState(map.getCenter());
  const selectMarkerRef = useRef(null);

  const handleDragEnd = (e) => {
    const newPosition = e.target.getLatLng();
    setMarkerPosition([newPosition.lat, newPosition.lng]);
    handleMarkerPosition(newPosition);
    setDraggableDzMarkerWKT(markerPosition);
  };

  useEffect(() => {
    if (selectMarkerRef.current) {
      selectMarkerRef.current.openPopup();
    }
  }, []);

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
      <Popup
        openPopup={true}
      >
        Перемістіть знак у потрібне місце
      </Popup>
    </Marker>
  );
};

export default DraggableDzMarker;
