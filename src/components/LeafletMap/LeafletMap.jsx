/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerImage from "../../img/1.39z.png";
import MouseCoordinates from "../CursorCoordinates/MapEvents";

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

const customIconFocus = new L.Icon({
  iconUrl: markerImage,
  iconRetinaUrl: markerImage,
  iconSize: [70, 70],
  iconAngle: 100,
});

const coordinatesStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "white",
  padding: "5px",
  borderRadius: "5px",
  zIndex: 1000,
};

const LeafletMap = ({
  handlePolygonClick,
  handleDzClick,
  handleAddMarkerData,
  handleAddFromPolygon,
  focusMarker,
}) => {
  const zoom = 17;
  const containerStyle = {
    height: "95.5vh",
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
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  const [selectedPolygonMarkers, setSelectedPolygonMarkers] = useState([]);
  const [clickedPolygons, setClickedPolygons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/doc_plg")
      .then((response) => response.json())
      .then((data) => {
        const filteredPolygons = data.map((polygon) => ({
          ...polygon,
          pro_name: polygon.pro_name,
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
          num_pdr: marker.num_pdr,
          id_znk: marker.id_znk,
          num_sing: marker.num_sing,
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
    handleAddFromPolygon(filtered);
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
    setSelectedPolygon(polygon);

    const handleAsyncClick = async () => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        const response = await fetch(`http://localhost:3001/doc_plg/filteredPolygons/${lat}/${lng}`);
        const data = await response.json();
        setClickedPolygons(data);
      } catch (error) {
        console.error("Error fetching clicked polygons data", error);
      }
    };

    handleAsyncClick();

    const polygonCoordinates = polygon.geom.coordinates;
    const filteredMarkers = filterMarkersWithinPolygon(polygonCoordinates);
    setSelectedPolygonMarkers(filteredMarkers);
  };


  const [filteredClickedPolygons, setFilteredClickedPolygons] = useState([]);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);

  const handleMarkerClick = (markerId) => {
    setSelectedPolygon(null);
    handlePolygonClick(markerId);
    handleDzClick(markerId);
    const markerData = markers.find((marker) => marker.id === markerId);
    handleAddMarkerData(markerData);
  };

  const handleMoveEnd = () => {
    if (mapBounds) {
      const polygonsInView = polygons.filter((polygon) =>
        isPolygonWithinMapBounds(polygon)
      );
      setFilteredPolygons(polygonsInView);

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
    if (!mapBounds) return true;
    const polygonBounds = L.polygon(polygon.geom.coordinates).getBounds();
    return mapBounds.intersects(polygonBounds);
  };

  const handleMapClick = async (e) => {

  };

  useEffect(() => {
    const polygonsInView = polygons.filter((polygon) =>
      isPolygonWithinMapBounds(polygon)
    );
    setFilteredPolygons(polygonsInView);

    setFilteredMarkers(filterMarkersByMapBounds(polygonsInView));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapBounds, polygons]);

  const [coordinaetes, setCoordinates] = useState();

  return (
    <div className="LeafletMapContainer ">
      <MapContainer
        center={center}
        zoom={zoom}
        style={containerStyle}
        onMoveend={handleMoveEnd}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        {filteredPolygons.map((polygon) => (
          <Polygon
            key={polygon.objectid}
            positions={polygon.geom.coordinates}
            pathOptions={{
              color: selectedPolygon === polygon ? "red" : "purple",
            }}
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
            icon={marker.id === focusMarker ? customIconFocus : customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(marker.id),
            }}
          >
            <Popup>{marker.id}</Popup>
          </Marker>
        ))}
        <MouseCoordinates setCoordinates={setCoordinates} />
        {coordinaetes ? <div style={coordinatesStyle}>{coordinaetes}</div> : ""}
        {clickedPolygons.length > 0 &&
          <table className="map-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
              </tr>
            </thead>
            <tbody>
              {clickedPolygons.map((polygon) => (
                <tr key={polygon.objectid}>
                  <td>{polygon.objectid}</td>
                  <td>{polygon.pro_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
