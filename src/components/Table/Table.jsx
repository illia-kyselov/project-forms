/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import NotificationService from "../../services/NotificationService";
import { validateEmptyInputs } from "../../helpers/validate-empty-inputs";
import Input from "../Input/Input";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import img from '../../img/icon-trash.png';
import { v4 as uuidv4 } from 'uuid';

const KeyCodesEnum = {
  ArrowUp: 38,
  ArrowDown: 40,
};

const Table = ({
  data,
  setData,
  setShowSecondTable,
  handleClearTable,
  setButtonPressed,
  setDataSecondTable,
  buttonPressed,
  idFormAddWorks,
  dzMarkerPosition,
  setDraggableDzMarkerShow,
  draggableDzMarkerShow,
  draggableDzMarkerWKT,
  setSelectedRowData,
  setShowSelectedDzForm,
  setPushToDZCalled,
  handleRowClick,
  handleAddDzFromPolygon,
  setFocusMarker,
  focusMarker,
  isChecked,
  setTableToInsert,
  tableToInsert,
  allElementsData,
  setAllElementsData,
  setRotationAngle,
  setUpdateMapDz,
  rotationAngle,
}) => {
  const selectedRowRef = useRef(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRowData, setNewRowData] = useState({
    num_pdr: "",
    ang_map: 0,
  });
  const [forms, setForms] = useState([]);
  const [selectedFormByRow, setSelectedFormByRow] = useState({});
  const [showButton, setShowButton] = useState(true);
  const rowIdsRef = useRef([]);
  const [arrowsListenerAdded, setArrowsListenerAdded] = useState(false);
  const arrowsListenerAddedRef = useRef(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [listGenerated, setListGenerated] = useState(false);
  const [invalidInputs, setInvalidInputs] = useState([]);

  const emptyInputsDZ = validateEmptyInputs(newRowData);

  const hasEmptyInputsDz = emptyInputsDZ.length > 0;

  useEffect(() => {
    fetchForms();
    setShowSelectedDzForm(true);

    if (!arrowsListenerAdded) {
      document.addEventListener("keydown", handleArrowsPressEvent);
      setArrowsListenerAdded(true);
      arrowsListenerAddedRef.current = true;
    }
    return () => {
      if (arrowsListenerAddedRef.current) {
        document.addEventListener("keydown", handleArrowsPressEvent);
      }
    };
  }, []);

  useEffect(() => {
    const ids = data.map((item) => item.id);
    rowIdsRef.current = ids;
  }, [data]);

  useEffect(() => {
    setNewRowData((prevData) => ({
      ...prevData,
      ang_map: Math.round(rotationAngle),
    }));
  }, [rotationAngle]);

  const handleRotationChange = (value) => {
    setRotationAngle(value % 360);
  };

  useEffect(() => {
    if (focusMarker === null) {
      return;
    }

    const rowExists = data.some((row) => row.id === focusMarker);

    if (!rowExists) {
      setFocusMarker(null);
    }
  }, [data, focusMarker]);

  useEffect(() => {
    if (data.length > 0) {

      const idExists = data.some((row) => row.id === newRowData.id);

      if (idExists) {
        return;
      }

      const rowsToInsert = data.map((row) => ({
        is_dz: true,
        num_dz: row.num_pdr,
        dz_form: selectedFormByRow[row.id],
        id_disl_dz: row.id,
        work_uuid: idFormAddWorks,
        uuid: row.uuid,
      }));

      setTableToInsert(rowsToInsert);

      setShowSecondTable(true);
      setShowButton(false);
      setListGenerated(true);
    }
  }, [data, selectedFormByRow]);

  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:3001/dz_forms");
      const formData = await response.json();
      setForms(formData);
    } catch (error) {
      console.error("Error fetching forms data", error);
    }
  };

  const handleArrowsPressEvent = (e) => {
    const selectedRow = selectedRowRef.current;
    const rowIds = rowIdsRef.current;
    const lastRowId = rowIds.length - 1;

    if (!selectedRow) {
      return;
    }

    const selectedRowIndex = rowIds.indexOf(selectedRow);
    if (e.keyCode === KeyCodesEnum.ArrowDown) {
      if (selectedRowIndex === lastRowId) {
        return;
      }
      const newSelectedRowId = rowIds[selectedRowIndex + 1];
      handleROwClick(newSelectedRowId);
      handleRowClick(newSelectedRowId);
    } else if (e.keyCode === KeyCodesEnum.ArrowUp) {
      if (selectedRowIndex === 0) {
        return;
      }
      const newSelectedRowId = rowIds[selectedRowIndex - 1];
      handleROwClick(newSelectedRowId);
      handleRowClick(newSelectedRowId);
    }
  };

  const handlePushToDZ = async (e) => {
    e.preventDefault();

    const roundedAngMap = Math.round(newRowData.ang_map);

    if (hasEmptyInputsDz) {
      if (hasEmptyInputsDz) {
        setInvalidInputs(emptyInputsDZ);
        NotificationService.showWarningNotification('Будь ласка заповніть всі поля!');
      }
      return;
    }

    setShowSecondTable(false);

    try {
      const wktMultiPoint = `MULTIPOINT(${draggableDzMarkerWKT[1]} ${draggableDzMarkerWKT[0]} 0)`;
      const insertData = {
        geom: wktMultiPoint,
        num_pdr: newRowData.num_pdr,
        ang_map: roundedAngMap,
      };

      const response = await fetch('http://localhost:3001/dz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertData),
      });

      if (response.ok) {
        NotificationService.showSuccessNotification('Дорожній знак успішно створений!');
        setPushToDZCalled(true);
        hideForm(e);
        setUpdateMapDz(true);
      } else {
        NotificationService.showWarningNotification('Будь ласка, заповніть всі поля та спробуйте ще раз!');
      }
    } catch (error) {
      console.error('An error occurred while sending data to the server:', error);
    }
  };

  const deleteData = (rowId) => {
    if (+focusMarker === rowId) {
      setFocusMarker(null);
    }

    setData((prevData) => {
      const updatedData = prevData.filter((element) => element.id !== rowId);
      setTableToInsert((prevTableToInsert) =>
        prevTableToInsert.filter((element) => element.id_disl_dz !== rowId)
      );

      const linkedElements = allElementsData.filter(
        (element) => element.tableId === data.find((item) => item.id === rowId)?.uuid
      );
      const updatedAllElementsData = allElementsData.filter(
        (element) => !linkedElements.some((linkedElement) => linkedElement.id === element.id)
      );
      setAllElementsData(updatedAllElementsData);

      return updatedData;
    });
  };

  const handleROwClick = async (rowId) => {
    if (!rowId) {
      return;
    }
    handleRowClick(rowId);
    selectedRowRef.current = rowId;

    setDataSecondTable(rowId);
    const foundElement = tableToInsert.find((element) => element.id_disl_dz === rowId);

    if (foundElement) {
      setSelectedRowData(foundElement.uuid);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSelect = (e, rowId) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;

    const updatedSelectedFormByRow = { ...selectedFormByRow };

    updatedSelectedFormByRow[rowId] = selectedText;
    setSelectedFormByRow(updatedSelectedFormByRow);
    const selectedValue = e.target.value;
    setSelectedFormByRow((prevSelectedForms) => ({
      ...prevSelectedForms,
      [rowId]: selectedValue,
    }));
  };

  const hideForm = (event) => {
    event.preventDefault();
    setNewRowData({
      num_pdr: "",
      ang_map: 0,
    });
    setRotationAngle(0);
    setShowSaveButton(false);
    setShowAddForm(false);
    setDraggableDzMarkerShow(false);
  };

  const showDraggableDzMarker = () => {
    setDraggableDzMarkerShow(true);
    setShowSaveButton(true);
  };

  const handleClickRemoveButton = (e) => {
    e.preventDefault();
    handleClearTable(e);
    setShowButton(true);
    setFocusMarker(null);
    setDataSecondTable(null);
  }

  return (
    <div className="form-container-inside form-container-inside-width">
      <label className="block-label">Обрані дорожні знаки</label>

      <div className="table">
        {
          /* Форма додавання нового знаку */
          showAddForm && (
            <div>
              <form className="form-addDz">
                <div className="form-addDz__group-flex">
                  <div className="form-addDz__group">
                    <label className="form-addDz-input_title">Номер ПДР знаку</label>
                    <Input
                      className="form-addDz__input"
                      type="text"
                      name="num_pdr"
                      value={newRowData.num_pdr}
                      onChange={handleInputChange}
                      placeholder="Номер ПДР"
                      required
                      errorMessage={"Введіть номер ПДР"}
                      hasError={invalidInputs.includes("num_pdr")}
                    />
                  </div>
                  <div className="form-addDz__group">
                    <div className="form-addDz__input-range-container">
                      <label className="form-addDz-input_title">Провернути знак</label>
                      <span className="form-addDz__ang">{newRowData.ang_map}°</span>

                      <Input
                        className="form-addDz__input-range"
                        type="range"
                        name="ang_map"
                        max={360}
                        min={0}
                        step={5}
                        value={newRowData.ang_map || 0}
                        onChange={(e) => handleRotationChange(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-addDz__group-flex">
                  {!showSaveButton && (
                    <button type="button" className="button-add-Dz" onClick={showDraggableDzMarker}>
                      Показати на карті
                    </button>
                  )}
                  {showSaveButton && (
                    <button className="button-add-Dz" onClick={handlePushToDZ}>
                      Зберегти
                    </button>
                  )}
                  <button className="button-add-Dz" onClick={hideForm}>
                    Скасувати
                  </button>
                </div>
              </form>
            </div>
          )}
        <div className="flex">
          {isChecked &&
            <button className="button-add-Dz" onClick={handleAddDzFromPolygon} style={{ backgroundColor: buttonPressed ? '#46aa03' : '' }}>
              Додати з полігону
            </button>}
          <button
            className="button-add-Dz"
            onClick={() => setShowAddForm(true)}
          // onClick={() => NotificationService.showInfoNotification('Нові знаки можуть бути додані через відповідний проект QGIS')}
          >
            Додати ДЗ
          </button>
          <button className="button-add-Dz" onClick={handleClickRemoveButton}>
            Очистити
          </button>
        </div>
        <table className="tableDz">
          <thead>
            <tr>
              <th>ID</th>
              <th>Номер ПДР</th>
              <th>Форма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleROwClick(row.id)}
                style={{
                  background: selectedRowRef.current === row.id ? "#a5d565" : "",
                  backgroundColor: selectedFormByRow[row.id] ? "" : "#FDE3E3",
                }}
              >
                <td>{row.id}</td>
                <td>{row.num_pdr || "Немає в БД"}</td>
                <td>
                  <select
                    className="form__input form__input-select"
                    value={selectedFormByRow[row.id] || ""}
                    onChange={(e) => handleFormSelect(e, row.id)}
                    errorMessage={"Выберите форму"}
                    hasError={!selectedFormByRow[row.id]}
                  >
                    <option value="" disabled hidden>Оберіть форму</option>
                    {forms
                      .filter((form) => form.num_pdr_new === row.num_pdr)
                      .map((form) => (
                        <option
                          key={form.id}
                          value={form.form_dz}
                        >
                          {form.form_dz}
                        </option>
                      ))}
                  </select>
                  {invalidInputs.length > 0 && invalidInputs.includes("form") && (
                    <ErrorMessage errorMessage={"Оберіть форму з переліку"} />
                  )}
                </td>
                <td>
                  <button
                    className="delete-icon"
                    onClick={() => {
                      deleteData(row.id);
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
};

export default Table;