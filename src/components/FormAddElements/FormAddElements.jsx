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
    <form className="second-form" onSubmit={handleSubmitElements}>
      <div className="form-input_container-second">
        <p className="second-form-input_title">fid</p>
        <input
          type="text"
          name="fid"
          placeholder="fid"
          className="second-form-input"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Ідентифікатор таблиці ДЗ</p>
        <input
          type="text"
          name="tableId"
          className="second-form-input"
          placeholder="Ідентифікатор таблиці ДЗ"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">Елемент</p>
        <select
          className="second-form-input"
          name="element"
          onChange={handleChange}
          required
        >
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
          name="quantity"
          className="second-form-input"
          placeholder="Кількість елементів"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">uuid</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="uuid"
          name="uuid"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-input_container-second">
        <p className="second-form-input_title">dztab_uuid</p>
        <input
          type="text"
          className="second-form-input"
          placeholder="dztab_uuid"
          name="dztab_uuid"
          onChange={handleChange}
          required
        />
      </div>
      <div className="second-form-button">
        <button className="button-submit button-escape" type="submit">
          Відправити всі поля
        </button>
        <button className="button-escape" onClick={handleRemoveElements}>
          Скасувати
        </button>
      </div>
    </form>
  );
};

export default FormAddElements;
