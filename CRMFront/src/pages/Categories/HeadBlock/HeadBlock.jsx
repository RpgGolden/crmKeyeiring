import { useSelector } from "react-redux";
import styles from "./HeadBlock.module.scss";
function HeadBlock({ shearchParam, setShearchParam, setModalShow }) {
  return (
    <div className={styles.HeadBlock}>
      <div className={styles.left_block}>
        <input
          value={shearchParam}
          onChange={(e) => setShearchParam(e.target.value)}
          type="text"
          placeholder="Поиск"
        />
      </div>
      <div className={styles.right_block}>
        <button className={styles.save} onClick={() => setModalShow(true)}>
          + Добавить категорию
        </button>
      </div>
    </div>
  );
}

export default HeadBlock;
