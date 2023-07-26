import React, { useState, useEffect } from "react";

const FormAddInfo = ({
  handleRemoveInfo,
  handleAddElements,
  handleChangeFormInfo,
}) => {
  const [gForms, setGForms] = useState([]);
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_geform");
      const data = await response.json();
      setGForms(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    handleChangeFormInfo({ name: "Наявність ДЗ в БД", value: !isChecked });
  };

  return (
    <form className="form">
      <div className="form__group form__group-radio">
        <p className="form-input_title">Наявність ДЗ в БД:</p>
        <input
          type="checkbox"
          name="Наявність ДЗ в БД"
          className="form__input form__input-radio"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="form__group">
        <p className="form-input_title">Ідентифікатор ДЗ в БД:</p>
        <input
          type="text"
          className="form__input"
          onChange={handleChangeFormInfo}
        />
      </div>
      <div className="form__group">
        <p className="form-input_title">Номер ДЗ:</p>
        <input
          type="text"
          className="form__input"
          onChange={handleChangeFormInfo}
        />
      </div>
      <div className="form__group">
        <p className="form-input_title">Форма ДЗ:</p>
        <select className="form__input form__input-select">
          {gForms.map((gForm) => (
            <option key={gForm} value={gForm} className="form__input-option">
              {gForm}
            </option>
          ))}
        </select>
      </div>
      <div className="form__group">
        <p className="form-input_title">Ідентифікатор з таблиці робіт:</p>
        <input className="form__input" onChange={handleChangeFormInfo} />
      </div>
      <div className="form__group">
        <p className="form-input_title">uuid:</p>
        <input
          type="text"
          className="form__input"
          onChange={handleChangeFormInfo}
        />
      </div>
      <div className="form__button-container">
        <button
          className="form__button form__button-addForm"
          onClick={handleAddElements}
        >
          Додати елементи
        </button>
        <button
          className="form__button button-escape"
          onClick={handleRemoveInfo}
        >
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default FormAddInfo;
