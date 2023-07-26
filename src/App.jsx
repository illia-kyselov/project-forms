import React, { useState } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import MainForm from "./components/MainForm/MainForm";
import FormAddInfo from "./components/FormAddInfo/FormAddInfo";
import LeafletMap from "./components/LeafletMap/LeafletMap";
import FormAddElements from "./components/FormAddElements/FormAddElements";

function App() {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [showAddInfoForm, setShowAddInfoForm] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [showAddElements, setShowAddElements] = useState(false);
  const [objectid, setObjectid] = useState("");

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

  const handleAddElements = (e) => {
    e.preventDefault();
    setShowAddElements(true);
  };

  const handleRemoveElements = (e) => {
    e.preventDefault();
    setShowAddElements(false);
  };

  const handlePolygonClick = (objectid) => {
    fetch(`http://localhost:3001/doc_plg/${objectid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedPolygon(data[0]);
          setObjectid(objectid);
        }
      })
      .catch((error) => {
        console.error("Error fetching polygon data", error);
      });
  };

  const [formAddElementsData, setformAddElementsData] = useState({
    fid: "",
    tableId: "",
    element: "",
    quantity: 0,
    uuid: "",
    dztab_uuid: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformAddElementsData((prevFormData) => ({
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
        body: JSON.stringify(formAddElementsData),
      });
      const data = await response.json();
      console.log(data);
      setformAddElementsData({
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
    <div className="App">
      <LeafletMap handlePolygonClick={handlePolygonClick} />

      <div className="components-container">
        <MainForm
          handleAddFormClick={handleAddFormClick}
          selectedPolygon={selectedPolygon}
          onObjectidChange={(value) => setObjectid(value)}
        />
        {showSecondForm && (
          <FormAddWorks
            handleRemoveForm={handleRemoveForm}
            handleAddInfo={handleAddInfo}
            objectid={objectid}
          />
        )}
        {showAddInfoForm && (
          <FormAddInfo
            handleRemoveInfo={handleRemoveInfo}
            handleAddElements={handleAddElements}
          />
        )}
        {showAddElements && (
          <FormAddElements
            handleRemoveElements={handleRemoveElements}
            handleSubmitElements={handleSubmitElements}
            handleChange={handleChange}
            formAddElementsData={formAddElementsData}
          />
        )}
      </div>
    </div>
  );
}

export default App;
