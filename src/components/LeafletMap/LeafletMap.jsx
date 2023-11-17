import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import 'react-leaflet-markercluster/dist/styles.min.css';

import markerImage from "../../img";
import isEqual from 'lodash/isEqual';

import MouseCoordinates from "../CursorCoordinates/MapEvents";
import ListPolygons from "../ListPolygons/ListPolygons";
import DraggableDzMarker from "../DraggableDzMarker/DraggableDzMarker";
import MapBoundsHandler from "../../helpers/getBounds";

import { BeatLoader } from 'react-spinners';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
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
  setPolygonTableRowClick,
  setSelectedMarkerId,
  setSelectedPolygonApp,
  buttonAddDocPressed,
  handleMarkerDzDragend,
  showDraggableDzMarker,
  setDraggableDzMarkerWKT,
  pushToDZCalled,
  setPushToDZCalled,
  isChecked,
  setFocusMarker,
}) => {
  const containerStyle = {
    height: "95.5vh",
    position: 'relative',
  };
  const center = {
    lat: 50.3865,
    lng: 30.4695,
  };

  const [polygons, setPolygons] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedPolygonId, setSelectedPolygonId] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [mapBounds, setMapBounds] = useState({
    _southWest: [50.36, 30.46],
    _northEast: [50.39, 30.48],
  });
  const [filteredPolygons, setFilteredPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [coordinaetes, setCoordinates] = useState();

  const [clickedPolygons, setClickedPolygons] = useState([]);

  const [selectedPolygonIdFromList, setSelectedPolygonIdFromList] = useState(null);
  const [prevMapBounds, setPrevMapBounds] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
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
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching polygons data", error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchMarkers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/dz?minLat=${mapBounds._southWest[0]}&minLng=${mapBounds._southWest[1]}&maxLat=${mapBounds._northEast[0]}&maxLng=${mapBounds._northEast[1]}`
        );
        const data = await response.json();
        const dzMarkers = data.map((marker) => ({
          id: marker.id,
          coordinates: marker.geom.coordinates[0],
          num_pdr: marker.num_pdr,
          ang_map: marker.ang_map,
        }));
        console.log('отправил');

        setMarkers(dzMarkers);
        setLoading(false)

      } catch (error) {
        console.error("Error fetching marker data", error);
      }
    };

    if (!prevMapBounds || !isEqual(prevMapBounds, mapBounds)) {
      fetchMarkers();
      setPrevMapBounds(mapBounds);
    }

    setPushToDZCalled(false);
  }, [mapBounds, prevMapBounds, setMarkers, setPushToDZCalled]);

  const filterMarkersWithinPolygon = (polygonCoordinates) => {
    if (!markers || markers.length === 0) {
      return [];
    }

    const filtered = markers.filter((marker) => {
      if (!marker.coordinates || !Array.isArray(marker.coordinates) || marker.coordinates.length < 2) {
        return false;
      }

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
        (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }

    return isInside;
  };

  const handleClick = (e, polygon) => {
    e.target.openPopup();
    handlePolygonClick(polygon.objectid);
    setSelectedPolygonId(polygon.objectid);

    setSelectedPolygon(polygon);
    setSelectedPolygonIdFromList(null);

    const handleAsyncClick = async () => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        const response = await fetch(`http://localhost:3001/doc_plg/filteredPolygons/${lat}/${lng}`);
        const data = await response.json();

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

        setClickedPolygons(filteredPolygons);
      } catch (error) {
        console.error("Error fetching clicked polygons data", error);
      }
    };

    handleAsyncClick();

    const polygonCoordinates = polygon.geom.coordinates;
    filterMarkersWithinPolygon(polygonCoordinates);
  };

  const handleMarkerClick = (markerId) => {
    // setSelectedPolygon(null);
    // setSelectedPolygonIdFromList(null);
    if (buttonAddDocPressed) {
      setFocusMarker(markerId);
    }

    handlePolygonClick(markerId);
    handleDzClick(markerId);
    const markerData = markers.find((marker) => marker.id === markerId);
    handleAddMarkerData(markerData);
  };

  const filterMarkersByMapBounds = (polygonsInView) => {
    return markers.filter((marker) =>
      polygonsInView.some((polygon) =>
        isPointWithinPolygon(marker, polygon.geom.coordinates)
      )
    );
  };

  const isPolygonWithinMapBounds = (polygon) => {
    if (mapBounds) return true;
  };

  const handleMarkerDragEnd = (position) => {
    handleMarkerDzDragend(position);
  };

  useEffect(() => {
    const polygonsInView = polygons.filter((polygon) =>
      isPolygonWithinMapBounds(polygon)
    );
    setFilteredPolygons(polygonsInView);

    setFilteredMarkers(filterMarkersByMapBounds(polygonsInView));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygons]);

  const createMarkerIcon = (num_pdr, ang_map, isFocused) => {
    let rotationClass = 'rotate-0';
    if (ang_map !== undefined) {
      const roundedAngle = Math.round(ang_map / 45) * 45;
      rotationClass = `rotate-${roundedAngle}`;
    }

    const iconSize = isFocused ? [45, 45] : [35, 35];

    return L.divIcon({
      className: `custom-icon ${rotationClass}`,
      html: `
      <img 
        src="${markerImage[num_pdr]}" 
        class="custom-icon-img" 
        style="transform: rotate(${ang_map}deg); width: ${iconSize[0]}px; height: ${iconSize[0]}px;"
      />`,
      iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
      popupAnchor: [0, 0],
    });
  };

  return (
    <div className="LeafletMapContainer ">
      <MapContainer
        center={center}
        maxZoom={20}
        zoom={17}
        style={containerStyle}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <MapBoundsHandler setMapBounds={setMapBounds} />
        <MarkerClusterGroup disableClusteringAtZoom={18}>
          {isChecked ? (
            filteredMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.coordinates}
                icon={createMarkerIcon(
                  marker.num_pdr,
                  marker.ang_map,
                  marker.id === focusMarker
                )}
                zIndexOffset={marker.id === focusMarker ? 1000 : 100}
                eventHandlers={{
                  click: () => {
                    handleMarkerClick(marker.id);
                  },
                }}
              >
                {focusMarker === marker.id && (
                  <Popup position={marker.coordinates}>
                    {`${marker.num_pdr}[${marker.id}]`}
                  </Popup>
                )}
              </Marker>
            ))
          ) : (
            markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.coordinates}
                icon={createMarkerIcon(
                  marker.num_pdr,
                  marker.ang_map,
                  marker.id === focusMarker
                )}
                zIndexOffset={marker.id === focusMarker ? 1000 : 100}
                eventHandlers={{
                  click: () => {
                    handleMarkerClick(marker.id);
                  },
                }}
              >
                {/* {focusMarker === marker.id && ( */}
                <Popup position={marker.coordinates}>
                  {`${marker.num_pdr}[${marker.id}]`}
                </Popup>
                {/* )} */}
              </Marker>
            ))
          )}
        </MarkerClusterGroup>
        {isChecked &&
          (buttonAddDocPressed ? (
            <Polygon
              key={selectedPolygonId}
              positions={selectedPolygon.geom.coordinates}
              pathOptions={{
                color: "green",
                zIndex: "2147483647",
                opacity: "1",
              }}
              eventHandlers={{
                click: (e) => handleClick(e, selectedPolygon),
              }}
            >
              <Popup>{selectedPolygon.pro_name}</Popup>
            </Polygon>
          ) : (
            filteredPolygons.map((polygon) => (
              <Polygon
                key={polygon.objectid}
                positions={polygon.geom.coordinates}
                pathOptions={{
                  color:
                    selectedPolygon === polygon || selectedPolygonIdFromList === polygon.objectid
                      ? "red"
                      : "purple",
                  zIndex:
                    selectedPolygon === polygon || selectedPolygonIdFromList === polygon.objectid
                      ? '2147483647'
                      : '',
                  opacity:
                    selectedPolygon === polygon || selectedPolygonIdFromList === polygon.objectid
                      ? '1'
                      : '0.7',
                }}
                eventHandlers={{
                  click: (e) => handleClick(e, polygon),
                }}
              >
                <Popup>{polygon.pro_name}</Popup>
              </Polygon>
            ))
          ))}
        {showDraggableDzMarker && (
          <DraggableDzMarker
            handleMarkerPosition={handleMarkerDragEnd}
            setDraggableDzMarkerWKT={setDraggableDzMarkerWKT}
          />
        )}

        <MouseCoordinates setCoordinates={setCoordinates} />
        {coordinaetes ? <div style={coordinatesStyle}>{coordinaetes}</div> : ""}

        {clickedPolygons.length > 1 && !buttonAddDocPressed &&
          <ListPolygons
            clickedPolygons={clickedPolygons}
            setPolygonTableRowClick={setPolygonTableRowClick}
            setSelectedMarkerId={setSelectedMarkerId}
            setSelectedPolygonApp={setSelectedPolygonApp}
            setClickedPolygons={setClickedPolygons}
            setSelectedPolygonIdFromList={setSelectedPolygonIdFromList}
            setSelectedPolygon={setSelectedPolygon}
            filterMarkersWithinPolygon={filterMarkersWithinPolygon}
          />
        }
        {loading && (
          <div className={`loader-overlay ${loading ? 'show' : ''}`}>
            <BeatLoader color="#36d7b7" loading={true} size={50} />
          </div>
        )}
      </MapContainer>
    </div >
  );
};

export default LeafletMap;
