import React, { useState, useEffect } from 'react';
import './styles.scss';

const CatalogTable = ({
  user,
}) => {
  const [catalogData, setCatalogData] = useState([]);

  useEffect(() => {
    const fetchDataFromDB = async () => {
      try {
        const response = await fetch(`http://localhost:3001/catalog/work_table?pers_work=${user}`);
        const data = await response.json();
        setCatalogData(data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchDataFromDB();
  }, []);

  const formatDate = (originalDate) => {
    const dateObject = new Date(originalDate);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <table className='catalogTable'>
      <thead>
        <tr className='catalogTable__tr'>
          <th className='catalogTable__th'>Дата роботи</th>
          <th className='catalogTable__th'>Документ</th>
          <th className='catalogTable__th'>Адреса</th>
          <th className='catalogTable__th'>ID документа</th>
          <th className='catalogTable__th'>Тип робіт</th>
        </tr>
      </thead>
      <tbody>
        {catalogData.length > 0
          ? catalogData.map((row, index) => (
            <tr key={index} className='catalogTable__tr'>
              <td className='catalogTable__td'>{formatDate(row.date_work)}</td>
              <td className='catalogTable__td'>{row.is_doc ? '+' : '-'}</td>
              <td className='catalogTable__td'>{row.address}</td>
              <td className='catalogTable__td'>{row.id_doc ? row.id_doc : 'Не документ'}</td>
              <td className='catalogTable__td'>{row.type_work}</td>
            </tr>
          ))
          : <span className='catalogTable__user' >Користувач не залогінений</span>}
      </tbody>
    </table>
  );
};

export default CatalogTable;
