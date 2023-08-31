import React, { useState } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import FormAddInfo from "./components/FormAddInfo/FormAddInfo";
import LeafletMap from "./components/LeafletMap/LeafletMap";
import FormAddElements from "./components/FormAddElements/FormAddElements";
import Table from "./components/Table/Table";
import SecondTable from "./components/SecondTable/SecondTable";
import Navigation from "./components/Navigation/Navigation";

function App() {
  const [showAddInfoForm, setShowAddInfoForm] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [showAddElements, setShowAddElements] = useState(false);
  const [objectid, setObjectid] = useState("");
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [showSecondTable, setShowSecondTable] = useState(false);
  const [selectedMarkersPressed, setSelectedMarkersPressed] = useState(false);
  const [focusMarker, setFocusMarker] = useState(null);
  const [dataSecondTable, setDataSecondTable] = useState(null);
  const [polygonTableRowClick, setPolygonTableRowClick] = useState([]);

  const [buttonAddDocPressed, setButtonAddDocPressed] = useState(false);


  const handleRowClick = (markerId) => {
    setFocusMarker(markerId);
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

  const handleAddFromPolygon = (markers) => {
    if (buttonPressed) {
      setDataTable(markers);
      setButtonPressed(false);
    }
  };

  const handlePolygonClick = (objectid) => {
    fetch(`http://localhost:3001/doc_plg/${objectid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedPolygon(data[0]);
          setObjectid(objectid);
          setSelectedMarkerId(null);
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

  const handleAddMarkerData = (markerData) => {
    const idExists = dataTable.some((row) => row.id === markerData.id);

    if (idExists) {
      return;
    }

    setDataTable((prevData) => [...prevData, markerData]);
  };

  const handleClearTable = () => {
    setDataTable([]);
    setShowSecondTable(false);
    setSelectedMarkersPressed(false);
  };

  return (
    <div className="App">
      <Navigation />
      <div className="elements-container">
        <LeafletMap
          handlePolygonClick={handlePolygonClick}
          handleDzClick={handleDzClick}
          handleAddMarkerData={handleAddMarkerData}
          handleAddFromPolygon={handleAddFromPolygon}
          focusMarker={focusMarker}
          setSelectedMarkerId={setSelectedMarkerId}
          setPolygonTableRowClick={setPolygonTableRowClick}
          setSelectedPolygonApp={setSelectedPolygon}
        />
        <div className="form-container">
          <FormAddWorks
            handleAddInfo={handleAddInfo}
            objectid={objectid}
            setFormObjectId={setObjectid}
            selectedMarkerId={selectedMarkerId}
            selectedPolygon={selectedPolygon}
            polygonTableRowClick={polygonTableRowClick}
            setButtonAddDocPressed={setButtonAddDocPressed}
            buttonAddDocPressed={buttonAddDocPressed}

          />
          <div className=" flex">
            <Table
              data={dataTable}
              setData={setDataTable}
              handleAddFromPolygon={handleAddFromPolygon}
              setButtonPressed={setButtonPressed}
              buttonPressed={buttonPressed}
              setShowSecondTable={setShowSecondTable}
              handleClearTable={handleClearTable}
              selectedMarkersPressed={selectedMarkersPressed}
              onRowClick={handleRowClick}
              setDataSecondTable={setDataSecondTable}
            />
            {showSecondTable &&
              <SecondTable
                dataSecondTable={dataSecondTable}
              />
            }
          </div>
        </div>
      </div>
      <div className="components-container">
        {showAddInfoForm && (
          <div className="popup-overlay">
            <div className="popup-content">
              <FormAddInfo
                handleRemoveInfo={handleRemoveInfo}
                handleAddElements={handleAddElements}
              />
            </div>
          </div>
        )}
        {showAddElements && (
          <div className="popup-overlay">
            <div className="popup-content">
              <FormAddElements
                handleRemoveElements={handleRemoveElements}
                handleSubmitElements={handleSubmitElements}
                handleChange={handleChange}
                formAddElementsData={formAddElementsData}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;