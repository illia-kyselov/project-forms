import React, { useState } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import MainForm from "./components/MainForm/MainForm";
import FormAddInfo from "./components/FormAddInfo/FormAddInfo";
import LeafletMap from "./components/LeafletMap/LeafletMap";

function App() {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [showAddInfoForm, setShowAddInfoForm] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  const handleAddFormClick = (e) => {
    e.preventDefault();
    setShowSecondForm(true);
  };

  const handleRemoveForm = (e) => {
    e.preventDefault();
    setShowSecondForm(false);
  };

  const handleAddInfo = (e) => {
    e.preventDefault();
    setShowAddInfoForm(true);
  };

  const handleRemoveInfo = (e) => {
    e.preventDefault();
    setShowAddInfoForm(false);
  };

  const handlePolygonClick = (objectid) => {
    fetch(`http://localhost:3001/doc_plg/${objectid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedPolygon(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching polygon data", error);
      });
  };

  return (
    <div className="App">
      <LeafletMap handlePolygonClick={handlePolygonClick} />

      <MainForm
        handleAddFormClick={handleAddFormClick}
        selectedPolygon={selectedPolygon}
      />
      {showSecondForm && (
        <FormAddWorks
          handleRemoveForm={handleRemoveForm}
          handleAddInfo={handleAddInfo}
        />
      )}
      {showAddInfoForm && <FormAddInfo handleRemoveInfo={handleRemoveInfo} />}
    </div>
  );
}

export default App;
