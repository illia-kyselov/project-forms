import React, { useState, useEffect } from "react";
import NotificationService from '../../services/NotificationService';

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
  setIsChecked,
}) => {
  const [options, setOptions] = useState([]);
  const [formObjectId, setFormObjectId] = useState("");
  const [selectedDocValue, setSelectedDocValue] = useState("");
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [idTable, setIdTable] = useState();

  const [formWorksData, setFormWorksData] = useState({
    type_work: "",
    is_doc: true,
    id_doc: 0,
    address: "",
    date_work: "",
    pers_work: "",
  });

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

  async function deleteRecordsById(id) {
    try {
      const elementsResponse = await fetch(`http://localhost:3001/elements/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!elementsResponse.ok) {
        NotificationService.showErrorNotification('Дані не видалені');
        return;
      }

      const explDzResponse = await fetch(`http://localhost:3001/expl_dz/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!explDzResponse.ok) {
        NotificationService.showErrorNotification('Дані не видалені');
        return;
      }

      const workTableResponse = await fetch(`http://localhost:3001/work_table/${id}`, {
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

    const is_doc = isChecked;

    const date_work =
      formWorksData.date_work || new Date(Date.now()).toISOString();

    let cleanedObjectidInput = objectidInput.replace(/_/g, '');

    if (isChecked === false) {
      cleanedObjectidInput = null;
    }

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
        setIdTable(data.id_wrk_tbl);
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

          </div>
          <div className="form__group">
            <label className="form-input_title">Особа, яка виконала роботу</label>

            <select
              className="form__input form__input-select"
              name="pers_work"
              disabled={buttonAddDocPressed}
              onChange={handleChange}
            >
              <option value="" selected hidden>Оберіть особу</option>
              <option value="Шевченко Тарас" className="form__input-option">Шевченко Тарас</option>
              <option value="Українка Леся" className="form__input-option">Українка Леся</option>
            </select>
          </div>
          <div className="form__group datetime-input">
            <label className="form-input_title">Дата виконання роботи</label>
            <input
              type="datetime-local"
              id="additionalDatetime"
              className="form__input"
              onChange={handleChange}
              disabled={buttonAddDocPressed}
              name="date_work"
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
              <span className="slider round" style={{ backgroundColor: buttonAddDocPressed ? 'grey' : '' }}></span>
            </label>
          </div>
          <div className="form__group form__group-radio">
            <label className="form-input_title">Адреса роботи</label>
            <input
              type="text"
              name="address"
              placeholder="Введіть адресу роботи"
              className="form__input"
              disabled={buttonAddDocPressed}
              onChange={handleChange}>
            </input>
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
            {buttonAddDocPressed &&
              <button
                className="form__button form__button-addForm form__button-delete"
                onClick={() => deleteRecordsById(idTable)}
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
