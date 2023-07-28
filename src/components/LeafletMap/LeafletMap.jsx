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
  const [selectedPolygonId, setSelectedPolygonId] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [filteredPolygons, setFilteredPolygons] = useState([]);

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

  const filterMarkersWithinPolygon = (polygonCoordinates) => {
    const filtered = markers.filter((marker) => {
      const point = L.latLng(marker.coordinates[1], marker.coordinates[0]);
      return isPointWithinPolygon(point, polygonCoordinates);
    });
    setFilteredMarkers(filtered);
  };

  const isPointWithinPolygon = (point, polygonCoordinates) => {
    const x = point.lng;
    const y = point.lat;
    let isInside = false;

    for (
      let i = 0, j = polygonCoordinates.length - 1;
      i < polygonCoordinates.length;
      j = i++
    ) {
      const xi = polygonCoordinates[i][0];
      const yi = polygonCoordinates[i][1];
      const xj = polygonCoordinates[j][0];
      const yj = polygonCoordinates[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }

    return isInside;
  };

  const handleClick = (e, polygon) => {
    e.target.openPopup();
    handlePolygonClick(polygon.objectid);
    setSelectedPolygonId(polygon.objectid);

    // Filter markers when a polygon is clicked
    const polygonCoordinates = polygon.geom.coordinates;
    filterMarkersWithinPolygon(polygonCoordinates);
  };

  const handleMoveEnd = () => {
    if (mapBounds) {
      // Filter polygons based on map bounds
      const polygonsInView = polygons.filter((polygon) =>
        isPolygonWithinMapBounds(polygon)
      );
      setFilteredPolygons(polygonsInView);

      // Filter markers based on whether they are within the bounds of the map
      setFilteredMarkers(filterMarkersByMapBounds(polygonsInView));
    }
  };

  const filterMarkersByMapBounds = (polygonsInView) => {
    return markers.filter((marker) =>
      polygonsInView.some((polygon) =>
        isPointWithinPolygon(marker, polygon.geom.coordinates)
      )
    );
  };

  const isPolygonWithinMapBounds = (polygon) => {
    if (!mapBounds) return true; // Show all polygons before the map initializes
    const polygonBounds = L.polygon(polygon.geom.coordinates).getBounds();
    return mapBounds.intersects(polygonBounds);
  };

  useEffect(() => {
    // Filter polygons based on map bounds
    const polygonsInView = polygons.filter((polygon) =>
      isPolygonWithinMapBounds(polygon)
    );
    setFilteredPolygons(polygonsInView);

    // Filter markers based on whether they are within the bounds of the map
    setFilteredMarkers(filterMarkersByMapBounds(polygonsInView));
  }, [mapBounds, polygons]);

  return (
    <div>
      <MapContainer
        center={center}
        zoom={zoom}
        style={containerStyle}
        onMoveend={handleMoveEnd}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredPolygons.map((polygon) => (
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
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.coordinates}
            icon={customIcon}
          >
            <Popup>{marker.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
