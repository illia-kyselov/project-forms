import React, { useEffect, useState, useRef } from "react";
import FormAddElements from "../FormAddElements/FormAddElements";
import NotificationService from "../../services/NotificationService";

const SecondTable = ({
  dataSecondTable,
  handleChange,
  formAddElementsData,
  selectedRowData,
  handleSubmitElements,
}) => {
  const [dataTable, setDataTable] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const tableRef = useRef();
  const blurTimeoutRef = useRef(null);

  const [showAddElements, setShowAddElements] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dataSecondTable) {
          const response = await fetch(`http://localhost:3001/elements/${selectedRowData}`);
          const data = await response.json();
          setDataTable(data);
        } else {
          setDataTable([]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (selectedRowData !== null) {
      fetchData();
    } else {
      setDataTable([]);
    }

    console.log('Selected row data in SecondTable:', selectedRowData);

  }, [dataSecondTable, selectedRowData]);

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
      setDataTable((prevData) =>
        prevData.map((element) =>
          element.id_elmts === editedData.id_elmts ? { ...editedData } : element
        )
      );
    }
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

  const deleteData = (id) => {
    setDataTable((prevData) => {
      const updatedData = prevData.filter((element) => element.id_elmts !== id);
      return updatedData;
    });
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!selectedRowData) {
      NotificationService.showWarningNotification("Оберіть дорожній знак");
      return;
    }
    setShowAddElements(true);
  };

  const handleRemoveElements = (e) => {
    e.preventDefault();
    setShowAddElements(false);
  };

  return (
    <div className="form-container-inside form-container-inside-width">
      <label className="block-label">Елементи до ДЗ № {dataSecondTable}</label>
      <div className="table" ref={tableRef}>
        {Array.isArray(dataTable) && dataTable.length > 0 ? (
          <table onClick={handleTableClick}>
            <thead>
              <tr>
                <th>№ з/п</th>
                <th>expl_dz_id</th>
                <th>Назва елемента</th>
                <th>Кількість елементів</th>
                <th></th>
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
                      <span>{element.name_elmns}</span>
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
                      <span>{element.cnt_elmnt}</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="delete-icon"
                      onClick={() => deleteData(element.id_elmts)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button
              className="table-paragraph-button"
              onClick={handleButtonClick}
            >
              Додати елементи
            </button>
            {showAddElements && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <FormAddElements
                    handleRemoveElements={handleRemoveElements}
                    handleChange={handleChange}
                    formAddElementsData={formAddElementsData}
                    dataSecondTable={dataSecondTable}
                  />
                </div>
              </div>
            )}
          </table>
        ) : (
          <>
            <p className="table-paragraph">Немає елементів</p>
            <button
              className="table-paragraph-button"
              onClick={handleButtonClick}
            >
              Додати елементи
            </button>

            {showAddElements && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <FormAddElements
                    handleRemoveElements={handleRemoveElements}
                    handleSubmitElements={handleSubmitElements}
                    handleChange={handleChange}
                    formAddElementsData={formAddElementsData}
                    dataSecondTable={dataSecondTable}
                    selectedRowData={selectedRowData}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SecondTable;
