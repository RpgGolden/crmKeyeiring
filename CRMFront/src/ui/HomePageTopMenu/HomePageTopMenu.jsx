import { useContext } from "react";
import styles from "./HomePageTopMenu.module.scss";
import DataContext from "../../context";

function HomePageTopMenu() {
    const context = useContext(DataContext);
    const clickLi = (value) => {
        context.setSelectedRows([])
        context.setActiveTable(value)
        context.getTableData(value)
    }
    return ( 
        <div className={styles.HomePageTopMenu}>
            <ul>
                <li onClick={() => clickLi("applications")} style={{borderBottom: context?.activeTable === "applications" &&  "1px solid #007AA1" }}>Мои Заявки</li>
                <li onClick={() => clickLi("Staff")} style={{borderBottom: context?.activeTable === "Staff" &&  "1px solid #007AA1" }}>Сотрудники</li>
                <li onClick={() => clickLi("Services")} style={{borderBottom: context?.activeTable === "Services" &&  "1px solid #007AA1" }}>Услуги</li>
                <li onClick={() => clickLi("Analytics")} style={{borderBottom: context?.activeTable === "Analytics" && "1px solid #007AA1" }}>Аналитика</li>
            </ul>
        </div>
     );
}

export default HomePageTopMenu;