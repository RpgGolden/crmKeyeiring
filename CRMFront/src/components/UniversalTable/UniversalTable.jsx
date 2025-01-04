import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./UniversalTable.module.scss";
import DataContext from "../../context";
import { UpdateStatus } from "../../API/ApiReguest";
import { useNavigate } from "react-router-dom";

function UniversalTable(props) {
  const context = useContext(DataContext);
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [tableBodyData, setTableBodyData] = useState([]);
  const [clickIdStatus, setClickIdStatus] = useState(null);
  const tableRef = useRef(null); // Реф для таблицы
  const statusRef = useRef(null); // Реф для статуса

  useEffect(() => {
    setTableHeaderData(props?.tableHeader);
    setTableBodyData(props?.tableBody);
  }, [props?.tableHeader, props?.tableBody]);

  const getColorStatus = (value) => {
    switch (value) {
      case "Отменен":
        return "#F28B82";
      case "Создан":
        return "#FFD57E";
      case "Одобрен":
        return "#81C995";
      case "Отклонен":
        return "#F47373";
      case "Выполнен":
        return "#A7C7E7";
      default:
        return "inherit";
    }
  };

  const clickStatusEl = (value) => {
      const data = {
        id: clickIdStatus,
        status: value,
      };
      UpdateStatus(data).then((res) => {
        if (res?.status === 200) {
          context?.getTableData(context?.activeTable);
        }
      });
      setClickIdStatus(null);
  };

  const getNormalDate = (date) => {
    if (date) {
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return "___";
  };

  const navigate = useNavigate();
  const goClientInfo = (id) => {
    if (id) {
      navigate(`/InfoClient?IdClient=${id}`);
    }
  };

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target) && event.target.tagName !== "BUTTON") {
      context.setSelectedRows(null); // Сбрасываем выбранную строку
    }
    if(statusRef.current && !statusRef.current.contains(event.target) ){
      setClickIdStatus(null)
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const ClickStatusButton = (value, id) => {
    if(value === "Отменен" || value === "Выполнен" || value === "Отклонен"){
      context.setVizibleePopUp("PopUpError")
      context.setTextPopUp("Данный статус уже нельзя изменить!")
      return
    }else{
      setClickIdStatus(id)
    }
  }

  const getValue = (value, key, rowIndex, rowId, row) => {
    switch (key) {
      case "status":
        return (
          <div className={styles.CheckListContainer}>
            <div
              className={styles.status}
              style={{ backgroundColor: getColorStatus(value) }}
              onClick={() => ClickStatusButton(value, rowId)}
            >
              {value || "___"}
            </div>
            {clickIdStatus === rowId && (
              <ul className={styles.statusList} ref={statusRef}>
                <li onClick={() => clickStatusEl("pending")}>Создан</li>
                <li onClick={() => clickStatusEl("approved")}>Одобрен</li>
                <li onClick={() => clickStatusEl("declined")}>Отклонен</li>
                <li onClick={() => clickStatusEl("completed")}>Выполнен</li>
                <li onClick={() => clickStatusEl("canceled")}>Отменен</li>
              </ul>
            )}
          </div>
        );
      case "number":
        return rowIndex + 1 || "___";
      case "lastOrderDate":
        return getNormalDate(value);
      case "info":
        return (
          <div className={styles.infoContainer}>
            <button
              className={styles.info}
              onClick={() => goClientInfo(row?.id)}
            >
              Подробная информация
            </button>
          </div>
        );
      default:
        return value || "___";
    }
  };

  const trClick = (row) => {
    context.setSelectedRows(row.id);
  };

  return (
    <div ref={tableRef} className={styles.UniversalTable}>
      <table>
        <thead>
          {tableHeaderData?.map((el, index) => (
            <th key={index} name={el.key}>
              {el.value}
            </th>
          ))}
        </thead>
        <tbody>
          {tableBodyData?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => props?.clicker && trClick(row)}
              className={
                context?.selectedRows === row?.id ? styles.setectedTr : ""
              }
            >
              {tableHeaderData.map((header) => (
                <td key={header.key} name={header.key} className={header.key}>
                  {getValue(row[header.key], header.key, rowIndex, row.id, row)}
                </td>
              ))}
            </tr>
          ))}
          {tableBodyData.length === 0 && (
            <tr>
              <td colSpan={10} className={styles.tableNotData}>
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
