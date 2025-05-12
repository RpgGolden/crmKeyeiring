import styles from "./Head.module.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Head() {
  const user = useSelector((state) => state.BasicSlice.user);
  const navigate = useNavigate();
  const funReg = () => {
    if (user.id) {
      navigate("/profile");
    } else {
      navigate("/authorization");
    }
  };

  return (
    <>
      <header className={styles.header}>
        <nav>
          <ul>
            <li>
              <a href="#about">О нас</a>
            </li>
            <li>
              <a href="#advantages">Преимущества</a>
            </li>
            <li>
              <a href="#gallery">Галерея</a>
            </li>
            <li>
              <a href="#prices">Цены</a>
            </li>
            <li>
              <a href="#form">Контакты</a>
            </li>
          </ul>
        </nav>
        <span className={styles.reg} onClick={funReg}>
          {user.id ? user.name + " " + user.surname : "Вход"}
        </span>
      </header>
    </>
  );
}

export default Head;
