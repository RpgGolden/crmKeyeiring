import React from 'react';
import styles from "./Layout.module.scss";

const Layout = ({ children }) => {
    return (
        <div className={styles.LayoutContiner}>
            <main>
                {children}
            </main>
            
        </div>
    );
};

export default Layout;