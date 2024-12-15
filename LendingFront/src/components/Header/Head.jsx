
import styles from "./Head.module.scss";
function Head() {
    return ( 
        <>
        <header className={styles.header}>
        <nav>
            <ul>
                <li><a href="#about">О нас</a></li>
                <li><a href="#advantages">Преимущества</a></li>
                <li><a href="#gallery">Галерея</a></li>
                <li><a href="#prices">Цены</a></li>
                <li><a href="#contacts">Контакты</a></li>
            </ul>
        </nav>
    </header>
        </>
     );
}

export default Head;