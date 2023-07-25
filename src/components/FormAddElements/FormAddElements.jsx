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

  const [formData, setFormData] = useState({
    fid: "",
    tableId: "",
    element: "",
    quantity: 0,
    uuid: "",
    dztab_uuid: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name === "element"
          ? e.target.options[e.target.selectedIndex].text
          : value,
    }));
  };

  const handleSubmitElements = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/elements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      setFormData({
        fid: "",
        tableId: "",
        element: "",
        quantity: 0,
        uuid: "",
        dztab_uuid: "",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error sending data", error);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmitElements}>
      <div className="form__group">
        <label className="form-input_title">fid:</label>
        <input
          type="text"
          name="fid"
          className="form__input"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">Ідентифікатор таблиці ДЗ:</label>
        <input
          type="text"
          name="tableId"
          className="form__input"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">Елемент:</label>
        <select
          className="form__input form__input-select"
          name="element"
          onChange={handleChange}
          required
        >
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
        <label className="form-input_title">Кількість елементів:</label>
        <input
          type="number"
          name="quantity"
          className="form__input"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">uuid:</label>
        <input
          type="text"
          className="form__input"
          name="uuid"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">dztab_uuid:</label>
        <input
          type="text"
          className="form__input"
          name="dztab_uuid"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__button-container">
        <button className="form__button button-submit" type="submit">
          Відправити всі поля
        </button>
        <button
          className="form__button button-escape"
          onClick={handleRemoveElements}
        >
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default FormAddElements;
