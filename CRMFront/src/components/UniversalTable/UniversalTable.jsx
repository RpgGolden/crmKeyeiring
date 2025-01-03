import React, { useContext, useEffect, useState } from "react";
import styles from "./UniversalTable.module.scss";
import DataContext from "../../context";



function UniversalTable(props) {
  const context = useContext(DataContext);
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [tableBodyData, setTableBodyData] = useState([]);

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
      case "В работе":
        return "#C5E384"
      case "Создан":
        return "#d69a81"
      case "Одобрен":
        return "#d6e384"
      case "Отклонен":
        return "#d69a81"
      case "Выполнен":
        return "#d6e384"
      default:
        return "inherit"
    }
  }

  const getValue = (value, key, rowIndex) => {
    switch (key) {
      case "status":
        return <div className={styles.status} style={{backgroundColor: getColorStatus(value)}} >{value || "___"}</div>
      case "number":
        return rowIndex + 1 || "___";     
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
                {getValue(row[header.key], header.key, rowIndex)}
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
