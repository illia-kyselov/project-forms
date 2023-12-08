import React, { useEffect, useState, useRef } from "react";
import FormAddElements from "../FormAddElements/FormAddElements";
import NotificationService from "../../services/NotificationService";
import FormUpdateElementsInfo from "../FormUpdateElementsInfo/FormUpdateElementsInfo";
import img from '../../img/icon-trash.png';

const SecondTable = ({
  dataSecondTable,
  handleChange,
  selectedRowData,
  handleAddElements,
  showAddElements,
  handleRemoveElements,
  handleSubmitElements,
  invalidInputs,
  handleUpdateElements,
  showUpdateElements,
  setShowUpdateElements,
  selectedElement,
  setSelectedElement,
  allElementsData,
  setAllElementsData,
}) => {
  const [dataTable, setDataTable] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dataSecondTable) {
          const filteredData = allElementsData.filter(element => element.tableId === selectedRowData);
          setDataTable(filteredData);
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
  }, [dataSecondTable, selectedRowData, allElementsData]);

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
                {/* <th>№ з/п</th> */}
                <th>uuid</th>
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
                  {/* <td>{element.id_elmts}</td> */}
                  <td>
                    <span>{element.tableId}</span>
                  </td>
                  <td>
                    <span>{element.element}</span>
                  </td>
                  <td>
                    <span>{element.quantity}</span>
                  </td>
                  <td>
                    <button
                      className="delete-icon"
                      onClick={() => deleteData(element.id_elmts)}
                    >
                      <img className="delete-icon-svg" src={img} alt="Удалить" />
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
                    invalidInputs={invalidInputs}
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
                    handleUpdateElements={handleUpdateElements}
                    invalidInputs={invalidInputs}
                    setAllElementsData={setAllElementsData}
                    allElementsData={allElementsData}
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
                    invalidInputs={invalidInputs}
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

