import React, { useEffect, useState } from "react";

const Table = ({ showSecondTable }) => {
  const [dataTable, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/elements");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="table">
      {showSecondTable && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>expl_dz_id</th>
              <th>name_elmns</th>
              <th>cnt_elmnt</th>
            </tr>
          </thead>
          <tbody>
            {dataTable.map((element) => (
              <tr key={element.id_elmts}>
                <td>{element.id_elmts}</td>
                <td>{element.expl_dz_id}</td>
                <td>{element.name_elmns || "Немає в БД"}</td>
                <td>{element.cnt_elmnt || "Немає в БД"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
