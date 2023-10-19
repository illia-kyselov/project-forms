import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker, WMSTileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerImage from "../../img";
import image from '../../img/1.39z.png';
import MouseCoordinates from "../CursorCoordinates/MapEvents";
import ListPolygons from "../ListPolygons/ListPolygons";
import DraggableDzMarker from "../DraggableDzMarker/DraggableDzMarker";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

// const customIcon = new L.Icon({
//   iconUrl: markerImage,
//   iconRetinaUrl: markerImage,
//   iconSize: [60, 60],
//   iconAnchor: [30, 30],
//   popupAnchor: [0, 50],
// });

// const customIconFocus = new L.Icon({
//   iconUrl: markerImage,
//   iconRetinaUrl: markerImage,
//   iconSize: [70, 70],
//   iconAngle: 100,
// });

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
}) => {
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
  const [coordinaetes, setCoordinates] = useState();

  const [selectedPolygonMarkers, setSelectedPolygonMarkers] = useState([]);
  const [clickedPolygons, setClickedPolygons] = useState([]);

  const [selectedPolygonIdFromList, setSelectedPolygonIdFromList] = useState(null);


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
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/dz")
      .then((response) => response.json())
      .then((data) => {
        const dzMarkers = data.map((marker) => ({
          id: marker.id,
          coordinates: marker.geom.coordinates[0],
          num_pdr: marker.num_pdr,
          ang_map: marker.ang_map,
        }));
        setMarkers(dzMarkers);
      })
      .catch((error) => {
        console.error("Error fetching marker data", error);
      });
    setPushToDZCalled(false);
  }, [pushToDZCalled, setPushToDZCalled]);

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
        setClickedPolygons(data);
      } catch (error) {
        console.error("Error fetching clicked polygons data", error);
      }
    };

    handleAsyncClick();


    const polygonCoordinates = polygon.geom.coordinates;
    console.log(polygonCoordinates);
    const filteredMarkers = filterMarkersWithinPolygon(polygonCoordinates);
    console.log(filteredMarkers);
    setSelectedPolygonMarkers(filteredMarkers);
  };

  const handleMarkerClick = (markerId) => {
    setSelectedPolygon(null);
    setSelectedPolygonIdFromList(null);
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
  }, [mapBounds, polygons]);

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
        style="transform: rotate(${ang_map}deg); width: ${iconSize[0]}px; height: ${iconSize[0]}px"
      />`,
      iconSize,
      iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
      popupAnchor: [0, 0],
    });
  };

  // const wmsLayer = L.tileLayer.wms('http://your-wms-server-url', {
  //   layers: 'your-wms-layers',
  //   format: 'image/png',
  //   transparent: true,
  // });

  const wmsLayerUrl = 'http://192.168.1.3/cgi-bin/mapserv?map=/var/www/html/map/kyivcl.map';

  return (
    <div className="LeafletMapContainer ">
      <MapContainer
        center={center}
        maxZoom={20}
        zoom={17}
        style={containerStyle}
        onMoveend={handleMoveEnd}
        preferCanvas={true}
      >
        <WMSTileLayer
          layers="dz"
          url={wmsLayerUrl}
          format="image/png"
          transparent={true}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://192.168.1.3/cgi-bin/mapserv?map=/var/www/html/map/kyivcl.map"
          noWrap={true}
        />
        {isChecked && filteredPolygons.map((polygon) => (
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
        ))}
        {showDraggableDzMarker && (
          <DraggableDzMarker
            handleMarkerPosition={handleMarkerDragEnd}
            setDraggableDzMarkerWKT={setDraggableDzMarkerWKT}
          />
        )}
        {isChecked && filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.coordinates}
            icon={
              createMarkerIcon(
                marker.num_pdr,
                marker.ang_map,
                marker.id === focusMarker
              )
            }
            eventHandlers={{
              click: () => handleMarkerClick(marker.id),
            }}
          >
            <Popup>{marker.id}</Popup>
          </Marker>
        ))}
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
          />
        }

      </MapContainer>
    </div >
  );
};

export default LeafletMap;
