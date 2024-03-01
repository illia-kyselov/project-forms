import React, { useState } from 'react';
import markerImage from '../../img';
import ArrowDown from '../../img/ArrowDown';
import ArrowUp from '../../img/ArrowUp';
import ModalMessage from '../ModalMessage/ModalMessage';
import { deleteElementCatalog } from '../../api/deleteElementCatalog';

const AdditionalInfo = ({ dataList = [], formatDate, handleDzDelete, handleElementDelete }) => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);

  const [arrowDownActiveInfo, setArrowDownActiveInfo] = useState(false);
  const [arrowUpActiveInfo, setArrowUpActiveInfo] = useState(true);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationData, setDeleteConfirmationData] = useState(null);


  const handleRowClick = (expldz_uuid, index) => () => {
    const selectedData = dataList.find((data) => data.expldz_uuid === expldz_uuid);
    setSelectedRowData(selectedData);
    setClickedRow(index);
    setArrowDownActiveInfo(false);
    setArrowUpActiveInfo(true);
  };

  const uniqueDataList = dataList.filter((data, index, self) =>
    index === self.findIndex((d) =>
      d.work_uuid === data.work_uuid &&
      d.element_uuid === data.element_uuid &&
      d.expldz_uuid === data.expldz_uuid
    )
  );

  const filteredElementData = dataList.filter(data =>
    data.work_uuid === (selectedRowData && selectedRowData.work_uuid) &&
    data.element_uuid === (selectedRowData && selectedRowData.element_uuid)
  );

  const handleArrowUpClick = () => {
    setArrowUpActiveInfo(false);
    setArrowDownActiveInfo(true);
  };

  const handleArrowDownClick = () => {
    setArrowDownActiveInfo(false);
    setArrowUpActiveInfo(true);
  };

  const handleDeleteConfirmation = async () => {
    if (deleteConfirmationData) {
      await handleDzDelete(
        deleteConfirmationData.element_uuid,
        deleteConfirmationData.length,
        deleteConfirmationData.work_uuid
      );
      setShowDeleteConfirmation(false);
      setDeleteConfirmationData(null);
    }
  };


  return (
    <div>
      <table className='catalogTable catalogTable_Additional'>
        <thead>
          <tr className='catalogTable__tr'>
            <th className='catalogTable__th'>Умовний знак</th>
            <th className='catalogTable__th'>Номер знаку</th>
            <th className='catalogTable__th'>Форма знаку</th>
            <th className='catalogTable__th'>Дата створення</th>
            <th className='catalogTable__th'></th>
          </tr>
        </thead>
        <tbody>
          {uniqueDataList.map((data, index) => {
            console.log('uniqueDataList', uniqueDataList)
            const { num_dz, dz_form, expldz_uuid, expldzdate } = data;
            const imagePath = markerImage[num_dz];
            const rowClassName = clickedRow === index ? 'clicked' : '';
            return (
              <React.Fragment key={index}>
                <tr className={`catalogTable__tr ${rowClassName}`}>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{imagePath && <img src={imagePath} alt={`photoDz-${index}`} style={{ width: '30px' }} />}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{num_dz}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{dz_form}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{formatDate(expldzdate)}</td>
                  <td className='catalogTable__td'>
                    {<ArrowDown onClick={handleArrowDownClick} arrowDownActiveInfo={arrowDownActiveInfo} />}
                    {<ArrowUp onClick={handleArrowUpClick} arrowUpActiveInfo={arrowUpActiveInfo} />}
                  </td>
                  <td className='catalogTable__td'>
                    {<button
                      className="delete-icon"
                      onClick={() => {
                        setDeleteConfirmationData({
                          element_uuid: data.element_uuid,
                          length: uniqueDataList.length,
                          work_uuid: data.work_uuid
                        });
                        setShowDeleteConfirmation(true);
                      }}
                    >
                      X
                    </button>}
                  </td>
                </tr>
                {
                  selectedRowData && selectedRowData.expldz_uuid === expldz_uuid && arrowUpActiveInfo && (
                    <tr>
                      <td colSpan="4">
                        <table className='catalogTable catalogTable_Additional' >
                          <thead>
                            <tr className='catalogTable__tr'>
                              <th className='catalogTable__th'>Назва елементу</th>
                              <th className='catalogTable__th'>Кількість елементів</th>
                              <th className='catalogTable__th'>Дата додавання</th>
                            </tr>
                          </thead>
                          {filteredElementData.length !== 0 && filteredElementData.some(element => element.element_uuid !== null) ? (
                            <tbody>
                              {filteredElementData
                                .filter(element => element.element_uuid !== null)
                                .map((element, elementIndex) => (
                                  <tr key={elementIndex} className='catalogTable__tr'>
                                    <td className='catalogTable__td'>{element.name_elmns}</td>
                                    <td className='catalogTable__td'>{element.cnt_elmnt}</td>
                                    <td className='catalogTable__td'>{formatDate(element.elementdate)}</td>
                                    <td className='catalogTable__td'>
                                      <button
                                        className="delete-icon"
                                        onClick={() => { handleElementDelete(element.element_uuid) }}
                                      >
                                        X
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan="4" className='catalogTable__user'>
                                  {'Елементів не знайдено!'}
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </table>
                      </td>
                    </tr>
                  )
                }
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <ModalMessage
        title={uniqueDataList.length === 1 ? "Ви впевнені що хочете видалити запис?" : "Ви впевнені що хочете видалити цей ДЗ та елементи до нього?"}
        butonText="Видалити запис"
        isOpen={showDeleteConfirmation}
        onConfirm={handleDeleteConfirmation}
        onReject={() => {
          setShowDeleteConfirmation(false);
          setDeleteConfirmationData(null);
        }}
      />
    </div >
  );
};

export default AdditionalInfo;
