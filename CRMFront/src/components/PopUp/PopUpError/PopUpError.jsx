import { useContext } from "react";
import styles from "./PopUpError.module.scss";
import DataContext from "../../../context";

function PopUpError() {
    const context = useContext(DataContext);

    return ( 
        <div className={styles.PopUpError}>
            <div className={styles.PopUpErrorContainer}>
                <div className={styles.PopUpText}>
                    <p>{context?.textPopUp}</p>
                </div>
                <div className={styles.PopUpButton}>
                    <button onClick={() => context.setVizibleePopUp("")} className={styles.PopUpButtonCancel}>Закрыть</button>
                </div>
            </div>
        </div>
     );
}

export default PopUpError;