import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default
});

const LeafletMap = () => {
  const zoom = 5;
  const containerStyle = {
    width: "100%",
    height: "500px"
  };
  const center = {
    lat: 48.3794,
    lng: 31.1656
  };

  const [polygons, setPolygons] = useState([]);

  useEffect(() => {
    fetch("/doc_plg")
      .then((response) => response.json())
      .then((data) => {
        setPolygons(data);
      })
      .catch((error) => {
        console.error("Error fetching polygons data", error);
      });
  }, []);

  return (
    <MapContainer style={containerStyle} center={center} zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.objectid}
          positions={polygon.geom.coordinates}
          pathOptions={{ color: "purple" }}
        >
          <Popup>{polygon.pro_name}</Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;

