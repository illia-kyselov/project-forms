import React from "react";

const MainForm = ({ handleAddFormClick }) => {
  return (
    <form className="form">
      <h1 className="form__title">Основні атрибути:</h1>
      <div className="form-input_container">
        <p className="form-input_title">ObjectId:</p>
        <input type="text" placeholder="ObjectId" />
      </div>
      <div className="form-input_container">
        <p className="form-input_title">Num_disl:</p>
        <input type="text" placeholder="Num_disl" />
      </div>
      <div className="form-input_container">
        <p className="form-input_title">ProName:</p>
        <input type="text" placeholder="ProName" />
      </div>
      <button className="form__button" onClick={handleAddFormClick}>
        Додати роботи
      </button>
    </form>
  );
};

export default MainForm;