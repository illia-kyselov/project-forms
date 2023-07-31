import React, { useState } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import FormAddInfo from "./components/FormAddInfo/FormAddInfo";
import LeafletMap from "./components/LeafletMap/LeafletMap";
import FormAddElements from "./components/FormAddElements/FormAddElements";

function App() {
  const [showAddInfoForm, setShowAddInfoForm] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [showAddElements, setShowAddElements] = useState(false);
  const [objectid, setObjectid] = useState("");
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

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

  const handleDzClick = (markerId) => {
    setSelectedMarkerId(markerId);
  };

  return (
    <div className="App">
      <LeafletMap
        handlePolygonClick={handlePolygonClick}
        handleDzClick={handleDzClick}
      />

      <div className="components-container">
        <FormAddWorks
          handleAddInfo={handleAddInfo}
          objectid={objectid}
          setFormObjectId={setObjectid}
          selectedMarkerId={selectedMarkerId}
        />
        {/* <MainForm
          selectedPolygon={selectedPolygon}
          onObjectidChange={(value) => setObjectid(value)}
        /> */}

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
