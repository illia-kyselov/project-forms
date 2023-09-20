import React, { useState, useEffect } from "react";
import { validateEmptyInputs } from "../../helpers/validate-empty-inputs";
import Input from "../Input/Input";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NotificationService from '../../services/NotificationService';

const FormAddWorks = ({
  objectid,
  selectedMarkerId,
  selectedPolygon,
  polygonTableRowClick,
  setButtonAddDocPressed,
  buttonAddDocPressed,
  setIdFormAddWorks,
}) => {
  const [options, setOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [formObjectId, setFormObjectId] = useState("");
  const [selectedDocValue, setSelectedDocValue] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const [formWorksData, setFormWorksData] = useState({
    type_work: "",
    is_doc: true,
    id_doc: 0,
    address: "",
    date_work: "",
    pers_work: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (dataSubmitted) {
      return;
    }

    const emptyInputs = validateEmptyInputs(formWorksData);

    if (emptyInputs.length) {
      setInvalidInputs(emptyInputs);
      NotificationService.showErrorNotification('Будь ласка, заповніть всі поля!');
      return;
    }

    const is_doc = isChecked;

    const date_work =
      formWorksData.date_work || new Date(Date.now()).toISOString();

    const cleanedObjectidInput = objectidInput.replace(/_/g, '');

    fetch("http://localhost:3001/work_table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formWorksData,
        is_doc: is_doc,
        id_doc: cleanedObjectidInput,
        date_work: date_work,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setButtonAddDocPressed(true);

        return response.json();
      })
      .then((data) => {
        setIdFormAddWorks(data.id_wrk_tbl);
      })
      .then((data) => {
        setFormWorksData({
          type_work: "",
          is_doc: true,
          id_doc: objectidInput,
          address: "",
          date_work: "",
          pers_work: "",
        });
        NotificationService.showSuccessNotification('Данні успішно відправлені');
        setDataSubmitted(true);
      })
      .catch((error) => {
        NotificationService.showWarningNotification('Будь ласка, заповніть всі поля та спробуйте ще раз!');
        setDataSubmitted(false);
        console.error("Error inserting data into the database", error);
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
      <label className="block-label">Загальна інформація</label>
      <form className="form">
        <div className="form-left">
          <div className="form__group">
            <label className="form-input_title">Тип роботи</label>
            <select
              className="form__input form__input-select"
              name="type_work"
              onChange={handleChange}
            >
              <option value="" selected hidden>Оберіть тип роботи</option>
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
              <ErrorMessage errorMessage={"Оберіть варіант із переліку"} />
            )}
          </div>
          <div className="form__group">
            <label className="form-input_title">Особа, яка виконала роботу</label>

            <select
              className="form__input form__input-select"
              name="pers_work"
              onChange={handleChange}
            >
              <option value="" selected hidden>Оберіть особу</option>
              <option value="Шевченко Тарас" className="form__input-option">Шевченко Тарас</option>
              <option value="Українка Леся" className="form__input-option">Українка Леся</option>
            </select>
            {invalidInputs.includes("pers_work") && (
              <ErrorMessage errorMessage={"Оберіть варіант із переліку"} />
            )}
          </div>
          <div className="form__group datetime-input">
            <label className="form-input_title">Дата виконання роботи</label>
            <Input
              type="datetime-local"
              id="additionalDatetime"
              className="form__input"
              onChange={handleChange}
              name="date_work"
              hasError={invalidInputs.includes("date_work")}
              errorMessage={"Поле не може бути пустим"}
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
                onChange={handleCheckboxChange}>
              </input>
              <span className="slider round"></span>
            </label>
          </div>
          <div className="form__group form__group-radio">
            <label className="form-input_title">Адреса роботи</label>
            <Input
              type="text"
              name="address"
              placeholder="Введіть адресу роботи"
              className="form__input"
              onChange={handleChange}
              hasError={invalidInputs.includes("address")}
              errorMessage={"Поле не може бути пустим"}
            />
          </div>
          {isChecked && (
            <>
              <div className="form__group">
                <label className="form-input_title">
                  Документ / підстава проведення роботи
                </label>
                <Input
                  type="text"
                  placeholder="Документ / підстава"
                  className="form__input"
                  value={selectedDocValue}
                  onChange={handleInputChange}
                  readOnly
                  name="id_doc"
                  hasError={invalidInputs.includes("id_doc")}
                  errorMessage={"Поле не може бути пустим"}
                />
              </div>
              <div className="form__group">
                <button
                  className="form__button form__button-addForm"
                  onClick={handleButtonClick}
                  style={{
                    backgroundColor: buttonAddDocPressed ? "#6cd823" : "",
                  }}
                >
                  Зберегти
                </button>
                <button
                  className="form__button form__button-addForm"
                >
                  Скасувати
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormAddWorks;
