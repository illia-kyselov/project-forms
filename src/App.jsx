import React, { useState } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import MainForm from "./components/MainForm/MainForm";
import FormAddInfo from "./components/FormAddInfo/FormAddInfo";
import LeafletMap from "./components/LeafletMap/LeafletMap";

function App() {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [showAddInfoForm, setShowAddInfoForm] = useState(false);


  const handleAddFormClick = (e) => {
    e.preventDefault();
    setShowSecondForm(true);
  };

  const handleRemoveForm = (e) => {
    e.preventDefault();
    setShowSecondForm(false);
  }

  const handleAddInfo = (e) => {
    e.preventDefault();
    setShowAddInfoForm(true);
  }

  const handleRemoveInfo = (e) => {
    e.preventDefault();
    setShowAddInfoForm(false);
  }

  return (
    <div className="App">
      <LeafletMap setShowSecondForm={setShowSecondForm} />

      {/* <MainForm handleAddFormClick={handleAddFormClick} /> */}
      {showSecondForm &&
        <FormAddWorks
          handleRemoveForm={handleRemoveForm}
          handleAddInfo={handleAddInfo}
        />
      }
      {showAddInfoForm && <FormAddInfo handleRemoveInfo={handleRemoveInfo} />}
    </div>
  );
}

export default App;
