import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerImage from "../../img/1.39z.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

const customIcon = new L.Icon({
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [50, 50],
  iconAngle: 100,
});
const LeafletMap = ({ handlePolygonClick }) => {
  const zoom = 17;
  const containerStyle = {
    width: "100%",
    height: "500px",
  };
  const center = {
    lat: 50.3865,
    lng: 30.4695,
  };

  const [polygons, setPolygons] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/doc_plg")
      .then((response) => response.json())
      .then((data) => {
        const filteredPolygons = data.map((polygon) => ({
          ...polygon,
          geom: {
            ...polygon.geom,
            coordinates: polygon.geom.coordinates[0].filter(
              (coordinate) => coordinate[0] !== null && coordinate[1] !== null
            ),
          },
        }));
        setPolygons(filteredPolygons);
      })
      .catch((error) => {
        console.error("Error fetching polygons data", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/dz")
      .then((response) => response.json())
      .then((data) => {
        const dzMarkers = data.map((marker) => ({
          id: marker.id,
          coordinates: marker.geom.coordinates[0],
        }));
        setMarkers(dzMarkers);
      })
      .catch((error) => {
        console.error("Error fetching marker data", error);
      });
  }, []);

  const handleClick = (e, polygon) => {
    e.target.openPopup();
    handlePolygonClick(polygon.objectid);
  };

  return (
    <MapContainer center={center} zoom={zoom} style={containerStyle}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.objectid}
          positions={polygon.geom.coordinates}
          pathOptions={{ color: "purple" }}
          eventHandlers={{
            click: (e) => handleClick(e, polygon),
          }}
        >
          <Popup>{polygon.pro_name}</Popup>
        </Polygon>
      ))}
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.coordinates} icon={customIcon}>
          <Popup>{marker.id}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
