import { useContext, useEffect, useState } from "react";
import DataContext from "../../context";
import HomePageTopMenu from "../../ui/HomePageTopMenu/HomePageTopMenu";
import styles from "./HomePage.module.scss";
import UniversalTable from "../../components/UniversalTable/UniversalTable";
import Layout from "../../ui/Layout/Layout";
import Footer from "../../components/Footer/Footer";
import { generateAndDownloadExcel } from "../../function";

function HomePage() {
  const context = useContext(DataContext);
  const [filterStatus, setFilterStatus] = useState("all"); // Состояние фильтра
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Состояние для открытия списка

  console.log("context", context);

  useEffect(() => {
    context.getTableData("applications");
  }, []);

  // Функция фильтрации данных в зависимости от выбранного фильтра
  const filteredData = context.dataTable?.filter((item) => {
    switch (filterStatus) {
      case "all":
        return true; // Показать все записи
      case "active":
        return (
          item.status !== "Отклонен" &&
          item.status !== "Выполнен" &&
          item.status !== "Отменен"
        ); // Актуальные
      case "canceled":
        return item.status != "Создан" && item.status != "Одобрен"; // Отмененные
      default:
        return true;
    }
  });   

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleStatusChange = (status) => {
    setFilterStatus(status); // Обновляем фильтр
    setDropdownOpen(false); // Закрываем выпадающий список
  };

  return (
    <div className={styles.HomePageContainer}>
      <header>
        <div className={styles.HomePageHeaderPc}>
          <HomePageTopMenu />
        </div>
      </header>
      <Layout>
        {context.activeTable === "applications" && (
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
                  {filterStatus === "all"
                    ? "Все"
                    : filterStatus === "active"
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
                  generateAndDownloadExcel(filteredData, "Заявки")
                }
              >
                Экспорт
              </button>
            </div>
          </div>
        )}

        <main>
          <section className={styles.HomePageTableSectionPc}>
            <div className={styles.HomePageTable}>
              {context.activeTable !== "applications" ? (
                <div className={styles.developPage}>
                  <img src="/img/work.png" />
                </div>
              ) : (
                <UniversalTable
                  tableBody={filteredData} // Передаем отфильтрованные данные
                  tableHeader={context.tableHeader}
                />
              )}
            </div>
          </section>
        </main>
      </Layout>
      <Footer />
    </div>
  );
}

export default HomePage;
