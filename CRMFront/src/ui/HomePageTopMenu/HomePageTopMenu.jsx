import { useContext, useEffect, useRef, useState } from "react";
import styles from "./HomePageTopMenu.module.scss";
import DataContext from "../../context";
import { LogOut } from "../../API/ApiReguest";

function HomePageTopMenu() {
    const context = useContext(DataContext);
    const clickLi = (value) => {
        context.setSelectedRows([])
        context.setActiveTable(value)
        context.getTableData(value)
    }
    const [contaainerVizible, setcontaainerVizible] = useState(false)

    const getRole = (value) =>{
        switch (value) {
            case "ADMINISTRATOR":
                return "Администратор"
            case "COOK":
                return "Повар"
        }
    }
    const LogFunc = () => {
      LogOut().then((res) => {
        if (res?.status === 200) {
          window.location.href = `/`;
        }
      })
    }

    const refUserMenu = useRef(null);
    const handleClickOutside = (event) => {
      if (refUserMenu.current && !refUserMenu.current.contains(event.target)) {
        setcontaainerVizible(false);
      }
    };
    
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return ( 
        <div className={styles.HomePageTopMenu}>
            <div className={styles.Logo}>
                <img src="/img/logo.svg"/> 
            </div>
            <ul>
                <li onClick={() => clickLi("applications")} style={{borderBottom: context?.activeTable === "applications" &&  "1px solid #007AA1" }}>Мои Заявки</li>
                <li onClick={() => clickLi("Services")} style={{borderBottom: context?.activeTable === "Services" &&  "1px solid #007AA1" }}>Услуги</li>
                <li onClick={() => clickLi("Clients")} style={{borderBottom: context?.activeTable === "Clients" &&  "1px solid #007AA1" }}>Клиенты</li>
                <li onClick={() => clickLi("Staff")} style={{borderBottom: context?.activeTable === "Staff" &&  "1px solid #007AA1" }}>Сотрудники</li>
                <li onClick={() => clickLi("Analytics")} style={{borderBottom: context?.activeTable === "Analytics" && "1px solid #007AA1" }}>Аналитика</li>
            </ul>
            <div className={styles.User}>
              <p className={styles.userName} onClick={() => setcontaainerVizible(!contaainerVizible)}>{JSON.parse(sessionStorage.getItem("userData"))?.surname} {JSON.parse(sessionStorage.getItem("userData"))?.name}</p>
              { contaainerVizible &&
                <div className={styles.userDataContainer} ref={refUserMenu}>
                    <p>Роль: {getRole(JSON.parse(sessionStorage.getItem("userData"))?.role)}</p>
                    <div className={styles.exit}>
                        <button onClick={() => LogFunc()}>Выход</button>
                    </div>
                </div>
              }
            </div>
        </div>
     );
}

export default HomePageTopMenu;