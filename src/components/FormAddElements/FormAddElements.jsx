import React, { useState, useEffect } from "react";

const FormAddElements = ({ handleRemoveElements }) => {
  const [elements, setElements] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_elmnts");
      const data = await response.json();
      setElements(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  return (
    <form className="second-form">
      <div className="form-input_container-second">
        <p className="second-form-input_title">fid</p>
        <input
          type="text"
          name="fid"
          placeholder="fid"
          className="second-form-input"
        />
      </div>
      <div>
        <p className="second-form-input_title">Ідентифікатор таблиці ДЗ</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="Ідентифікатор таблиці ДЗ"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Елемент</p>
        <select className="second-form-input">
          {elements.map((element) => (
            <option key={element} value={element}>
              {element}
            </option>
          ))}
        </select>
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Кількість елементів</p>
        <input
          type="number"
          className="second-form-input"
          placeholder="Кількість елементів"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">uuid</p>
        <input type="text" className="second-form-input" placeholder="uuid" />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">dztab_uuid</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="dztab_uuid"
        />
      </div>
      <div className="second-form-button">
        <button className="button-submit button-escape" disabled>Відправити всі поля</button>
        <button className="button-escape" onClick={handleRemoveElements}>
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default FormAddElements;
