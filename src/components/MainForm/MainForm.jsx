import React, { useEffect, useState } from "react";

const MainForm = ({ handleAddFormClick, selectedPolygon, onObjectidChange  }) => {
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
    } else {
      setFormData({
        objectid: "",
        num_disl: "",
        pro_name: "",
      });
    }
  }, [onObjectidChange, selectedPolygon]);

  return (
    <form className="form">
      <h1 className="form__title">Основні атрибути:</h1>
      <div className="form-input_container">
        <p className="form-input_title">ObjectId:</p>
        <input
          type="text"
          placeholder="ObjectId"
          value={formData.objectid}
          onChange={(e) =>
            setFormData({ ...formData, objectid: e.target.value })
          }
        />
      </div>
      <div className="form-input_container">
        <p className="form-input_title">Num_disl:</p>
        <input
          type="text"
          placeholder="Num_disl"
          value={formData.num_disl}
          onChange={(e) =>
            setFormData({ ...formData, num_disl: e.target.value })
          }
        />
      </div>
      <div className="form-input_container">
        <p className="form-input_title">ProName:</p>
        <input
          type="text"
          placeholder="ProName"
          value={formData.pro_name}
          onChange={(e) =>
            setFormData({ ...formData, pro_name: e.target.value })
          }
        />
      </div>
      <button className="form__button" onClick={handleAddFormClick}>
        Додати роботи
      </button>
    </form>
  );
};

export default MainForm;
