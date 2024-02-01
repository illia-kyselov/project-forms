import React, { useRef, useState, useEffect } from "react";
import { Popup, Marker, useMap } from "react-leaflet";
import markerImage from "../../img/1.39z.png";
import L from "leaflet";
import "leaflet-rotatedmarker";
import RotateControl from "../RotateControl/RotateControl";

const customIcon = new L.Icon({
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [60, 60],
  iconAngle: 100,
  iconAnchor: [30, 30],
});

const DraggableDzMarker = ({ handleMarkerPosition, setDraggableDzMarkerWKT, rotationAngle, setRotationAngle }) => {
  const map = useMap();
  const [markerPosition, setMarkerPosition] = useState(map.getCenter());
  const selectMarkerRef = useRef(null);

  const handleDragEnd = (e) => {
    const newPosition = e.target.getLatLng();
    setMarkerPosition([newPosition.lat, newPosition.lng]);
    handleMarkerPosition(newPosition);

    setDraggableDzMarkerWKT([newPosition.lat, newPosition.lng]);
  };

  console.log(rotationAngle);

  useEffect(() => {
    if (selectMarkerRef.current) {
      selectMarkerRef.current.openPopup();
    }
  }, []);

  useEffect(() => {
    if (selectMarkerRef.current) {
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
      <RotateControl
        rotationAngle={rotationAngle}
        setRotationAngle={setRotationAngle}
        markerPosition={markerPosition}
        map={map}
        setMarkerPosition={setMarkerPosition}
        handleMarkerPosition={handleMarkerPosition}
        setDraggableDzMarkerWKT={setDraggableDzMarkerWKT}
      />
    </Marker>
  );
};

export default DraggableDzMarker;
