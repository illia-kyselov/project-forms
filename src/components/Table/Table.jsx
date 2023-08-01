import React, { useEffect, useState } from "react";

const Table = ({ selectedMarker, markersOfSelectedPolygon }) => {
  const [dataTable, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/dz");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const deleteData = (id) => {
    const updatedData = dataTable.filter((element) => element.id !== id);
    setData(updatedData);
  };

  const handleROwDoubleClick = (rowId) => {
    setSelectedRow(rowId);
  }

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>num_pdr</th>
            <th>topocode</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataTable.map((element) => (
            <tr key={element.id} onDoubleClick={() => handleROwDoubleClick(element.id)} style={{ background: selectedRow === element.id ? '#b3dcfd' : '' }}>
              <td>{element.id}</td>
              <td>{element.num_pdr}</td>
              <td>{element.topocode || "Немає в БД"}</td>
              <td>
                <button
                  class="delete-icon"
                  onClick={() => deleteData(element.id)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex">
        <button
          className="button-add-Dz"
          // onClick={handleAddDz}
        >
          Додати dz
        </button>
      </div>
    </div>
  );
};

export default Table;
