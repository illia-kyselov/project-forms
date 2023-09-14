import React, { useState, useEffect } from "react";

const Table = ({
  data,
  setData,
  setShowSecondTable,
  handleClearTable,
  selectedMarkersPressed,
  onRowClick,
  filteredMarkers,
  handleAddFromPolygon,
  setButtonPressed,
  setDataSecondTable,
  buttonPressed,
  buttonAddDocPressed,
  idFormAddWorks
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRowData, setNewRowData] = useState({
    id: "",
    num_sing: "",
  });

  const [forms, setForms] = useState([]);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const idExists = data.some((row) => row.id === newRowData.id);

    if (idExists) {
      return;
    }

    try {
      const rowsToInsert = data.map((row) => ({
        is_dz: true,
        num_dz: row.num_sing,
        dz_form: selectedFormByRow[row.id],
        id_disl_dz: row.id,
        work_id: idFormAddWorks,
      }));

      const responses = await Promise.all(
        rowsToInsert.map((row) =>
          fetch("http://localhost:3001/expl_dz", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(row),
          })
        )
      );

      const successResponses = responses.filter((response) => response.ok);

      if (successResponses.length === responses.length) {
        setData([]);
        setNewRowData({ id: "", num_sing: "" });
        setShowAddForm(false);
      } else {
        console.error("Some requests were not successful");
      }
    } catch (error) {
      console.error("Error inserting data into the database", error);
    }
  };

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
    setDataSecondTable(rowId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSelect = (e, rowId) => {
    const selectedText = e.target.options[e.target.selectedIndex].text;

    const updatedSelectedFormByRow = { ...selectedFormByRow };

    updatedSelectedFormByRow[rowId] = selectedText;

    setSelectedFormByRow(updatedSelectedFormByRow);
  };



  const hideForm = (event) => {
    event.preventDefault();
    setShowAddForm(false);
  };

  return (
    buttonAddDocPressed && (
      <div className="form-container-inside form-container-inside-width">
        <label className="block-label">Обрані дорожні знаки</label>

        <div className="table">
          {showAddForm && (
            <div>
              <form className="form-addDz">
                <div className="form-addDz__group">
                  <label className="form-addDz-input_title">ID</label>
                  <input
                    className="form-addDz__input"
                    type="text"
                    name="id"
                    value={newRowData.id}
                    onChange={handleInputChange}
                    placeholder="ID"
                    required
                  />
                </div>
                <div className="form-addDz__group">
                  <label className="form-addDz-input_title">Ідент. №</label>
                  <input
                    className="form-addDz__input"
                    type="text"
                    name="id_znk"
                    value={newRowData.id_znk}
                    onChange={handleInputChange}
                    placeholder="Ідент. №"
                    required
                  />
                </div>
                <div className="form-addDz__group">
                  <label className="form-addDz-input_title">Номер ПДР</label>
                  <input
                    className="form-addDz__input"
                    type="text"
                    name="num_sing"
                    value={newRowData.num_sing}
                    onChange={handleInputChange}
                    placeholder="Номер ПДР"
                    required
                  />
                </div>
                <div className="flex">
                  <button disabled className="button-add-Dz">
                    Показати на карті
                  </button>
                  <button type="submit" className="button-add-Dz">
                    Зберегти
                  </button>
                  <button className="button-add-Dz" onClick={hideForm}>
                    Скасувати
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="flex">
            <button className="button-add-Dz" onClick={setButtonPressed} style={{ backgroundColor: buttonPressed ? '#46aa03' : '' }}>
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
                <th>Номер ПДР</th>
                <th>Форма</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  onDoubleClick={() => handleROwDoubleClick(row.id)}
                  style={{ background: selectedRow === row.id ? "#b3dcfd" : "" }}
                >
                  <td>{row.id}</td>
                  <td>{row.num_sing || "Немає в БД"}</td>
                  <td>
                    <select
                      className="form__input form__input-select"
                      value={selectedFormByRow[row.id] || ""}
                      onChange={(e) => handleFormSelect(e, row.id)}
                    >
                      <option value="">Оберіть форму</option>
                      {forms
                        .filter((form) => form.num_pdr_new === row.num_sing)
                        .map((form) => (
                          <option key={form.id} value={form.form_dz}>
                            {form.form_dz}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <button className="delete-icon" onClick={() => deleteData(row.id)}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="table-paragraph-button"
            onClick={handleFormSubmit}
            style={{ display: data.length > 0 ? 'block' : 'none' }}
          >
            Сформувати перелік
          </button>

        </div>
      </div>
    )
  );
};

export default Table;
