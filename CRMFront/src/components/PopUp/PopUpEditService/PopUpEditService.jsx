import React, { useState, useEffect, useContext } from "react";
import styles from "./PopUpEditService.module.scss";
import DataContext from "../../../context";
import { GetOneService, UpdateService } from "../../../API/ApiReguest";

function PopUpEditService(props) {
  const context = useContext(DataContext);

  // Локальное состояние для формы
  const [formData, setFormData] = useState({
    newName: "",
    description: "",
    price: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Загружаем данные услуги при открытии попапа
  useEffect(() => {
    if (context?.selectedService) {
      setIsLoading(true);
      GetOneService(context?.selectedService).then((resp) => {
        if (resp?.status === 200) {
          setFormData({
            newName: resp?.data?.name,
            description: resp?.data?.description,
            price: resp?.data?.price,
            image: null, // Оставляем null для нового файла
          });
        }
        setIsLoading(false);
      });
    }
  }, [context?.selectedService]); // Выполняется при изменении выбранной услуги

  // Обработчик изменения текстовых полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Обработчик изменения файла
  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData?.newName || !formData?.description || !formData?.price) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const form = new FormData();
    form.append("newName", formData?.newName);
    form.append("description", formData?.description);
    form.append("price", formData?.price);

    // Если пользователь загрузил новый файл, добавляем его в запрос
    if (formData?.image) {
      form.append("image", formData?.image);
    }

    UpdateService(form, context?.selectedService)
      .then((resp) => {
        if (resp?.status === 200) {
          // После успешного обновления вызываем функцию обновления списка
          props?.GetAllService();
          onClose();
        }
      })
      .catch((err) => {
        console.error("Ошибка при обновлении услуги:", err);
        alert("Произошла ошибка при сохранении изменений.");
      });
  };

  // Закрытие попапа
  const onClose = () => {
    context.setVizibleePopUp("");
    context.setSelectedService("");
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popup__content}>
        <button className={styles.popup__close} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.popup__title}>Редактирование услуги</h2>
        {isLoading ? (
          <p>Загрузка данных...</p>
        ) : (
          <form className={styles.popup__form} onSubmit={handleSubmit}>
            <label className={styles.popup__label}>
              Название
              <input
                type="text"
                name="newName"
                className={styles.popup__input}
                value={formData?.newName}
                onChange={handleChange}
                
              />
            </label>
            <label className={styles.popup__label}>
              Описание
              <textarea
                name="description"
                className={styles.popup__textarea}
                value={formData?.description}
                onChange={handleChange}
                
              />
            </label>
            <label className={styles.popup__label}>
              Стоимость услуги от (***руб.)
              <input
                type="number"
                name="price"
                className={styles.popup__input}
                value={formData?.price}
                onChange={handleChange}
                
              />
            </label>
            <label className={styles.popup__label}>
              Фото карточки
              <div className={styles.popup__file__wrapper}>
                <input
                  type="file"
                  name="image"
                  className={styles.popup__file__input}
                  onChange={handleFileChange}
                />
                <span className={styles.popup__file__custom}>
                  {formData?.image
                    ? formData?.image?.name
                    : "Загрузить новое фото (если нужно)"}
                </span>
              </div>
            </label>
            <button type="submit" className={styles.popup__submit}>
              Сохранить
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PopUpEditService;
