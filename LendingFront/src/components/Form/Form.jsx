import { useState } from "react";
import styles from "./Form.module.scss";
import { CreateOrder } from "../../API/ApiRequest";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitForm = (e) => {
    const data = {
      clientName: formData?.clientName,
      clientEmail: formData?.clientEmail,
      clientPhone: formData?.clientPhone,
      numberOfPeople: formData?.numberOfPeople,
      eventType: formData?.eventType,
      preferences: formData?.preferences,
      eventStartDate: new Date(formData?.eventStartDate),
      budget: formData?.budget,
      deliveryMethod: formData?.deliveryMethod,
      deliveryAddress: formData?.deliveryAddress,
    }
    console.log("Form Data:", data);
    CreateOrder(data).then((res) => {
        console.log("res", res)
    //   if (res?.status === 200) {        
    //     props.closeForm();
    //     console.log("res", res)
    //     alert("Заявка успешно отправлена! Ожидайте ответа!")
    //   }
    })
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formContainerInner}>
        <div className={styles.contactForm}>
          <h2>Форма обратной связи</h2>
          <button
            className={styles.close}
            onClick={() => props.closeForm()}
          >
            <p>X</p>
          </button>
          <form>
            {/* Двухколоночная структура */}
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
            </div>

            <button className={styles.submitButton} onClick={() => SubmitForm()}>
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
