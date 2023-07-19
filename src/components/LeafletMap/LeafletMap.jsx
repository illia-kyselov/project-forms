import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

const LeafletMap = () => {
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
        >
          <Popup>{polygon.pro_name}</Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
