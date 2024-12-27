import { useContext, useEffect, useState } from "react";
import styles from "./TableTopAplication.module.scss";
import DataContext from "../../context";
import { generateAndDownloadExcel } from "../../function";


function TableTopAplication(props) {
    const context = useContext(DataContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false); // Состояние для открытия списка

    useEffect(() => {
        context.getTableData("applications");
      }, []);
    
    
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    
    const handleStatusChange = (status) => {
      props.setFilterStatus(status); // Обновляем фильтр
      setDropdownOpen(false); // Закрываем выпадающий список
    };

    return ( 
          <div className={styles.ButtonInnerContainer}>
            <div className={styles.FilterContainer}>
              <input
                placeholder="Поиск"
                onChange={(e) => context.setSearchTableText(e.target.value)}
              />
              {/* Кастомный выпадающий список */}
              <div className={styles.CustomDropdown}>
                <div
                  className={styles.SelectedOption}
                  onClick={toggleDropdown}
                >
                  {props.filterStatus === "all"
                    ? "Все"
                    : props.filterStatus === "active"
                    ? "Актуальные"
                    : "История"}
                  <span className={styles.Arrow}>
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className={styles.DropdownList}>
                    <div
                      className={styles.DropdownItem}
                      onClick={() => handleStatusChange("all")}
                    >
                      Все
                    </div>
                    <div
                      className={styles.DropdownItem}
                      onClick={() => handleStatusChange("active")}
                    >
                      Актуальные
                    </div>
                    <div
                      className={styles.DropdownItem}
                      onClick={() => handleStatusChange("canceled")}
                    >
                      История
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.ButtonInner}>
              <button>Редактировать</button>
              <button>Удалить</button>
              <button
                onClick={() =>
                  generateAndDownloadExcel(props.filteredData, "Заявки")
                }
              >
                Экспорт
              </button>
            </div>
          </div>
     );
}

export default TableTopAplication