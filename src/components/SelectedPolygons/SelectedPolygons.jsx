import React, { useState } from "react";

const SelectedPolygons = () => {
  return (
    <div className="table">
      <div className="flex">
      </div>
      <table className="table__selectedMarkers">
        <thead>
          <tr>
            <th>objectid</th>
            <th>num_disl</th>
            <th>pro_name</th>
            <th></th>
          </tr>
        </thead>
        {/* <tbody>
          {selectedPolygonMarkers.map((polygon) => (
            <tr key={polygon.objectid}>
              <td>{polygon.objectid}</td>
              <td>{polygon.num_disl}</td>
              <td>{polygon.pro_name}</td>
            </tr>
          ))}
        </tbody> */}

      </table>
      <div className="table-button-submit-container">
      </div>
    </div>
  );
};

export default SelectedPolygons;
