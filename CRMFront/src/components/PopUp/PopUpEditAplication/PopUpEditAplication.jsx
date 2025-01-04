import React, { useState, useEffect, useContext } from "react";
import styles from "./PopUpEditAplication.module.scss";
import DataContext from "../../../context";
import { GetOneOrders, UpdateOrders } from "../../../API/ApiReguest";

function PopUpEditAplication(props) {
  const context = useContext(DataContext);

  // Локальное состояние для формы
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    numberOfPeople: "",
    eventType: "",
    preferences: "",
    eventStartDate: "",
    deliveryAddress: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Загружаем данные услуги при открытии попапа
  useEffect(() => {
    if (context?.selectedRows) {
      setIsLoading(true);
      GetOneOrders(context?.selectedRows).then((resp) => {
        if (resp?.status === 200) {
          const data = resp?.data;
          setFormData({
            clientName: data?.client?.clientName || "",
            clientEmail: data?.client?.clientEmail || "",
            clientPhone: data?.client?.clientPhone || "",
            numberOfPeople: data?.numberOfPeople || "",
            eventType: data?.eventType || "",
            preferences: data?.preferences || "",
            eventStartDate: data?.eventStartDate?.slice(0, 16) || "", // ISO строку преобразуем в формат для input[type="datetime-local"]
            deliveryAddress: data?.deliveryAddress || "",
          });
        }
        setIsLoading(false);
      });
    }
  }, []);

  // Обработчик изменения текстовых полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData?.clientName ||
      !formData?.clientEmail ||
      !formData.clientPhone ||
      !formData?.numberOfPeople ||
      !formData?.eventType ||
      !formData?.preferences ||
      !formData?.eventStartDate ||
      !formData?.deliveryAddress
    ) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    UpdateOrders(context?.selectedRows, formData)
      .then((resp) => {
        if (resp?.status === 200) {
            context?.getTableData(context?.activeTable);
            onClose()
        }
      })
  };

  // Закрытие попапа
  const onClose = () => {
    context.setVizibleePopUp("");
    context.setSelectedService("");
  };

  return (
    <div className={styles.PopUpEditAplication}>
      <div className={styles.popup__content}>
        <button className={styles.popup__close} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.popup__title}>Редактирование заявки</h2>
        {isLoading ? (
          <p>Загрузка данных...</p>
        ) : (
          <form className={styles.popup__form} onSubmit={handleSubmit}>
            <label className={styles.popup__label}>
              Имя клиента
              <input
                type="text"
                name="clientName"
                className={styles.popup__input}
                value={formData?.clientName}
                onChange={handleChange}
              />
            </label>
            <label className={styles.popup__label}>
              Email клиента
              <input
                type="email"
                name="clientEmail"
                className={styles.popup__input}
                value={formData?.clientEmail}
                onChange={handleChange}
              />
            </label>
            <label className={styles.popup__label}>
              Телефон клиента
              <input
                type="tel"
                name="clientPhone"
                className={styles.popup__input}
                value={formData?.clientPhone}
                onChange={handleChange}
              />
            </label>
            <label className={styles.popup__label}>
              Количество человек
              <input
                type="number"
                name="numberOfPeople"
                className={styles.popup__input}
                value={formData?.numberOfPeople}
                onChange={handleChange}
              />
            </label>
            <label className={styles.popup__label}>
              Тип мероприятия
              <input
                type="text"
                name="eventType"
                className={styles.popup__input}
                value={formData?.eventType}
                onChange={handleChange}
              />
            </label>
            <label className={styles.popup__label}>
              Предпочтения
              <input
                type="text"
                name="preferences"
                className={styles.popup__input}
                value={formData?.preferences}
                onChange={handleChange}
              />
            </label>
            <label className={styles.popup__label}>
              Дата начала события
              <input
                type="datetime-local"
                name="eventStartDate"
                className={styles.popup__input}
                value={formData?.eventStartDate}
                onChange={handleChange}
              />
            </label>
            <label className={styles.popup__label}>
              Адрес доставки
              <input
                type="text"
                name="deliveryAddress"
                className={styles.popup__input}
                value={formData?.deliveryAddress}
                onChange={handleChange}
              />
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

export default PopUpEditAplication;
