import React, { useEffect, useState } from "react";

const Table = () => {
  const [dataTable, setData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3001/elements");
  //       const data = await response.json();
  //       setData(data);
  //     } catch (error) {
  //       console.error("Error fetching data", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="table">
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
        </tbody>
      </table>
    </div>
  );
};

export default Table;
