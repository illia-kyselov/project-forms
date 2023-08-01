import React, { useState, useEffect } from "react";

const FormAddWorks = ({ handleAddInfo, objectid, selectedMarkerId }) => {
  const [options, setOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [formObjectId, setFormObjectId] = useState("");

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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   fetch("http://localhost:3001/work_table", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formData),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       setFormData({
  //         type_work: "",
  //         is_doc: true,
  //         id_doc: "",
  //         address: "",
  //         date_work: "",
  //         pers_work: "",
  //         uuid: "",
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error inserting data into the database", error);
  //     });
  // };

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
        <label className="form-input_title">Наявність документа в БД:</label>
        <input
          type="checkbox"
          name="Наявність документа в БД"
          className="form__input form__input-radio"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      {/* {!isChecked && (
        <>
          <div className="form__group">
            <label className="form-input_title">Зв'язати з документом:</label>
            <input
              type="text"
              className="form__input"
            />
          </div>
        </>
      )} */}
      {isChecked && (
        <>
          <div className="form__group">
            <label className="form-input_title">Документ:</label>
            <input
              type="text"
              className="form__input"
              value={selectedMarkerId || formObjectId}
              readOnly
            />
          </div>
        </>
      )}
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
      {/* <div className="form__group">
        <label className="form-input_title">uuid:</label>
        <input type="text" className="form__input" />
      </div> */}
      <div className="form__button-container">
        {/* <button className="form__button button-submit" type="submit">
          Відправити
        </button> */}
        <button
          className="form__button form__button-addForm"
          onClick={handleAddInfo}
        >
          Додати інфо про дз
        </button>
      </div>
    </form>
  );
};

export default FormAddWorks;
