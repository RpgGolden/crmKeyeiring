import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "./pages/HomePage/HomePage";
import DataContext from "./context";
import Authorization from "./pages/Auth/Authorization";
import "./styles/app.css";
function App() {
  const [unauthorized, setUnauthorized] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTable, setActiveTable] = useState("applications");

  const getTableData = (value) => {
    console.log("value", value)
  }

  const context = {
    setUnauthorized,
    unauthorized,
    selectedRows,
    setSelectedRows,
    activeTable,
    setActiveTable,
    getTableData
  }

  return (
    <DataContext.Provider value={context}>
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Authorization />}></Route>
          <Route path="/HomePage" element={<HomePage />}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  </DataContext.Provider>
  );
}

export default App;
