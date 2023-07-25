import React, { useState, useEffect } from "react";

const FormAddWorks = ({ handleRemoveForm, handleAddInfo, objectid }) => {
  const [options, setOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [formObjectId, setFormObjectId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormObjectId(objectid);
  }, [objectid]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_work");
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <form className="form">
      <div className="form__group">
        <label className="form-input_title">Тип виконаних робіт:</label>
        <select className="form__input form__input-select">
          {options.map((option) => (
            <option key={option} value={option} className="form__input-option">
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="form__group form__group-radio">
        <label className="form-input_title">
          Наявність документа в БД:
        </label>
        <input
          type="checkbox"
          name="Наявність документа в БД"
          className="form__input form__input-radio"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">Документ:</label>
        <input
          type="text"
          className="form__input"
          value={formObjectId}
          readOnly
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">Адреса:</label>
        <input type="text" className="form__input" />
      </div>
      <div className="form__group">
        <label className="form-input_title">Дата виконання робіт:</label>
        <input
          type="datetime-local"
          id="additionalDatetime"
          className="form__input"
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">Особа яка фіксувала роботи:</label>
        <select className="form__input">
          <option value="Шевченко Тарас">Шевченко Тарас</option>
        </select>
      </div>
      <div className="form__group">
        <label className="form-input_title">uuid:</label>
        <input type="text" className="form__input" />
      </div>
      <div className="form__button-container">
        <button
          className="form__button form__button-addForm"
          onClick={handleAddInfo}
        >
          Додати інфо про дз
        </button>
        <button
          className="form__button button-escape"
          onClick={handleRemoveForm}
        >
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default FormAddWorks;
