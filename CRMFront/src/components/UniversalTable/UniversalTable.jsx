import React, { useContext, useEffect, useState } from "react";
import styles from "./UniversalTable.module.scss";
import DataContext from "../../context";
import { UpdateStatus } from "../../API/ApiReguest";



function UniversalTable(props) {
  const context = useContext(DataContext);
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [tableBodyData, setTableBodyData] = useState([]);
  const [clickIdStatus, setClickIdStatus] = useState(null);
  useEffect(() => {
    console.log("context?.searchTableText", context?.searchTableText)
  }, [context?.searchTableText]);
 
  useEffect(() => {
    setTableHeaderData(props?.tableHeader);
    setTableBodyData(props?.tableBody);
    console.log("context?.selectedRows", context?.selectedRows)
  }, [props?.tableHeader, props?.tableBody]);

  const getColorStatus = (value) => {
    switch (value) {
      case "Отменен": // Красный для отмены
        return "#F28B82"; // Мягкий красный
      case "Создан": // Нейтральный, теплый оттенок
        return "#FFD57E"; // Песочный желто-оранжевый
      case "Одобрен": // Зеленый для подтверждения
        return "#81C995"; // Мягкий зеленый
      case "Отклонен": // Темно-красный для отказа
        return "#F47373"; // Немного темнее "Отменен"
      case "Выполнен": // Голубой для завершенного
        return "#A7C7E7"; // Нежный голубой
      default: // Нейтральный цвет
        return "inherit";
    }
  };
  

  const status = {
    pending: "Создан",
    approved: "Одобрен",
    declined: "Отклонен",
    completed: "Выполнен",
    canceled: "Отменен",
  };
  const  clickStatusEl = (value) => {
    const data = {
      id: clickIdStatus,
      status: value
    }
    UpdateStatus(data).then(res => {
      if (res?.status === 200) {
        context?.getTableData(context?.activeTable)
      }
    })
    setClickIdStatus(null)
  }

  const getNormalDate = (date) => {
    if (date) {
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return "___";
}

  const getValue = (value, key, rowIndex, rowId) => {
    switch (key) {
      case "status":
        return <div className={styles.CheckListContainer}>
                <div className={styles.status} style={{backgroundColor: getColorStatus(value)}} onClick={() => setClickIdStatus(rowId)}>{value || "___"}</div>
                {
                  clickIdStatus === rowId &&
                   <ul className={styles.statusList}>
                     <li onClick={() => clickStatusEl('pending')}>Создан</li>
                     <li onClick={() => clickStatusEl('approved')}>Одобрен</li>
                     <li onClick={() => clickStatusEl('declined')}>Отклонен</li>
                     <li onClick={() => clickStatusEl('completed')}>Выполнен</li>
                     <li onClick={() => clickStatusEl('canceled')}>Отменен</li>
                   </ul>
                }
              </div>
      case "number":
        return rowIndex + 1 || "___";     
      case "lastOrderDate":
        return getNormalDate(value)
      default:
        return value || "___";
    }
  };

  const trClick = (row) => {
    console.log("row", row)
    context.setSelectedRows(row.id)
  }


 
  return (
    <div
      className={styles.UniversalTable}>
      <table>
        <thead>
          {tableHeaderData?.map((el, index) => (
            <th
              key={index}
              name={el.key}>
              {el.value}
             </th>
          ))}
        </thead>
        <tbody>
          {tableBodyData?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => trClick(row)}
              className={context?.selectedRows === row?.id && styles.setectedTr}
            >
              {tableHeaderData.map((header) => (
                <td
                  key={header.key}
                  name={header.key}
                  className={header.key}
                >
                {getValue(row[header.key], header.key, rowIndex, row.id)}
                </td>
              ))}
            </tr>
          ))}
          {tableBodyData.length === 0 && (
            <tr>
              <td
                colSpan={tableHeaderData.length}
                className={styles.tableNotData}
              >
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UniversalTable;
