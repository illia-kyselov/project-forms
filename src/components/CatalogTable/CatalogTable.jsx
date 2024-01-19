import React, { useState, useEffect } from 'react';
import './styles.scss';

const CatalogTable = ({ user }) => {
  const [catalogData, setCatalogData] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    field: null,
    ascending: true,
  });

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
  }, [user]);

  const formatDate = (originalDate) => {
    const dateObject = new Date(originalDate);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleSort = (field) => {
    setSortOrder({
      field,
      ascending: sortOrder.field === field ? !sortOrder.ascending : true,
    });
  };

  const sortedData = catalogData.slice().sort((a, b) => {
    const aValue = sortOrder.field ? a[sortOrder.field] : null;
    const bValue = sortOrder.field ? b[sortOrder.field] : null;

    if (aValue === bValue) {
      return 0;
    }

    if (sortOrder.ascending) {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  return (
    <table className='catalogTable'>
      <thead>
        <tr className='catalogTable__tr'>
          <th className='catalogTable__th' onClick={() => handleSort('date_work')}>
            Дата роботи
          </th>
          <th className='catalogTable__th' onClick={() => handleSort('is_doc')}>
            Документ
          </th>
          <th className='catalogTable__th' onClick={() => handleSort('address')}>
            Адреса
          </th>
          <th className='catalogTable__th' onClick={() => handleSort('id_doc')}>
            ID документа
          </th>
          <th className='catalogTable__th' onClick={() => handleSort('type_work')}>
            Тип робіт
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.length > 0 ? (
          sortedData.map((row, index) => (
            <tr key={index} className='catalogTable__tr'>
              <td className='catalogTable__td'>{formatDate(row.date_work)}</td>
              <td className='catalogTable__td'>{row.is_doc ? '+' : '-'}</td>
              <td className='catalogTable__td'>{row.address}</td>
              <td className='catalogTable__td'>{row.id_doc ? row.id_doc : 'Не документ'}</td>
              <td className='catalogTable__td'>{row.type_work}</td>
            </tr>
          ))
        ) : (
          <span className='catalogTable__user'>Користувач не залогінений</span>
        )}
      </tbody>
    </table>
  );
};

export default CatalogTable;
