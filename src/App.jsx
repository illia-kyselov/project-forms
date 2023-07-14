import React, { useState } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import MainForm from "./components/MainForm/MainForm";

function App() {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const handleAddFormClick = (e) => {
    e.preventDefault();
    setShowSecondForm(true);
  };

  return (
    <div className="App">
      <MainForm handleAddFormClick={handleAddFormClick} />
      {showSecondForm && <FormAddWorks />}
    </div>
  );
}

export default App;
