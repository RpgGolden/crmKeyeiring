import React, { useState } from "react";
import styles from "./PopUpCreateService.module.scss";
import DataContext from "../../../context";
import { useContext } from "react";
import { CreateService } from "../../../API/ApiReguest";

function PopUpCreateService(props) {
    const context = useContext(DataContext);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
  
    // Создаем объект FormData
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("image", formData.image); // Здесь важно добавить объект File
  
    // Отправляем данные
    CreateService(form).then((resp) => {
      if (resp?.status === 200) {
        props?.GetAllService();
        onClose();
      }
    });
  };
  

  const onClose = () =>{
    context.setVizibleePopUp("");
  }

  return (
    <div className={styles.popup}>
      <div className={styles.popup__content}>
        <button className={styles.popup__close} onClick={() => onClose()}>
          &times;
        </button>
        <h2 className={styles.popup__title}>Добавление услуги</h2>
        <form className={styles.popup__form} onSubmit={handleSubmit}>
          <label className={styles.popup__label}>
            Название
            <input
              type="text"
              name="name"
              className={styles.popup__input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.popup__label}>
            Описание
            <textarea
              name="description"
              className={styles.popup__textarea}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.popup__label}>
            Стоимость услуги от (***руб.)
            <input
              type="number"
              name="price"
              className={styles.popup__input}
              value={formData.price}
              onChange={handleChange}
              required
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
                required
              />
              <span className={styles.popup__file__custom}>
                {formData.image ? formData.image.name : "Загрузить фото"}
              </span>
            </div>
          </label>
          <button type="submit" className={styles.popup__submit}>
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopUpCreateService;
