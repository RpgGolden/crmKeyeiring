import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import HomePage from "./pages/HomePage/HomePage";
import DataContext from "./context";
import "./styles/app.css";
import Registration from "./pages/entrance/Registration/Registration";
import Authorization from "./pages/entrance/Authorization/Authorization";
import { apiGetUsers } from "./API/ApiRequest";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile/Profile";
function App() {
  const user = useSelector((state) => state.BasicSlice.user);
  const context = {
    valueBasic: "Home Page",
  };

  console.log("user", user);

  return (
    <DataContext.Provider value={context}>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route
              path="/authorization"
              element={<Authorization funUpdUser={null} />}
            ></Route>
            <Route
              path="/registration"
              element={<Registration funUpdUser={null} />}
            ></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
        </main>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
