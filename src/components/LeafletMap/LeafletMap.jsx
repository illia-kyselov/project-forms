import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MainForm from "../MainForm/MainForm"; // Update the import path

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

const LeafletMap = () => {
  const zoom = 5;
  const containerStyle = {
    width: "100%",
    height: "500px",
  };
  const center = {
    lat: 48.3794,
    lng: 31.1656,
  };

  const [polygons, setPolygons] = useState([]);
  const [activePolygon, setActivePolygon] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const kievPolygonCoordinates = [
    [50.4501, 30.5234], // Координаты точек полигона
    [50.4501, 30.7529],
    [50.3278, 30.7529],
    [50.3278, 30.5234],
  ];

  // Создайте объект с данными для полигона Киева
  const kievPolygon = {
    objectid: 99999, // Уникальный идентификатор полигона
    geom: {
      type: "Polygon",
      coordinates: [kievPolygonCoordinates],
    },
    pro_name: "Киев", // Название полигона
  };

  const handlePolygonClick = (polygon) => {
    setActivePolygon(polygon);
    setShowForm(true);
  };

  const handleAddFormClick = () => {
    // Добавьте обработчик для добавления формы работ
  };

  return (
    <MapContainer center={center} zoom={zoom} style={containerStyle}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polygon
        key={kievPolygon.objectid}
        positions={kievPolygon.geom.coordinates}
        pathOptions={{ color: "purple" }}
      >
        <Popup>{kievPolygon.pro_name}</Popup>
      </Polygon>
      {polygons.map((polygon) => (
        <Polygon
          key={polygon.objectid}
          positions={polygon.geom.coordinates}
          pathOptions={{ color: "purple" }}
          eventHandlers={{
            click: () => handlePolygonClick(polygon),
          }}
        >
          <Popup>{polygon.pro_name}</Popup>
        </Polygon>
      ))}
      {activePolygon && showForm && (
        <MainForm
          handleAddFormClick={handleAddFormClick}
          polygon={activePolygon}
        />
      )}
    </MapContainer>
  );
};

export default LeafletMap;
