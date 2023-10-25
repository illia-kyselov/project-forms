import React from "react";

const ListPolygons = ({
  clickedPolygons, 
  setPolygonTableRowClick, 
  setSelectedMarkerId, 
  setSelectedPolygonApp, 
  setClickedPolygons,
  setSelectedPolygonIdFromList,
  setSelectedPolygon,
}) => {
  const handleRowClick = (objectid, pro_name) => {
    setSelectedMarkerId(null);
    setSelectedPolygonApp(null);
    setSelectedPolygonIdFromList(objectid);
    setPolygonTableRowClick({ objectid, pro_name });
    setClickedPolygons([]);
    setSelectedPolygon(null);
  };

  return (
    <table className="map-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Назва</th>
        </tr>
      </thead>
      <tbody>
        {clickedPolygons.map((polygon) => (
          <tr key={polygon.objectid} onClick={() => handleRowClick(polygon.objectid, polygon.pro_name)}>
            <td>{polygon.objectid}</td>
            <td>{polygon.pro_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListPolygons;
