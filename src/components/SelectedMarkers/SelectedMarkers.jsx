import React, { useState } from "react";

const SelectedMarkers = ({
  data,
  setData,
  setShowSecondTable,
  setButtonPressed,
  handleClearTable,
  setSelectedMarkersPressed,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRowData, setNewRowData] = useState({
    id: "",
    num_sing: "",
  });

  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     fetch("http://localhost:3001/dict_dz_form")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const dzForms = data.map((form) => ({
  //         id: form.id,
  //         form_dz: form.form_dz,
  //       }));
  //       setForms(data);
  //     })
  //   } catch (error) {
  //     console.error("Error fetching data", error);
  //   }
  // };

  const deleteData = (id) => {
    setData((prevData) => {
      const updatedData = prevData.filter((element) => element.id !== id);
      return updatedData;
    });
  };

  const handleROwDoubleClick = (rowId) => {
    setSelectedRow(rowId);
    setShowSecondTable(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSelect = (e) => {
    setSelectedForm(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const idExists = data.some((row) => row.id === newRowData.id);

    if (idExists) {
      return;
    }

    setData([...data, newRowData]);

    setNewRowData({ id: "", num_sing: "" });
    setShowAddForm(false);
  };

  const hideForm = (event) => {
    event.preventDefault();
    setShowAddForm(false);
  };

  const handleButtonClick = () => {
    setSelectedMarkersPressed(true);
  }

  return (
    <div className="table">
      <div className="flex">
        <button className="button-add-Dz" onClick={setButtonPressed}>
          Додати з полігону
        </button>
        <button className="button-add-Dz" onClick={handleClearTable}>
          Очистити
        </button>
      </div>
      <table className="table__selectedMarkers">
        <thead>
          <tr>
            <th>ID</th>
            <th>num_sing</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              // onDoubleClick={() => handleROwDoubleClick(row.id)}
              // style={{ background: selectedRow === row.id ? "#b3dcfd" : "" }}
            >
              <td>{row.id}</td>
              <td>{row.num_sing || "Немає в БД"}</td>
              <td>
                <button
                  className="delete-icon"
                  onClick={() => deleteData(row.id)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-button-submit-container">
        <button className="button-add-Dz table-button-submit" onClick={handleButtonClick}>
          Відправити у таблицю
        </button>
      </div>
    </div>
  );
};

export default SelectedMarkers;
