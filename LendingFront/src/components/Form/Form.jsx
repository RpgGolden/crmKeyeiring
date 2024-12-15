import { useState } from "react";
import styles from "./Form.module.scss";
function Form() {

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        comment: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь можно добавить логику отправки данных формы
        console.log(formData);
    };

    return ( 
        <div className={styles.contactForm}>
        <h2>Форма обратной связи</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Имя *</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <label htmlFor="phone">Телефон *</label>
            <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
            />

            <label htmlFor="email">E-mail</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
            />

            <label htmlFor="comment">Комментарий</label>
            <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
            />
            <label htmlFor="city">Напишите, пожалуйста, из какого вы города, что за объект питания, количество гостей и сезонность объекта?</label>
            <textarea
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            />

            <button type="submit" className={styles.submitButton}>Отправить</button>
        </form>
    </div>
     );
}

export default Form;