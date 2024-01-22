import React, { useState, useEffect } from 'react';
import './styles.scss';
import CustomSVG from '../../img/delete_icon';
import { deleteRecordsByUuid } from '../../helpers/deleteRecordByUuid';

const CatalogTable = ({ user }) => {
  const [catalogData, setCatalogData] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    field: null,
    ascending: true,
  });
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredData = catalogData.filter((row) => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    return Object.entries(row).some(([key, value]) => {
      const lowerCaseValue = value ? value.toString().toLowerCase() : '';

      switch (key) {
        case 'date_work':
          if (!isNaN(new Date(value).getTime())) {
            const formattedDate = formatDate(value);
            return formattedDate.includes(lowerCaseQuery);
          }
          break;

        case 'is_doc':
          return lowerCaseQuery === '' || (lowerCaseQuery === '+' && value) || (lowerCaseQuery === '-' && !value);

        case 'address':
          return lowerCaseValue.includes(lowerCaseQuery) || lowerCaseQuery === '';

        case 'type_work':
          return lowerCaseValue.includes(lowerCaseQuery);

        case 'id_doc':
          return lowerCaseValue.includes(lowerCaseQuery) || lowerCaseQuery === 'не документ';

        default:
          return false;
      }
    });
  });


  const sortedData = filteredData.slice().sort((a, b) => {
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
    <div className='catalogTable__container'>
      <label className='catalogTable__title'>{`Операції користувача `}
        <input
          type="text"
          placeholder="Пошук"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </label>
      <table className='catalogTable'>
        <thead>
          <tr className='catalogTable__tr'>
            <th
              className={`catalogTable__th ${sortOrder.field === 'date_work' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('date_work')}
            >
              Дата роботи
            </th>
            <th
              className={`catalogTable__th ${sortOrder.field === 'is_doc' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('is_doc')}
            >
              Документ
            </th>
            <th
              className={`catalogTable__th ${sortOrder.field === 'address' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('address')}
            >
              Адреса
            </th>
            <th
              className={`catalogTable__th ${sortOrder.field === 'id_doc' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('id_doc')}
            >
              ID документа
            </th>
            <th
              className={`catalogTable__th ${sortOrder.field === 'type_work' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('type_work')}
            >
              Тип робіт
            </th>
            <th className={`catalogTable__th catalogTable__th-delete`}></th>
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
                <td
                  className='catalogTable__td catalogTable__td-delete'
                >
                  {<CustomSVG onClick={() => deleteRecordsByUuid(row.uuid)} />}
                </td>
              </tr>
            ))
          ) : (
            <span className='catalogTable__user'>{user.length > 0 ? 'Нічого не знайдено' : "Користувач не залогінений"}</span>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CatalogTable;
