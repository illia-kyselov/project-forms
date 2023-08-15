import React, { useEffect, useState, useRef } from "react";

const SecondTable = () => {
  const [dataTable, setData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const tableRef = useRef();
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/elements");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!tableRef.current.contains(e.target)) {
        handleCellBlur();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  const handleRowDoubleClick = (rowId) => {
    setEditRowId(rowId);
    const originalData = dataTable.find(
      (element) => element.id_elmts === rowId
    );
    setEditedData(originalData);
  };

  const handleCellChange = (e, field) => {
    const { value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCellBlur = () => {
    setEditRowId(null);
    if (editedData.id_elmts) {
      setData((prevData) =>
        prevData.map((element) =>
          element.id_elmts === editedData.id_elmts ? { ...editedData } : element
        )
      );
    }
    // Clear the editedData state
    setEditedData({});
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCellBlur();
    }
  };

  const handleTableClick = (e) => {
    e.stopPropagation();
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      handleCellBlur();
    }, 100);
  };

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  };

  return (
    <div className="form-container-inside">
      <label className="block-label">Елементи до ДЗ №___</label>
      <div className="table" ref={tableRef}>
        <table onClick={handleTableClick}>
          <thead>
            <tr>
              <th>ID</th>
              <th>expl_dz_id</th>
              <th>name_elmns</th>
              <th>cnt_elmnt</th>
            </tr>
          </thead>
          <tbody>
            {dataTable.map((element) => (
              <tr
                key={element.id_elmts}
                onDoubleClick={() => handleRowDoubleClick(element.id_elmts)}
              >
                <td>{element.id_elmts}</td>
                <td>
                  <span>{element.expl_dz_id}</span>
                </td>
                <td>
                  {editRowId === element.id_elmts ? (
                    <input
                      type="text"
                      value={editedData.name_elmns || ""}
                      onChange={(e) => handleCellChange(e, "name_elmns")}
                      onBlur={handleInputBlur}
                      onFocus={handleInputFocus}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    <span>{element.name_elmns || "Немає в БД"}</span>
                  )}
                </td>
                <td>
                  {editRowId === element.id_elmts ? (
                    <input
                      type="text"
                      value={editedData.cnt_elmnt || ""}
                      onChange={(e) => handleCellChange(e, "cnt_elmnt")}
                      onBlur={handleInputBlur}
                      onFocus={handleInputFocus}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    <span>{element.cnt_elmnt || "Немає в БД"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecondTable;
