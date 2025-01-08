import { useState } from "react";
import styles from "./ServiseCard.module.scss";
import { DeleteService } from "../../API/ApiReguest";
import DataContext from "../../context";
import { useContext } from "react";

function ServiseCard(props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const context = useContext(DataContext);
  // Функция для отображения подтверждения удаления
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  // Функция для отмены удаления
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  // Функция для подтверждения удаления
  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    DeleteService(props.item.name).then((res) => {
        if(res?.status === 200){
            props.GetAllService()
        }
    })
  };

  return (
    <div className={styles.card}>
      {/* Функциональное меню */}
      <div className={styles.functionalTopMenu}>
        <div className={styles.functionalTopMenuInner}>
          <div>
            <p>Карточка услуги</p>
          </div>
          <div>
            <button>
              <img onClick={() => {context.setVizibleePopUp("PopUpEditService"); context.setSelectedService(props?.item?.name)}} src="/img/edit.svg" alt="edit" />
            </button>
            <button onClick={handleDeleteClick}>
              <img src="/img/delete.svg" alt="delete" />
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент карточки */}
      <div className={styles.cardInner}>
        <div className={styles.imageWrapper}>
          <img src={props?.item?.imageUrl} alt="IMG" />
        </div>
        <h3>{props?.item?.name}</h3>
        <p>{props?.item?.description}</p>
        <span>от {props?.item?.price} ₽/гость</span>
      </div>

      {/* Оверлей подтверждения удаления */}
      {showDeleteConfirmation && (
        <div className={styles.deleteOverlay}>
          <div className={styles.deleteConfirmation}>
            <p>Вы уверены, что хотите удалить эту услугу?</p>
            <div className={styles.confirmationButtons}>
              <button className={styles.yesButton} onClick={confirmDelete}>
                Да
              </button>
              <button className={styles.noButton} onClick={cancelDelete}>
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiseCard;
