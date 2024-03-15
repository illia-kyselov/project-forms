import React, { useState, useEffect } from "react";
import DraggablePopup from "../DraggablePopup/DraggablePopup";
import Input from "../Input/Input";
import { addCatalogElement } from "../../api/addCatalogElement";

const CatalogAddElements = ({
  handleHIdeElementsForm,
  selectedRowData,
  setShowElementsForm,
  setElementsCatalog,
  clickedRowDZ,
  setFilteredElementData,
}) => {
  const [elements, setElements] = useState([]);
  const [catalogFormAddElementData, setCatalogFormAddElementData] = useState({
    element: "",
    quantity: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCatalogFormAddElementData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name === "element"
          ? e.target.options[e.target.selectedIndex].text
          : value,
    }));
  };

  const handleRowClick = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:3001/catalog/elements?uuid=${uuid}`);
      const data = await response.json();
      setElementsCatalog(data);
      setFilteredElementData(data);
    } catch (error) {
      console.error('Error updating data', error);
    }
  }

  const handleSubmitAddForm = async (e) => {
    e.preventDefault();
    await addCatalogElement(selectedRowData.expldz_uuid, catalogFormAddElementData);
    setShowElementsForm(false);
    handleRowClick(clickedRowDZ.uuid);
  }

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
    <DraggablePopup>
      <div>
        <label className="block-label">Додати елементи</label>
        <form className="form form-info">
          <div className="form__group">
            <label className="form-input_title">Елемент</label>
            <select
              className={`form__input form__input-select`}
              name="element"
              defaultValue={catalogFormAddElementData.element || ''}
              onChange={handleChange}
            >
              <option value="" hidden>Оберіть елемент</option>
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
            <Input
              type="number"
              name="quantity"
              className={`form__input`}
              onChange={handleChange}
              min="1"
              pattern="[1-9][0-9]*"
              errorMessage={"Введіть кількість елементів"}
              placeholder={'Введіть кількість елементів'}
            />
          </div>
          <div className="form__button-container">
            <button className="form__button" onClick={handleSubmitAddForm}>
              Додати елементи
            </button>
            <button
              className="form__button button-escape"
              onClick={handleHIdeElementsForm}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </DraggablePopup>
  );
};

export default CatalogAddElements;