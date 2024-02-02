import React, { useState, useEffect } from 'react';
import './styles.scss';
import CustomSVG from '../../img/delete_icon';

import { deleteRecordsByUuid } from '../../api/deleteRecordByUuid';
import { updateRecordByUuid } from '../../api/updateRecordByUuid';

import { BeatLoader } from 'react-spinners';
import DeleteSVG from '../../img/delete_icon';
import CloseSVG from '../../img/CloseSVG';
import CheckSVG from '../../img/CheckSVG';
import AdditionalInfo from './AdditionalInfo';

const CatalogTable = ({ user }) => {
  const [catalogData, setCatalogData] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    field: null,
    ascending: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [options, setOptions] = useState([]);
  const [elementsCatalog, setElementsCataog] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);

  useEffect(() => {
    fetchDataFromDB();
    fetchOptions();
  }, [user]);

  const fetchDataFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/catalog/work_table?pers_work=${user}`);
      const data = await response.json();
      setCatalogData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_work");
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

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

  const handleDoubleClick = (row) => {
    if (!editingRow || editingRow === row.uuid) {
      setEditingRow(row.uuid);
      setEditedData({ ...row });
    } else {
      setEditingRow(row.uuid);
      setEditedData({ ...row });
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleUpdate = async () => {
    try {
      await updateRecordByUuid(editedData.uuid, editedData);
      setEditingRow(null);
      setEditedData({});
      fetchDataFromDB();
    } catch (error) {
      console.error('Error updating data', error);
    }
  };


  const handleRowClick = async (row) => {
    try {
      const response = await fetch(`http://localhost:3001/catalog/elements?uuid=${row.uuid}`);
      const data = await response.json();
      console.log(data);
      setElementsCataog(data);
      setClickedRow(row);
    } catch (error) {
      console.error('Error updating data', error);
    }
  }

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
          className='catalogTable__search'
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
              <React.Fragment key={index}>
                <tr
                  key={index}
                  className={`catalogTable__tr ${editingRow === row.uuid ? 'editing' : ''} ${clickedRow && clickedRow.uuid === row.uuid ? 'clicked' : ''}`}
                  onDoubleClick={() => handleDoubleClick(row)}
                  onClick={() => handleRowClick(row)}
                >
                  <td className='catalogTable__td'>{editingRow === row.uuid ? (
                    <input
                      type="text"
                      className='catalogTable__input'
                      value={formatDate(editedData.date_work)}
                      onChange={(e) => setEditedData({ ...editedData, date_work: e.target.value })}
                    />
                  ) : formatDate(row.date_work)}</td>
                  <td className='catalogTable__td'>{row.is_doc ? '+' : '-'}</td>
                  <td className='catalogTable__td'>{editingRow === row.uuid ? (
                    <input
                      type="text"
                      value={editedData.address}
                      className='catalogTable__input'
                      onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                    />
                  ) : row.address}</td>
                  <td className='catalogTable__td'>{row.id_doc ? row.id_doc : 'Не документ'}</td>
                  <td className='catalogTable__td'>{editingRow === row.uuid ? (
                    <select
                      className="catalogTable__select"
                      name="type_work"
                      onChange={(e) => setEditedData({ ...editedData, type_work: e.target.value })}
                      value={editedData.type_work || ''}
                      style={{ cursor: 'pointer' }}
                    >
                      {options.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="catalogTable__option"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : row.type_work}</td>
                  <td className='catalogTable__td catalogTable__td-edit'>
                    {editingRow === row.uuid ? (
                      <>
                        <CheckSVG onClick={() => handleUpdate()}></CheckSVG>
                        <CloseSVG onClick={() => handleCancelEdit()}></CloseSVG>
                      </>
                    ) : (
                      <>
                        <DeleteSVG onClick={() => deleteRecordsByUuid(row.uuid)} />
                      </>
                    )}
                  </td>
                </tr>
                {clickedRow && clickedRow.uuid === row.uuid && (
                  <tr>
                    <td colSpan="6">
                      <AdditionalInfo dataList={elementsCatalog} formatDate={formatDate} />
                    </td>
                  </tr>
                )}
              </React.Fragment>

            ))
          ) : (
            <span className='catalogTable__user'>{user.length > 0 ? 'Нічого не знайдено' : "Користувач не залогінений"}</span>
          )}
        </tbody>
      </table>
      {loading && (
        <div className={`loader-overlay ${loading ? 'show' : ''}`}>
          <BeatLoader color="#36d7b7" loading={true} size={50} />
        </div>
      )}
    </div>
  );
};

export default CatalogTable;
