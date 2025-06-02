import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import DataContext from "./context";
import Authorization from "./pages/Auth/Authorization";
import "./styles/app.css";
import { GetAllUsers, GetOrders, getAllClients, getAllEmployee } from "./API/ApiReguest";
import {
  tableHeadAppoint,
  tableHeadClient,
  tableHeadUsers,
} from "./components/UniversalTable/HeaderTable";
import { funFixDataTable } from "./function";
import InfoClient from "./pages/InfoClient/InfoClient";
import Categories from "./pages/Categories/Categories";
import Dish from "./pages/Dish/Dish";
import Analytics from "./pages/Analytics/Analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const [unauthorized, setUnauthorized] = useState(true);
  const [selectedRows, setSelectedRows] = useState(null);
  const [activeTable, setActiveTable] = useState("applications");
  const [dataTable, setDataTable] = useState([]);
  const [filteredDataTable, setFilteredDataTable] = useState([]); // Для хранения отфильтрованных данных
  const [tableHeader, setTableHeader] = useState([]);
  const [searchTableText, setSearchTableText] = useState("");
  const [vizibleePopUp, setVizibleePopUp] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [textPopUp, setTextPopUp] = useState("");
  // Получение данных для таблицы
  const getTableData = (value) => {
    console.log("я вызываюсь Value", value);
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
      case "Users":
        getAllEmployee().then((res) => {
          if (res?.status === 200) {
            setDataTable(res?.data);
            setFilteredDataTable(res?.data); // Изначально отфильтрованные данные равны всем данным
            setTableHeader(tableHeadUsers);
          }
        });
        break;
      case "Services":
        break;
      case "Analytics":
        break;
      case "Clients":
        getAllClients().then((res) => {
          if (res?.status === 200) {
            setDataTable(res?.data);
            setFilteredDataTable(res?.data); // Изначально отфильтрованные данные равны всем данным
            setTableHeader(tableHeadClient);
          }
        });
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
    vizibleePopUp,
    setVizibleePopUp,
    setSelectedService,
    selectedService,
    textPopUp,
    setTextPopUp,
  };
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <DataContext.Provider value={context}>
        <BrowserRouter>
          <main>
            <Routes>
              <Route path="/" element={<Authorization />} />
              <Route path="/HomePage" element={<HomePage />} />
              <Route path="/InfoClient" element={<InfoClient />} />
              <Route path="/Categories" element={<Categories />} />
              <Route path="/Dish" element={<Dish />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </BrowserRouter>
      </DataContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
