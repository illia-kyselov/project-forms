import React, { useState, useEffect } from "react";

const FormAddInfo = ({ handleRemoveInfo, handleAddElements }) => {
  const [gForms, setGForms] = useState([]);
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

  return (
    <form className="second-form">
      <div className="form-input_container-second">
        <p className="second-form-input_title">Наявність ДЗ в БД</p>
        <input
          type="checkbox"
          name="Наявність ДЗ в БД"
          className="second-form-input second-form-input-radio"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Ідентифікатор ДЗ в БД</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="Ідентифікатор ДЗ в БД"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Номер ДЗ</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="Номер ДЗ"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Форма ДЗ</p>
        <select className="second-form-input">
          {gForms.map((gForm) => (
            <option key={gForm} value={gForm}>
              {gForm}
            </option>
          ))}
        </select>
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Ідентифікатор з таблиці робіт</p>
        <input
          className="second-form-input"
          placeholder="Ідентифікатор з таблиці робіт"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">uuid</p>
        <input type="text" className="second-form-input" placeholder="uuid" />
      </div>
      <div className="second-form-button">
        <button
          className="button-escape button-addInfo"
          onClick={handleAddElements}
        >
          Додати елементи
        </button>
        <button className="button-escape" onClick={handleRemoveInfo}>
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default FormAddInfo;
