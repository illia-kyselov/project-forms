import React, { useState, useEffect } from "react";

const FormUpdateElementsInfo = () => {
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
    <div>
      <label className="block-label">Оновити данні елемента</label>
      <form className="form form-info">
        <div className="form__group">
          <label className="form-input_title">Елемент</label>
          <select
            className="form__input form__input-select"
            name="element"
          >
            <option value="" selected hidden>Оберіть елемент</option>
            {elements.map((element) => (
              <option
                key={element}
                value={element}
                className="form__input-option"
              >
                {element}
              </option>
            ))}
          </select>
        </div>
        <div className="form__group">
          <label className="form-input_title">Кількість елементів</label>
          <input
            type="number"
            name="quantity"
            className="form__input"
          />
        </div>
        <div className="form__button-container">
          <button className="form__button">
            Оновити данні
          </button>
          <button
            className="form__button button-escape"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormUpdateElementsInfo;