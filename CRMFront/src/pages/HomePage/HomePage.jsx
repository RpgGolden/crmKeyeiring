import { useContext, useEffect } from "react";
import DataContext from "../../context";
import HomePageTopMenu from "../../ui/HomePageTopMenu/HomePageTopMenu";
import styles from "./HomePage.module.scss";
import UniversalTable from "../../components/UniversalTable/UniversalTable";
import Layout from "../../ui/Layout/Layout";
import Footer from "../../components/Footer/Footer";
import { generateAndDownloadExcel } from "../../function";
function HomePage() {
    const context = useContext(DataContext);
    console.log("context", context);

    useEffect(() => {
      context.getTableData("applications")
    }, []);
  

    return ( 
        <div className={styles.HomePageContainer}>
        <header>
          <div className={styles.HomePageHeaderPc}>
            <HomePageTopMenu />
          </div>
        </header>
        <Layout>
        {
            (context.activeTable === "applications") &&
            <div className={styles.ButtonInnerContainer}>
              <div>
                  <input placeholder="Поиск" onChange={(e) => context.setSearchTableText(e.target.value)}/>
              </div>
              <div className={styles.ButtonInner}>
                  <button >Редактировать</button>
                  <button >Удалить</button>
                  <button onClick={() => generateAndDownloadExcel( context.dataTable ,"Заявки")}>Экспорт</button>
              </div>
            </div>
        }
       
        <main>
          <section className={styles.HomePageTableSectionPc}>
            <div className={styles.HomePageTable}>
              {
                (context.activeTable !== "applications") ?
                <div className={styles.developPage}>
                    <img src="/img/work.png"/>
                </div>  
                :(
                    <UniversalTable
                    tableBody={(context.dataTable)}
                    tableHeader={context.tableHeader}
                />
                )
              }
            </div>
          </section>
          
        </main>
        </Layout>
         <Footer/>
  
      </div>
     );
}

export default HomePage;