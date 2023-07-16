import React, { useState, useEffect } from "react";

const FormAddWorks = ({ handleRemoveForm }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_work");
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <form className="second-form">
      <div className="form-input_container-second">
        <p className="second-form-input_title">fid</p>
        <input type="text" className="second-form-input" placeholder="fid" />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Тип виконаних робіт</p>
        <select className="second-form-input">
          {options.map((option) => (
            <option key={option.name_wrk} value={option.name_wrk}>
              {option.name_wrk}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="second-form-input_title">Наявність документа в БД</p>
        <input
          type="checkbox"
          name="Наявність документа в БД"
          className="second-form-input second-form-input-radio"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Документ</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="Документ"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Адреса</p>
        <input type="text" className="second-form-input" placeholder="Адреса" />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Дата виконання робіт</p>
        <input
          type="datetime-local"
          id="additionalDatetime"
          className="second-form-input"
          placeholder="Дата виконання робіт"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Особа яка фіксувала роботи</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="Особа яка фіксувала роботи"
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">uuid</p>
        <input type="text" className="second-form-input" placeholder="uuid" />
      </div>
      <div className="second-form-button">
        <button className="button-escape" onClick={handleRemoveForm}>
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default FormAddWorks;
