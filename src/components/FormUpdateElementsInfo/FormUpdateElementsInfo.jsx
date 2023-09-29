import React, { useState, useEffect } from "react";
import NotificationService from '../../services/NotificationService';

const FormUpdateElementsInfo = ({ selectedElement, setShowUpdateElements, }) => {
  const [elements, setElements] = useState([]);
  const [formData, setFormData] = useState({
    element: '',
    quantity: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateElements = async (e) => {
    e.preventDefault();

    try {
      const elementId = selectedElement.id_elmts;

      const response = await fetch(`http://localhost:3001/elements/${elementId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        NotificationService.showWarningNotification('Будь ласка, заповніть всі поля та спробуйте ще раз!');
      } else {
        NotificationService.showSuccessNotification('Данні успішно оновлені');
        setShowUpdateElements(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEscapeClick = () => {
    setShowUpdateElements(false)
  }

  return (
    <div>
      <label className="block-label">Оновити дані елемента</label>
      <form className="form form-info">
        <div className="form__group">
          <label className="form-input_title">Елемент</label>
          <select
            className="form__input form__input-select"
            name="element"
            value={formData.element}
            onChange={handleChange}
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
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="form__button-container">
          <button
            className="form__button"
            onClick={handleUpdateElements}
          >
            Оновити данні
          </button>
          <button
            className="form__button button-escape"
            onClick={handleEscapeClick}
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormUpdateElementsInfo;
