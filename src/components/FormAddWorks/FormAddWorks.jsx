import React, { useState, useEffect } from "react";
import NotificationService from '../../services/NotificationService';
import { validateEmptyInputs } from "../../helpers/validate-empty-inputs";
import Input from "../Input/Input";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const FormAddWorks = ({
  objectid,
  selectedMarkerId,
  selectedPolygon,
  polygonTableRowClick,
  setButtonAddDocPressed,
  buttonAddDocPressed,
  setIdFormAddWorks,
  idFormAddWorks,
  isChecked,
  setWorkToInsert,
  setIsChecked,
  uuidTable,
  dataSubmitted,
  formWorksData,
  setFormWorksData,
  visibleButtonInsert
}) => {
  const [options, setOptions] = useState([]);
  const [formObjectId, setFormObjectId] = useState("");
  const [selectedDocValue, setSelectedDocValue] = useState("");
  const [invalidInputs, setInvalidInputs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormObjectId(objectid);
  }, [objectid, setFormObjectId]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_work");
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(!isChecked);
    handleChange(e);
  };

  async function deleteRecordsById(uuid) {
    try {
      const elementsResponse = await fetch(`http://localhost:3001/elements/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!elementsResponse.ok) {
        NotificationService.showErrorNotification('Дані не видалені');
        return;
      }

      const explDzResponse = await fetch(`http://localhost:3001/expl_dz/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!explDzResponse.ok) {
        NotificationService.showErrorNotification('Дані не видалені');
        return;
      }

      const workTableResponse = await fetch(`http://localhost:3001/work_table/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!workTableResponse.ok) {
        NotificationService.showErrorNotification('Дані не видалені');
        return;
      }

      NotificationService.showSuccessNotification('Дані успішно видалені');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  }

  const selectedInfoFromTableRowClick =
    polygonTableRowClick.objectid && polygonTableRowClick.pro_name
      ? `${polygonTableRowClick.objectid} / ${polygonTableRowClick.pro_name}`
      : "";

  const selectedInfo =
    (selectedPolygon
      ? `${selectedPolygon.objectid} / ${selectedPolygon.pro_name}`
      : selectedInfoFromTableRowClick);

  let objectidInput = null;

  if (selectedInfo !== selectedMarkerId) {
    const parts = selectedInfo.split('/').map(part => part.trim());
    objectidInput = parts.length > 0 ? parts[0] : null;

    objectidInput = objectidInput.replace(/_/g, '');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!!invalidInputs.length) {
      setInvalidInputs((inputs) => inputs.filter((input) => input !== name));
    }
    setFormWorksData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const emptyInputs = validateEmptyInputs(formWorksData);

  const hasEmptyInputs = emptyInputs.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (hasEmptyInputs) {
      setInvalidInputs(emptyInputs);
      NotificationService.showWarningNotification('Будь ласка заповніть всі поля!');
      return;
    }

    if (!selectedDocValue && isChecked) {
      NotificationService.showWarningNotification('Будь ласка оберіть документ');
      return;
    }

    setButtonAddDocPressed(true);

    setWorkToInsert({
      ...formWorksData
    });
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleSubmit(e);
  }

  const handleInputChange = (e) => {
    setSelectedDocValue(e.target.value);
    handleChange(e);
  };

  useEffect(() => {
    if (!buttonAddDocPressed) {
      setSelectedDocValue(selectedInfo);
    }
  }, [buttonAddDocPressed, selectedInfo]);

  return (
    <div className="form-container-inside">
      <label className="block-label" style={{ backgroundColor: buttonAddDocPressed ? 'grey' : '' }}>Загальна інформація</label>
      <form
        className="form"
        style={{
          backgroundColor: buttonAddDocPressed ? '#f5f5f5' : '',
          border: buttonAddDocPressed ? '1px solid grey' : '',
        }}
      >
        <div className="form-left">
          <div className="form__group">
            <label className="form-input_title">Тип роботи</label>
            <select
              className="form__input form__input-select"
              name="type_work"
              onChange={handleChange}
              disabled={buttonAddDocPressed}
              style={{ cursor: 'pointer' }}
            >
              <option value="" defaultValue hidden>Оберіть тип роботи</option>
              {options.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="form__input-option"
                >
                  {option}
                </option>
              ))}
            </select>
            {invalidInputs.includes("type_work") && (
              <ErrorMessage errorMessage={"Оберіть тип роботи з переліку"} />
            )}
          </div>
          <div className="form__group">
            <label className="form-input_title">Особа, яка виконала роботу</label>

            <select
              className="form__input form__input-select"
              name="pers_work"
              disabled={buttonAddDocPressed}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="" defaultValue hidden>Оберіть особу</option>
              <option value="Шевченко Тарас" className="form__input-option">Шевченко Тарас</option>
              <option value="Українка Леся" className="form__input-option">Українка Леся</option>
            </select>
            {invalidInputs.includes("pers_work") && (
              <ErrorMessage errorMessage={"Оберіть особу з переліку"} />
            )}
          </div>
          <div className="form__group datetime-input">
            <label className="form-input_title">Дата виконання роботи</label>
            <Input
              type="datetime-local"
              id="additionalDatetime"
              className="form__input"
              style={{ pointerEvents: buttonAddDocPressed ? "none" : '', cursor: 'pointer' }}
              disabled={buttonAddDocPressed}
              onChange={handleChange}
              name="date_work"
              hasError={invalidInputs.includes("date_work")}
              errorMessage={"Оберіть дату роботи"}
            />
          </div>
        </div>
        <div className="form-right">
          <div className="form__group form__group-radio">
            <label className="form-input_title form-input_title--inline">Обрати документ з БД</label>
            <label className="switch">
              <input
                type="checkbox"
                checkedtype="checkbox"
                name="is_doc"
                className="form__input form__input-radio"
                checked={isChecked}
                disabled={buttonAddDocPressed}
                onChange={handleCheckboxChange}>
              </input>
              <span
                className="slider round"
                style={{
                  backgroundColor: buttonAddDocPressed ? 'grey' : '',
                  pointerEvents: buttonAddDocPressed ? "none" : '',
                }}></span>
            </label>
          </div>
          <div className="form__group form__group-radio">
            <label className="form-input_title">Адреса роботи</label>
            <Input
              type="text"
              name="address"
              placeholder="Введіть адресу роботи"
              className={`form__input ${invalidInputs.includes("address") ? "has-error" : ""}`}
              disabled={buttonAddDocPressed}
              autoComplete="off"
              onChange={handleChange}
              errorMessage={"Введіть адресу роботи"}
              hasError={invalidInputs.includes("address")}
            />
          </div>
          {isChecked && (
            <>
              <div className="form__group">
                <label className="form-input_title">Документ / підстава проведення роботи</label>
                <input
                  type="text"
                  placeholder="Документ / підстава"
                  className="form__input"
                  value={selectedDocValue}
                  onChange={handleInputChange}
                  readOnly
                  style={{ cursor: 'auto' }}
                  name="id_doc"
                  disabled={buttonAddDocPressed}
                />
              </div>
            </>
          )}
          <div className="form__group">
            <button
              className="form__button form__button-addForm"
              onClick={handleButtonClick}
              style={{ backgroundColor: buttonAddDocPressed ? '#BBBBBB' : '' }}
              disabled={buttonAddDocPressed}
            >
              Зберегти
            </button>
            {!visibleButtonInsert &&
              <button
                className="form__button form__button-addForm form__button-delete"
                onClick={() => deleteRecordsById(uuidTable)}
                type="button"
              >
                Скасувати
              </button>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormAddWorks;
