import React, { useState, useEffect, useRef  } from "react";
import Input from "../Input/Input";
import NotificationService from '../../services/NotificationService';

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
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const selectedRowRef = useRef(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRowData, setNewRowData] = useState({
    num_pdr: "",
  });
  const [forms, setForms] = useState([]);
  const [selectedFormByRow, setSelectedFormByRow] = useState({});
  const [showButton, setShowButton] = useState(true);
  const rowIdsRef = useRef([]);
  const [arrowsListenerAdded, setArrowsListenerAdded] = useState(false);
  const arrowsListenerAddedRef = useRef(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

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
    handleROwClick(ids[0]);
  }, [data]);

  useEffect(() => {
    setNewRowData((prevData) => ({
      ...prevData,
      position: dzMarkerPosition,
    }));
  }, [dzMarkerPosition]);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const idExists = data.some((row) => row.id === newRowData.id);

    if (idExists) {
      return;
    }

    try {
      const rowsToInsert = data.map((row) => ({
        is_dz: true,
        num_dz: row.num_pdr,
        dz_form: selectedFormByRow[row.id],
        id_disl_dz: row.id,
        work_id: idFormAddWorks,
      }));

      const responses = await Promise.all(
        rowsToInsert.map((row) =>
          fetch("http://localhost:3001/expl_dz", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(row),
          }).then((response) => {
            if (response.ok) {
              NotificationService.showSuccessNotification('Данні успішно відправлені');
            } else {
              NotificationService.showWarningNotification('Будь ласка, заповніть всі поля та спробуйте ще раз!');
            }
          })
        )
      );

      setShowSecondTable(true);
      setShowButton(false);

    } catch (error) {
      console.error("Error inserting data into the database", error);
    }
  };

  const handlePushToDZ = async (e) => {
    e.preventDefault();
    setShowSecondTable(false);

    try {
      const wktMultiPoint = `MULTIPOINT(${draggableDzMarkerWKT[1]} ${draggableDzMarkerWKT[0]} 0)`;
      const insertData = {
        geom: wktMultiPoint,
        num_pdr: newRowData.num_pdr,
        num_pdr: newRowData.num_pdr,
      };

      const response = await fetch('http://localhost:3001/dz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertData),
      });

      if (response.ok) {
        NotificationService.showSuccessNotification('Данні успішно відправлені');
        setPushToDZCalled(true);
        hideForm(e);
      } else {
        NotificationService.showWarningNotification('Будь ласка, заповніть всі поля та спробуйте ще раз!');
      }
    } catch (error) {
      console.error('An error occurred while sending data to the server:', error);
    }
  };

  const deleteData = (id) => {
    setData((prevData) => {
      const updatedData = prevData.filter((element) => element.id !== id);
      return updatedData;
    });
  };

  const handleROwClick = async (rowId) => {
    if (!rowId) {
      return;
    }
    setSelectedRow(rowId);
    handleRowClick(rowId);
    selectedRowRef.current = rowId;

    try {
      const response = await fetch(`http://localhost:3001/expl_dz/${rowId}`);
      const data = await response.json();

      setSelectedRowData(data[0].id_expl_dz);

    } catch (error) {
      console.error("Error fetching data for SecondTable", error);
    }

    setDataSecondTable(rowId);
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
    });
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
  }

  return (
    <div className="form-container-inside form-container-inside-width">
      <label className="block-label">Обрані дорожні знаки</label>

      <div className="table">
        {showAddForm && (
          <div>
            <form className="form-addDz">
              <div className="form-addDz__group">
                <label className="form-addDz-input_title">Номер ПДР знаку</label>
                <input
                  className="form-addDz__input"
                  type="text"
                  name="num_pdr"
                  value={newRowData.num_pdr}
                  onChange={handleInputChange}
                  placeholder="Номер ПДР"
                  required
                />
              </div>
              <div className="flex">
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
          <button className="button-add-Dz" onClick={setButtonPressed} style={{ backgroundColor: buttonPressed ? '#46aa03' : '' }}>
            Додати з полігону
          </button>
          <button className="button-add-Dz" onClick={() => setShowAddForm(true)}>
            Додати ДЗ
          </button>
          <button className="button-add-Dz" onClick={handleClickRemoveButton}>
            Очистити
          </button>
        </div>
        <table>
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
                style={{ background: selectedRow === row.id ? "#a5d565" : "" }}
              >
                <td>{row.id}</td>
                <td>{row.num_pdr || "Немає в БД"}</td>
                <td>
                  <select
                    className="form__input form__input-select"
                    value={selectedFormByRow[row.id] || ""}
                    onChange={(e) => handleFormSelect(e, row.id)}
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
                </td>
                <td>
                  <button className="delete-icon" onClick={() => deleteData(row.id)}>
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showButton && (
          <button
            className="table-paragraph-button"
            onClick={handleFormSubmit}
            style={{ display: data.length > 0 ? 'block' : 'none' }}
          >
            Сформувати перелік
          </button>
        )}
      </div>
    </div>
  )
};

export default Table;