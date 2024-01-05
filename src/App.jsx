import React, { useState, useEffect } from "react";
import "./App.scss";
import FormAddWorks from "./components/FormAddWorks/FormAddWorks";
import LeafletMap from "./components/LeafletMap/LeafletMap";
import FormAddElements from "./components/FormAddElements/FormAddElements";
import Table from "./components/Table/Table";
import SecondTable from "./components/SecondTable/SecondTable";
import Header from "./components/Header/Header";
import { NotificationContainer } from 'react-notifications';
import "react-notifications/lib/notifications.css";
import NotificationService from './services/NotificationService';
import icon from '../src/img/saveIcon.png';
import { validateEmptyInputs } from "./helpers/validate-empty-inputs";

import { v4 as uuidv4 } from 'uuid';

function App() {
  // const [showAddInfoForm, setShowAddInfoForm] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [showAddElements, setShowAddElements] = useState(false);
  const [objectid, setObjectid] = useState("");
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const [dataDzTable, setDataDzTable] = useState([]);
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
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const [buttonAddDocPressed, setButtonAddDocPressed] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [formSelectedDzShown, setFormSelectedDzShown] = useState(false);
  const [pushToDZCalled, setPushToDZCalled] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [invalidInputs, setInvalidInputs] = useState([]);
  const [uuidTable, setUuidTable] = useState();


  const [selectedElement, setSelectedElement] = useState(null);

  const [workToInsert, setWorkToInsert] = useState([]);
  const [tableToInsert, setTableToInsert] = useState([]);
  const [allElementsData, setAllElementsData] = useState([]);


  const [visibleButtonInsert, setVisibleButtonInsert] = useState(true);
  const [formAddElementsData, setformAddElementsData] = useState({
    tableId: selectedRowData,
    element: "",
    quantity: 0,
  });
  const [formData, setFormData] = useState({
    element: '',
    quantity: ''
  });
  const [formWorksData, setFormWorksData] = useState({
    type_work: "",
    is_doc: true,
    id_doc: 0,
    address: "",
    date_work: "",
    pers_work: "",
  });
  const [showUpdateElements, setShowUpdateElements] = useState(false);
  const emptyInputs = validateEmptyInputs(formData);
  const hasEmptyInputs = emptyInputs.length > 0;

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
    setDataDzTable(markers);
    setButtonPressed(false);
  };

  const handleAddDzFromPolygon = () => {
    setDataTable(dataDzTable);
  }

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

  const handleSubmitElements = (e) => {
    e.preventDefault();

    setInvalidInputs([]);

    if (!formAddElementsData.element) {
      setInvalidInputs((prevInvalidInputs) => [...prevInvalidInputs, "element"]);
      NotificationService.showWarningNotification('Будь ласка, оберіть елемент');
      return;
    }

    if (formAddElementsData.quantity === "" || formAddElementsData.quantity <= 0) {
      setInvalidInputs((prevInvalidInputs) => [...prevInvalidInputs, "quantity"]);
      NotificationService.showWarningNotification('Кількість елементів повинна бути більше 0');
      return;
    }

    const newData = {
      ...formAddElementsData,
      tableId: selectedRowData,
      id: uuidv4()
    };

    setAllElementsData((prevData) => [...prevData, newData]);
    NotificationService.showSuccessNotification('Данні успішно додані');
    setformAddElementsData({
      tableId: selectedRowData,
      element: "",
      quantity: 0,
    });
    handleRemoveElements(e);
  };

  const handleUpdateElements = (e) => {
    e.preventDefault();

    if (hasEmptyInputs) {
      setInvalidInputs(emptyInputs);
      NotificationService.showWarningNotification('Будь ласка заповніть всі поля!');
      return;
    }

    if (formData.quantity <= 0) {
      setInvalidInputs([...invalidInputs, "quantity"]);
      NotificationService.showWarningNotification('Кількість елементів повинна бути більше 0');
      return;
    }

    const elementId = selectedElement.id_elmts;

    const updatedData = allElementsData.map((element) => {
      if (element.id_elmts === elementId) {
        return { ...element, ...formData };
      }
      return element;
    });

    setAllElementsData(updatedData);
    NotificationService.showSuccessNotification('Данні успішно оновлені');
    setShowUpdateElements(false);
  };

  const handleDzClick = (markerId) => {
    setSelectedMarkerId(markerId);
  };

  const handleAddMarkerData = (markerData) => {
    const idExists = dataTable.some((row) => row.id === markerData.id);

    if (idExists || !formSelectedDzShown) {
      return;
    }

    const dataWithUUID = {
      ...markerData,
      uuid: uuidv4()
    };

    setDataTable((prevData) => [...prevData, dataWithUUID]);
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

  const date_work =
    formWorksData.date_work || new Date(Date.now()).toISOString();
  const is_doc = isChecked;

  const selectedInfoFromTableRowClick =
    polygonTableRowClick.objectid && polygonTableRowClick.pro_name
      ? `${polygonTableRowClick.objectid} / ${polygonTableRowClick.pro_name}`
      : "";

  const selectedInfo =
    (selectedPolygon
      ? `${selectedPolygon.objectid} / ${selectedPolygon.pro_name}`
      : selectedInfoFromTableRowClick);

  let objectidInput = null;

  if (selectedInfo !== selectedMarkerId) {
    const parts = selectedInfo.split('/').map(part => part.trim());
    objectidInput = parts.length > 0 ? parts[0] : null;

    objectidInput = objectidInput.replace(/_/g, '');
  }

  let cleanedObjectidInput = objectidInput.replace(/_/g, '');
  if (isChecked === false) {
    cleanedObjectidInput = null;
  }

  const handleSendAllData = async () => {
    try {
      const workResponse = await fetch("http://localhost:3001/work_table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...workToInsert,
          is_doc: is_doc,
          id_doc: cleanedObjectidInput,
          date_work: date_work,
        })
      });

      if (!workResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const workData = await workResponse.json();

      const { id_wrk_tbl } = workData;

      setIdFormAddWorks(workData.id_wrk_tbl);

      const workId = id_wrk_tbl;

      setUuidTable(workData.id_wrk_tbl);

      setFormWorksData({
        type_work: "",
        is_doc: true,
        id_doc: objectidInput,
        address: "",
        date_work: "",
        pers_work: "",
      });

      setDataSubmitted(true);

      for (const row of tableToInsert) {
        const dataToSend = { ...row, work_uuid: workId };

        const response = await fetch("http://localhost:3001/expl_dz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          NotificationService.showWarningNotification('Будь ласка, заповніть всі поля та спробуйте ще раз!');
        }
      }

      for (const element of allElementsData) {
        const response = await fetch("http://localhost:3001/elements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...element }),
        });

        if (!response.ok) {
          NotificationService.showWarningNotification('Помилка під час надсилання даних елементів');
        }
      }



      NotificationService.showInfoNotification('Всі дані надіслані');
      setVisibleButtonInsert(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="elements-container">
        <LeafletMap
          handlePolygonClick={handlePolygonClick}
          handleDzClick={handleDzClick}
          handleAddMarkerData={handleAddMarkerData}
          handleAddFromPolygon={handleAddFromPolygon}
          handleMarkerDzDragend={handleMarkerDzPosition}
          focusMarker={focusMarker}
          setFocusMarker={setFocusMarker}
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
            setWorkToInsert={setWorkToInsert}
            uuidTable={uuidTable}
            dataSubmitted={dataSubmitted}
            formWorksData={formWorksData}
            setFormWorksData={setFormWorksData}
            visibleButtonInsert={visibleButtonInsert}
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
                handleAddDzFromPolygon={handleAddDzFromPolygon}
                setFocusMarker={setFocusMarker}
                focusMarker={focusMarker}
                buttonAddDocPressed={buttonAddDocPressed}
                isChecked={isChecked}
                setTableToInsert={setTableToInsert}
                tableToInsert={tableToInsert}
                allElementsData={allElementsData}
                setAllElementsData={setAllElementsData}
              />
            )}
            {showSecondTable && dataTable.length > 0 &&
              <SecondTable
                dataSecondTable={dataSecondTable}
                handleChange={handleChange}
                formAddElementsData={formAddElementsData}
                selectedRowData={selectedRowData}
                handleAddElements={handleAddElements}
                showAddElements={showAddElements}
                handleRemoveElements={handleRemoveElements}
                handleSubmitElements={handleSubmitElements}
                invalidInputs={invalidInputs}
                handleUpdateElements={handleUpdateElements}
                showUpdateElements={showUpdateElements}
                setShowUpdateElements={setShowUpdateElements}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                allElementsData={allElementsData}
                setAllElementsData={setAllElementsData}
                setInvalidInputs={setInvalidInputs}
              />
            }
          </div>

          {showSecondTable && visibleButtonInsert &&
            <div className="buttons-panel">
              <button
                className="buttons-panel__button"
                onClick={handleSendAllData}
              >
                <img src={icon} alt="Icon" className="buttons-panel__icon" /> Зберегти
              </button>
            </div>}
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
}

export default App;