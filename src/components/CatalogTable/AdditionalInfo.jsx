import React, { useState } from 'react';
import markerImage from '../../img';
import ArrowDown from '../../img/ArrowDown';

const AdditionalInfo = ({ dataList = [], formatDate }) => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);
  const [arrowDownClick, setArrowDownClick] = useState(false);

  const handleRowClick = (expldz_uuid, index) => () => {
    const selectedData = dataList.find((data) => data.expldz_uuid === expldz_uuid);
    setSelectedRowData(selectedData);
    setClickedRow(index);
    setArrowDownClick(false);
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

  const handleArrowClick = () => {
    setArrowDownClick((prevArrowDownClick) => !prevArrowDownClick);
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
            const { num_dz, dz_form, expldz_uuid, expldzdate } = data;
            const imagePath = markerImage[num_dz];
            const rowClassName = clickedRow === index ? 'clicked' : '';
            const isCurrentRowClicked = clickedRow === index;

            return (
              <React.Fragment key={index}>
                <tr className={`catalogTable__tr ${rowClassName}`}>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{imagePath && <img src={imagePath} alt={`photoDz-${index}`} style={{ width: '30px' }} />}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{num_dz}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{dz_form}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{formatDate(expldzdate)}</td>
                  <td className='catalogTable__td'>{isCurrentRowClicked && <ArrowDown onClick={handleArrowClick} />}</td>
                </tr>

                {selectedRowData && selectedRowData.expldz_uuid === expldz_uuid && !arrowDownClick && (
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
                        <tbody>
                          {filteredElementData.map((element, elementIndex) => (
                            <tr key={elementIndex} className='catalogTable__tr' >
                              <td className='catalogTable__td'>{element.name_elmns}</td>
                              <td className='catalogTable__td'>{element.cnt_elmnt}</td>
                              <td className='catalogTable__td'>{formatDate(element.elementdate)}</td>
                            </tr>
                          ))}
                        </tbody>
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
    </div >
  );
};

export default AdditionalInfo;
