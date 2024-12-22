import { useContext } from "react";
import DataContext from "../../context";
import HomePageTopMenu from "../../ui/HomePageTopMenu/HomePageTopMenu";
import styles from "./HomePage.module.scss";
import UniversalTable from "../../components/UniversalTable/UniversalTable";
function HomePage() {
    const context = useContext(DataContext);
    console.log("context", context)
    return ( 
        <div className={styles.HomePageContainer}>
        <header>
          <div className={styles.HomePageHeaderPc}>
            <HomePageTopMenu />
          </div>
        </header>
  
        <main>
          <section className={styles.HomePageTableSectionPc}>
            <div className={styles.HomePageTable}>
              {
                (context.activeTable === "Staff" || context.activeTable === "Analytics" || context.activeTable === "applications") ?
                <div className={styles.developPage}>
                    <img src="/img/work.png"/>
                </div>  
                :(
                    <UniversalTable
                    tableBody={(context.tableBody)}
                    tableHeader={context.tableHeader}
                />
                )
              }
            </div>
          </section>
          
        </main>
  
      </div>
     );
}

export default HomePage;