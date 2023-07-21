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
        console.log("Data from API:", data); // Выводим данные из БД в консоль для отладки
        const scaledMarkers = data.map((marker) => ({
          ...marker,
          geom_local: {
            ...marker.geom_local,
            coordinates: marker.geom_local.coordinates.map((coordinate) => [
              coordinate[1] / 1000000, // Поменяли местами широту и долготу
              coordinate[0] / 1000000, // Поменяли местами широту и долготу
            ]),
          },
        }));
        console.log("Scaled markers:", scaledMarkers); // Выводим обработанные данные в консоль для отладки
        setMarkers(scaledMarkers);
      })
      .catch((error) => {
        console.error("Error fetching marker data", error);
      });
  }, []);

  const handleClick = (e, polygon) => {
    e.target.openPopup();
    handlePolygonClick(polygon.objectid);
  };

  const markerCoordinates = [50.386210371411906, 30.467462361037526];

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
        <React.Fragment key={marker.id}>
          {marker.geom_local.type === "MultiPoint" &&
            marker.geom_local.coordinates.map((coordinate, index) => (
              <Marker
                key={`${marker.id}_${index}`}
                position={[coordinate[1], coordinate[0]]}
                icon={customIcon}
              />
            ))}
        </React.Fragment>
      ))}
      <Marker position={markerCoordinates} icon={customIcon} />
    </MapContainer>
  );
};

export default LeafletMap;
