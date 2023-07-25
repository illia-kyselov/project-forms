import React, { useEffect, useState } from "react";

const MainForm = ({
  handleAddFormClick,
  selectedPolygon,
  onObjectidChange,
}) => {
  const [formData, setFormData] = useState({
    objectid: "",
    num_disl: "",
    pro_name: "",
  });

  useEffect(() => {
    if (selectedPolygon) {
      const { objectid, num_disl, pro_name } = selectedPolygon;
      setFormData({
        objectid: objectid || "",
        num_disl: num_disl || "",
        pro_name: pro_name || "",
      });
      onObjectidChange(objectid);
    }
  }, [onObjectidChange, selectedPolygon]);

  return (
    <form className="form">
      <h1 className="form__title">Основні атрибути:</h1>
      <div className="form__group">
        <label className="form-input_title">ObjectId:</label>
        <input
          className="form__input"
          type="text"
          value={formData.objectid}
          onChange={(e) =>
            setFormData({ ...formData, objectid: e.target.value })
          }
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">Num_disl:</label>
        <input
          className="form__input"
          type="text"
          value={formData.num_disl}
          onChange={(e) =>
            setFormData({ ...formData, num_disl: e.target.value })
          }
        />
      </div>
      <div className="form__group">
        <label className="form-input_title">ProName:</label>
        <input
          className="form__input"
          type="text"
          value={formData.pro_name}
          onChange={(e) =>
            setFormData({ ...formData, pro_name: e.target.value })
          }
        />
      </div>
      <div className="form__button-container">
        <button
          className="form__button form__button-addForm"
          onClick={handleAddFormClick}
        >
          Додати роботи
        </button>
      </div>
    </form>
  );
};

export default MainForm;
