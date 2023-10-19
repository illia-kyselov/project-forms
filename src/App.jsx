import React, { useState } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import LeafletMap from "./components/LeafletMap/LeafletMap";
import FormAddElements from "./components/FormAddElements/FormAddElements";
import Table from "./components/Table/Table";
import SecondTable from "./components/SecondTable/SecondTable";
import Navigation from "./components/Navigation/Navigation";
import { NotificationContainer } from 'react-notifications';
import "react-notifications/lib/notifications.css";
import NotificationService from './services/NotificationService';
import icon from '../src/img/saveIcon.png';

function App() {
  // const [showAddInfoForm, setShowAddInfoForm] = useState(false);
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
  const [markerDzPosition, setMarkerDzPosition] = useState(null);
  const [draggableDzMarkerShow, setDraggableDzMarkerShow] = useState(false);
  const [draggableDzMarkerWKT, setDraggableDzMarkerWKT] = useState(false);

  const [idFormAddWorks, setIdFormAddWorks] = useState();

  const [buttonAddDocPressed, setButtonAddDocPressed] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [formSelectedDzShown, setFormSelectedDzShown] = useState(false);
  const [pushToDZCalled, setPushToDZCalled] = useState(false);
  const [isChecked, setIsChecked] = useState(true);


  const handleRowClick = (markerId) => {
    setFocusMarker(markerId);
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
    tableId: selectedRowData,
    element: "",
    quantity: 0,
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
        body: JSON.stringify({ ...formAddElementsData, tableId: selectedRowData }),
      });

      if (!response.ok) {
        NotificationService.showWarningNotification('Будь ласка, заповніть всі поля та спробуйте ще раз!');
        throw new Error(`Error: ${response.statusText}`);
      } else {
        NotificationService.showSuccessNotification('Данні успішно відправлені');
        handleRemoveElements(e);
      }

      const data = await response.json();
      setformAddElementsData({
        tableId: selectedRowData,
        element: "",
        quantity: 0,
      });

    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleDzClick = (markerId) => {
    setSelectedMarkerId(markerId);
  };

  const handleAddMarkerData = (markerData) => {
    const idExists = dataTable.some((row) => row.id === markerData.id);

    if (idExists || !formSelectedDzShown) {
      return;
    }

    setDataTable((prevData) => [...prevData, markerData]);
  };

  const handleClearTable = () => {
    setDataTable([]);
    setShowSecondTable(false);
    setSelectedMarkersPressed(false);
  };

  const handleMarkerDzPosition = (data) => {
    setMarkerDzPosition(data);
  };

  const handleDraggableDzMarkerShow = (data) => {
    setDraggableDzMarkerShow(data);
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
          handleMarkerDzDragend={handleMarkerDzPosition}
          focusMarker={focusMarker}
          setSelectedMarkerId={setSelectedMarkerId}
          setPolygonTableRowClick={setPolygonTableRowClick}
          setSelectedPolygonApp={setSelectedPolygon}
          buttonAddDocPressed={buttonAddDocPressed}
          showDraggableDzMarker={draggableDzMarkerShow}
          setDraggableDzMarkerWKT={setDraggableDzMarkerWKT}
          pushToDZCalled={pushToDZCalled}
          setPushToDZCalled={setPushToDZCalled}
          isChecked={isChecked}
        />
        <div className="form-container">
          <FormAddWorks
            objectid={objectid}
            selectedMarkerId={selectedMarkerId}
            selectedPolygon={selectedPolygon}
            polygonTableRowClick={polygonTableRowClick}
            setButtonAddDocPressed={setButtonAddDocPressed}
            buttonAddDocPressed={buttonAddDocPressed}
            setIdFormAddWorks={setIdFormAddWorks}
            idFormAddWorks={idFormAddWorks}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
          />
          <div className="flex">
            {buttonAddDocPressed && (
              <Table
                data={dataTable}
                setData={setDataTable}
                setShowSecondTable={setShowSecondTable}
                handleClearTable={handleClearTable}
                handleRowClick={handleRowClick}
                setButtonPressed={setButtonPressed}
                setDataSecondTable={setDataSecondTable}
                dzMarkerPosition={markerDzPosition}
                setDraggableDzMarkerShow={handleDraggableDzMarkerShow}
                buttonPressed={buttonPressed}
                idFormAddWorks={idFormAddWorks}
                setSelectedRowData={setSelectedRowData}
                setShowSelectedDzForm={setFormSelectedDzShown}
                handleAddElements={handleAddElements}
                draggableDzMarkerWKT={draggableDzMarkerWKT}
                setPushToDZCalled={setPushToDZCalled}
                isChecked={isChecked}
              />
            )}
            {showSecondTable &&
              <SecondTable
                dataSecondTable={dataSecondTable}
                handleChange={handleChange}
                formAddElementsData={formAddElementsData}
                selectedRowData={selectedRowData}
                handleAddElements={handleAddElements}
                showAddElements={showAddElements}
                handleRemoveElements={handleRemoveElements}
                handleSubmitElements={handleSubmitElements}
              />
            }
          </div>

          {/* {showSecondTable &&
            <div className="buttons-panel">
              <button className="buttons-panel__button">
                <img src={icon} alt="Icon" className="buttons-panel__icon" /> Зберегти
              </button>

              <button className="buttons-panel__button">Скасувати запис</button>
            </div>} */}
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
}

export default App;