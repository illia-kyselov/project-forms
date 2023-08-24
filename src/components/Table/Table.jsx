import React, { useState, useEffect } from "react";

const Table = ({
  data,
  setData,
  setShowSecondTable,
  handleClearTable,
  selectedMarkersPressed,
  onRowClick,
  filteredMarkers, handleAddFromPolygon, setButtonPressed
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRowData, setNewRowData] = useState({
    id: "",
    num_sing: "",
  });

  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedFormByRow, setSelectedFormByRow] = useState({});

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:3001/dz_forms");
      const formData = await response.json();
      setForms(formData);
    } catch (error) {
      console.error("Error fetching forms data", error);
    }
  };

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

  const handleRowClick = (rowId) => {
    onRowClick(rowId);
    setSelectedRow(rowId); 
  };

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

  const handleFormSelect = (e, rowId) => {
    const selectedValue = e.target.value;
    setSelectedFormByRow((prevSelectedForms) => ({
      ...prevSelectedForms,
      [rowId]: selectedValue,
    }));
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

  const handleAddFromPolygonClick = () => {
    handleAddFromPolygon(filteredMarkers);
  };

  return (
    <div className="form-container-inside">
      <label className="block-label">Обрані дорожні знаки</label>

      <div className="table">
        {showAddForm && (
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="id"
              value={newRowData.id}
              onChange={handleInputChange}
              placeholder="ID"
              required
            />
            <input
              type="text"
              name="id_znk"
              value={newRowData.id_znk}
              onChange={handleInputChange}
              placeholder="Ідент. №"
              required
            />
            <input
              type="text"
              name="num_sing"
              value={newRowData.num_sing}
              onChange={handleInputChange}
              placeholder="Номер ПДР"
              required
            />
            <button type="submit" className="button-add-Dz">
              Зберегти
            </button>
            <button className="button-add-Dz" onClick={hideForm}>
              Назад
            </button>
          </form>
        )}
        <div className="flex">
          <button className="button-add-Dz" onClick={setButtonPressed}>
            Додати з полігону
          </button>
          <button className="button-add-Dz" onClick={() => setShowAddForm(true)}>
            Додати ДЗ
          </button>
          <button className="button-add-Dz" onClick={handleClearTable}>
            Очистити
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ідент. №</th>
              <th>Номер ПДР</th>
              <th>Форма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  onDoubleClick={() => handleROwDoubleClick(row.id)}
                  style={{ background: selectedRow === row.id ? "#b3dcfd" : "" }}
                >
                  <td>{row.id}</td>
                  <td>{row.id_znk || "Немає в БД"}</td>
                  <td>{row.num_sing || "Немає в БД"}</td>
                  <td>
                    <select
                      className="form__input form__input-select"
                      value={selectedFormByRow[row.id] || ""}
                      onChange={(e) => handleFormSelect(e, row.id)}
                    >
                      <option value="" >
                        Оберіть форму
                      </option>
                      {forms
                        .filter((form) => form.num_pdr_new === row.num_sing)
                        .map((form) => (
                          <option key={form.id} value={form.id}>
                            {form.form_dz}
                          </option>
                        ))}
                    </select>
                  </td>
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
      </div>
    </div>

  );
};

export default Table;
