import React, { useState, useEffect } from "react";

const FormAddWorks = ({
  handleAddInfo,
  objectid,
  selectedMarkerId,
  selectedPolygon,
  polygonTableRowClick,
  setButtonAddDocPressed,
  buttonAddDocPressed,
}) => {
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

  const selectedInfoFromTableRowClick =
    polygonTableRowClick.objectid && polygonTableRowClick.pro_name
      ? `${polygonTableRowClick.objectid} / ${polygonTableRowClick.pro_name}`
      : "";

  const selectedInfo =
    selectedMarkerId ||
    (selectedPolygon
      ? `${selectedPolygon.objectid} / ${selectedPolygon.pro_name}`
      : selectedInfoFromTableRowClick);

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

  const handleButtonClick = (e) => {
    e.preventDefault();
    setButtonAddDocPressed(true);
  }

  const [selectedDocValue, setSelectedDocValue] = useState("");

  const handleInputChange = (e) => {
    setSelectedDocValue(e.target.value);
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
            <select className="form__input form__input-select">
              {options.map((option) => (
                <option key={option} value={option} className="form__input-option">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form__group">
            <label className="form-input_title">Особа, яка виконала роботу</label>
            <select className="form__input">
              <option value="Шевченко Тарас">Шевченко Тарас</option>
            </select>
          </div>
          <div className="form__group datetime-input">
            <label className="form-input_title">Дата виконання роботи</label>
            <input
              type="datetime-local"
              id="additionalDatetime"
              className="form__input"
            />
          </div>
        </div>
        <div className="form-right">
          <div className="form__group form__group-radio">
            <label className="form-input_title">Обрати документ з БД</label>
            <label className="switch">
              <input
                type="checkbox"
                checkedtype="checkbox"
                name="Наявність документа в БД"
                className="form__input form__input-radio"
                checked={isChecked}
                onChange={handleCheckboxChange}>
              </input>
              <span className="slider round"></span>
            </label>
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
                />
                {/* <button
                  className="form__button form__button-addForm"
                  onClick={handleButtonClick}
                  style={{ backgroundColor: buttonAddDocPressed ? '#d8d8d8' : '' }}
                >
                  Обрати
                </button> */}
                <button
                  className="form__button form__button-addForm"
                  onClick={handleButtonClick}
                  style={{ backgroundColor: buttonAddDocPressed ? '#6cd823' : '' }}
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
          <div className="flex">
            <button
              className="form__button form__button-addForm"
              onClick={handleAddInfo}
            >
              Додати інфо про ДЗ
            </button>
            <button
              className="form__button form__button-addForm"
              disabled
            >
              Обрати ДЗ
            </button>
            <button
              className="form__button form__button-addForm"
              disabled
            >
              Створити ДЗ
            </button>
          </div>
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

        <div className="form__button-container">
          {/* <button className="form__button button-submit" type="submit">
          Відправити
        </button> */}

        </div>
      </form>
    </div>
  );
};

export default FormAddWorks;
