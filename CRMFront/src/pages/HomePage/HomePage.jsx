import { useContext, useEffect, useState } from "react";
import DataContext from "../../context";
import HomePageTopMenu from "../../ui/HomePageTopMenu/HomePageTopMenu";
import styles from "./HomePage.module.scss";
import UniversalTable from "../../components/UniversalTable/UniversalTable";
import Layout from "../../ui/Layout/Layout";
import Footer from "../../components/Footer/Footer";
import { generateAndDownloadExcel } from "../../function";
import ServiseModule from "../../modules/ServiseModule/ServiseModule";
import TableTopAplication from "../../components/TableTopAplication/TableTopAplication";
import PopUpEditAplication from "../../components/PopUp/PopUpEditAplication/PopUpEditAplication";
import PopUpError from "../../components/PopUp/PopUpError/PopUpError";

function HomePage() {
  const context = useContext(DataContext);
  const [filterStatus, setFilterStatus] = useState("all"); // Состояние фильтра

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

  return (
    <div className={styles.HomePageContainer}>
      <header>
        <div className={styles.HomePageHeaderPc}>
          <HomePageTopMenu />
        </div> 
      </header>
      <Layout>
        {context.activeTable === "applications" && (
          <TableTopAplication filteredData={filteredData} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
        )}
        <main>
          <section className={styles.HomePageTableSectionPc}>
            <div className={styles.HomePageTable}>
              {
                context.activeTable === "Services" ? (
                  <ServiseModule/>
                ) : context.activeTable === "applications" ?(
                  <UniversalTable
                  tableBody={filteredData} // Передаем отфильтрованные данные
                  tableHeader={context?.tableHeader}
                  clicker={true}
                />) : context.activeTable === "Clients" ?(
                  <div className={styles.ClientsTable}>
                    <UniversalTable
                    tableBody={context?.dataTable}
                    tableHeader={context?.tableHeader}
                    clicker={false}
                    />
                  </div>
                ) : context.activeTable === "Users" ?(
                  <div className={styles.ClientsTable}>
                    <UniversalTable
                    tableBody={context?.dataTable}
                    tableHeader={context?.tableHeader}
                    clicker={false}
                    />
                  </div>
                ):
                (
                  <div className={styles.developPage}>
                    <img src="/img/work.png" />
                  </div>
                )
              }
            </div>
          </section>
        </main>
      </Layout>
      <Footer />
      {context.vizibleePopUp == "PopUpEditAplication" && <PopUpEditAplication/>}
      {context.vizibleePopUp == "PopUpError" && <PopUpError/>}

      
    </div>
  );
}

export default HomePage;
