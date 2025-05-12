import { useState } from "react";
import styles from "./Form.module.scss";
import { Button, Box } from "@mui/material";
import { CreateOrder } from "../../API/ApiRequest";
import DishModal from "../DishModal/DishModal";

function Form(props) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    numberOfPeople: "",
    eventType: "",
    preferences: "",
    eventStartDate: "",
    budget: "",
    deliveryMethod: "",
    deliveryAddress: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddToCart = (dish) => {
    setCartItems((prev) => [...prev, dish]);
  };

  const handleRemoveFromCart = (dishId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== dishId));
  };

  const SubmitForm = () => {
    const data = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      numberOfPeople: formData.numberOfPeople,
      eventType: formData.eventType,
      preferences: formData.preferences,
      eventStartDate: new Date(formData.eventStartDate),
      budget: formData.budget,
      deliveryMethod: formData.deliveryMethod,
      deliveryAddress: formData.deliveryAddress,
      dishes: cartItems.map((item) => ({
        dishId: item.id,
        quantity: item.quantity,
      })),
    };

    console.log("Form Data:", data);
    CreateOrder(data).then((res) => {
      console.log("res", res);
      if (res?.status === 200) {
        props.closeForm();
        alert("Заявка успешно отправлена! Ожидайте ответа!");
      }
    });
  };

  const onUpdateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const onSaveCart = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formContainerInner}>
        <div className={styles.contactForm}>
          <h2>Оформление заказа</h2>
          <button className={styles.close} onClick={props.closeForm}>
            <p>X</p>
          </button>

          <div className={styles.gridContainer}>
            <div>
              <label htmlFor="clientName">Имя *</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="clientEmail">E-mail *</label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="clientPhone">Телефон *</label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="numberOfPeople">Количество гостей *</label>
              <input
                type="number"
                id="numberOfPeople"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="eventType">Тип мероприятия *</label>
              <input
                type="text"
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="preferences">Предпочтения</label>
              <textarea
                id="preferences"
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="eventStartDate">Дата начала мероприятия *</label>
              <input
                type="date"
                id="eventStartDate"
                name="eventStartDate"
                value={formData.eventStartDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="budget">Бюджет *</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="deliveryMethod">Способ доставки *</label>
              <select
                id="deliveryMethod"
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                required
              >
                <option value="">Выберите способ доставки</option>
                <option value="pickup">Самовывоз</option>
                <option value="delivery">Курьер</option>
              </select>
            </div>

            <div>
              <label htmlFor="deliveryAddress">Адрес доставки</label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
              />
            </div>

            <Box className={styles.cart}>
              <Button
                variant="outlined"
                onClick={() => setModalOpen(true)}
                sx={{ width: "100%", backgroundColor: "#fff" }}
              >
                Корзина ({cartItems.length})
              </Button>
            </Box>
          </div>

          <div className={styles.submitButtonContainer}>
            <Button
              variant="contained"
              color="primary"
              className={styles.submitButton}
              onClick={SubmitForm}
            >
              Отправить
            </Button>
          </div>
        </div>
      </div>

      {/* Модальное окно блюд */}
      <DishModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
        cartItems={cartItems}
        onSaveCart={onSaveCart}
      />
    </div>
  );
}

export default Form;
