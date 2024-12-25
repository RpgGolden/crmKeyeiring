import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import DataContext from "./context";
import Authorization from "./pages/Auth/Authorization";
import "./styles/app.css";
import { GetOrders } from "./API/ApiReguest";
import { tableHeadAppoint } from "./components/UniversalTable/HeaderTable";
import { funFixDataTable } from "./function";

function App() {
  const [unauthorized, setUnauthorized] = useState(true);
  const [selectedRows, setSelectedRows] = useState(null);
  const [activeTable, setActiveTable] = useState("applications");
  const [dataTable, setDataTable] = useState([]);
  const [filteredDataTable, setFilteredDataTable] = useState([]); // Для хранения отфильтрованных данных
  const [tableHeader, setTableHeader] = useState([]);
  const [searchTableText, setSearchTableText] = useState("");

  // Получение данных для таблицы
  const getTableData = (value) => {
    switch (value) {
      case "applications":
        GetOrders().then((res) => {
          if (res?.status === 200) {
            const fixedData = funFixDataTable(res?.data);
            setDataTable(fixedData);
            setFilteredDataTable(fixedData); // Изначально отфильтрованные данные равны всем данным
            setTableHeader(tableHeadAppoint);
          }
        });
        break;
      case "Staff":
        break;
      case "Services":
        break;
      case "Analytics":
        break;
      default:
        break;
    }
  };

  // Фильтрация данных таблицы
  useEffect(() => {
    if (searchTableText.trim() === "") {
      setFilteredDataTable(dataTable); // Если текст пустой, отображаем все данные
    } else {
      const filteredData = dataTable.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTableText.toLowerCase())
        )
      );
      setFilteredDataTable(filteredData);
    }
  }, [searchTableText, dataTable]);

  const context = {
    setUnauthorized,
    unauthorized,
    selectedRows,
    setSelectedRows,
    activeTable,
    setActiveTable,
    getTableData,
    dataTable: filteredDataTable, // Передаем отфильтрованные данные
    setDataTable,
    tableHeader,
    setTableHeader,
    searchTableText,
    setSearchTableText,
  };

  return (
    <DataContext.Provider value={context}>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Authorization />} />
            <Route path="/HomePage" element={<HomePage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
