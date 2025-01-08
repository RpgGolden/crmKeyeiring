import styles from "./Footer.module.scss";

function Footer() {
    return (
        <footer className={styles.FooterContainer}>
            <div className={styles.ContentWrapper}>
                {/* Логотип */}
                {/* <div className={styles.LogoSection}>
                    <img src="/img/logo.png" alt="Логотип компании" className={styles.Logo} />
                </div> */}
                {/* Контактная информация */}
                {/* <div className={styles.ContactSection}>
                    <p>📍 Адрес: г. Москва, ул. Примерная, 123</p>
                    <p>📞 Телефон: +7 (495) 123-45-67</p>
                    <p>✉️ Email: info@crm-catering.ru</p>
                </div> */}
                {/* Копирайт */}
                <div className={styles.CopyrightSection}>
                    <p>© {new Date().getFullYear()} CRM-Система для кейтеринга. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
