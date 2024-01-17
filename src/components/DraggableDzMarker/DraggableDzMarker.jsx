import React, { useRef, useState, useEffect } from "react";
import { Popup, Marker, useMap } from "react-leaflet";
import markerImage from "../../img/1.39z.png";
import L from "leaflet";

const DraggableDzMarker = ({ handleMarkerPosition, setDraggableDzMarkerWKT, rotationAngle }) => {
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState(map.getCenter());
  const selectMarkerRef = useRef(null);

  console.log('rotationAngle', rotationAngle);

  const createCustomIcon = (angle) => {
    const customIconClone = L.divIcon({
      className: "custom-icon",
      iconSize: [60, 60],
      html: `<img src="${markerImage}" style="width: 100%; transform: rotate(${angle}deg);" />`,
    });

    return customIconClone;
  };

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

  return (
    <Marker
      draggable={true}
      position={markerPosition}
      ref={selectMarkerRef}
      icon={createCustomIcon(rotationAngle)}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
      iconAngle={rotationAngle}
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
