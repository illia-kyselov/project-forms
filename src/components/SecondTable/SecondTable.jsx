import React, { useEffect, useState, useRef } from "react";
import FormAddElements from "../FormAddElements/FormAddElements";
import NotificationService from "../../services/NotificationService";
import FormUpdateElementsInfo from "../FormUpdateElementsInfo/FormUpdateElementsInfo";

const SecondTable = ({
  dataSecondTable,
  handleChange,
  formAddElementsData,
  selectedRowData,
  handleSubmitElements,
  handleAddElements,
  showAddElements,
  handleRemoveElements,
}) => {
  const [dataTable, setDataTable] = useState([]);
  const tableRef = useRef();
  const [showUpdateElements, setShowUpdateElements] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

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
  }, [dataSecondTable, selectedRowData]);

  const deleteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/elements/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDataTable((prevData) => {
          const updatedData = prevData.filter((element) => element.id_elmts !== id);
          return updatedData;
        });
        NotificationService.showSuccessNotification('Данні успішно видалено');
      } else {
        NotificationService.showErrorNotification('Щось пішло не так');
      }
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!selectedRowData) {
      NotificationService.showWarningNotification("Оберіть дорожній знак");
      return;
    }
    handleAddElements(e);
  };

  const handleShowUpdateForm = (element) => {
    setSelectedElement(element);
    setShowUpdateElements(true);
  }

  return (
    <div className="form-container-inside form-container-inside-width">
      <label className="block-label">Елементи до ДЗ № {dataSecondTable || '______'}</label>
      <div className="table" ref={tableRef}>
        {Array.isArray(dataTable) && dataTable.length > 0 ? (
          <table>
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
                  onDoubleClick={() => handleShowUpdateForm(element)}
                >
                  <td>{element.id_elmts}</td>
                  <td>
                    <span>{element.expl_dz_id}</span>
                  </td>
                  <td>
                    <span>{element.name_elmns}</span>
                  </td>
                  <td>
                    <span>{element.cnt_elmnt}</span>
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
                    handleSubmitElements={handleSubmitElements}
                    handleChange={handleChange}
                  />
                </div>
              </div>
            )}
            {showUpdateElements && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <FormUpdateElementsInfo
                    selectedElement={selectedElement}
                    setShowUpdateElements={setShowUpdateElements}
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

