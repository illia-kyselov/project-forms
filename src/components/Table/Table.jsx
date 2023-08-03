import React, { useEffect, useState } from "react";

const Table = ({ data, setData, setShowSecondTable, setButtonPressed, handleClearTable }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRowData, setNewRowData] = useState({
    id: "",
    num_pdr: "",
    topocode: "",
  });

  const deleteData = (id) => {
    setData((prevData) => {
      const updatedData = prevData.filter((element) => element.id !== id);
      return updatedData;
    });
  };

  const handleROwDoubleClick = (rowId) => {
    setSelectedRow(rowId);
    setShowSecondTable(true);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const idExists = data.some((row) => row.id === newRowData.id);

    if (idExists) {
      return;
    }

    setData([...data, newRowData]);

    setNewRowData({ id: "", num_pdr: "", topocode: "" });
    setShowAddForm(false);
  };

  const hideForm = (event) => {
    event.preventDefault();
    setShowAddForm(false)
  }

  return (
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
            name="num_pdr"
            value={newRowData.num_pdr}
            onChange={handleInputChange}
            placeholder="num_pdr"
            required
          />
          <input
            type="text"
            name="id_znk"
            value={newRowData.id_znk}
            onChange={handleInputChange}
            placeholder="id_znk"
            required
          />
          <input
            type="text"
            name="topocode"
            value={newRowData.topocode}
            onChange={handleInputChange}
            placeholder="topocode"
            required
          />
          <button type="submit" className="button-add-Dz">Зберегти</button>
          <button className="button-add-Dz" onClick={hideForm}>Назад</button>
        </form>
      )}
      <div className="flex">
        <button className="button-add-Dz" onClick={setButtonPressed}>
          Додати з полігону
        </button>
        <button
          className="button-add-Dz"
          onClick={() => setShowAddForm(true)}
        >
          Додати dz
        </button>
        <button
          className="button-add-Dz"
          onClick={handleClearTable}
        >
          Очистити
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>num_pdr</th>
            <th>id_znk</th>
            <th>topocode</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} onDoubleClick={() => handleROwDoubleClick(row.id)} style={{ background: selectedRow === row.id ? '#b3dcfd' : '' }}>
              <td>{row.id}</td>
              <td>{row.num_pdr}</td>
              <td>{row.id_znk || 'Немає в БД'}</td>
              <td>{row.topocode || 'Немає в БД'}</td>
              <td>
                <button className="delete-icon" onClick={() => deleteData(row.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
