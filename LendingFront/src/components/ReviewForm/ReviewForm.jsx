import { useState, useRef } from "react";
import styles from "./ReviewForm.module.scss"; // Импорт стилей
import { CreateFeedback, GetAllFeedback } from "../../API/ApiRequest";

function ReviewForm() {
    const nameRef = useRef();
    const textRef = useRef();
    const fileInputRef = useRef();

    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState("Файл не выбран");
    const [formData, setFormData] = useState({
        phone: "+7",
        description: "",
        image: null,
        score: 0,
    });

    const [errors, setErrors] = useState({
        phone: "",
        description: "",
        score: "",
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFormData((prevData) => ({
                ...prevData,
                image: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFileName("Файл не выбран");
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value.startsWith("+7")) {
            setFormData((prevData) => ({ ...prevData, phone: value }));
        } else {
            setFormData((prevData) => ({ ...prevData, phone: "+7" }));
        }
    };

    const handleStarClick = (score) => {
        setFormData((prevData) => ({ ...prevData, score }));
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { phone: "", description: "", score: "" };

        if (!formData.phone || !/^\+7\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Введите корректный номер телефона в формате +7XXXXXXXXXX.";
            valid = false;
        }

        if (formData.description.length > 0) {
            newErrors.description = "Введите текст отзыва.";
            valid = false;
        }

        if (formData.score === 0) {
            newErrors.score = "Пожалуйста, оцените обслуживание.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const phone = nameRef.current.value;
        const description = textRef.current.value;
        const image = formData.image;
        const formDataDatas = new FormData();
        formDataDatas.append("phone", phone);
        formDataDatas.append("description", description);
        formDataDatas.append("image", image);
        formDataDatas.append("score", formData.score);

        CreateFeedback(formDataDatas).then((resp) => {
            if (resp?.status === 200) {
                alert("Спасибо! Ваш отзыв успешно отправлен!");
            }
        });

        nameRef.current.value = "";
        textRef.current.value = "";
        fileInputRef.current.value = "";
        setFileName("Файл не выбран");
        setImagePreview(null);
        setFormData({ phone: "+7", description: "", image: null, score: 0 });
        setErrors({ phone: "", description: "", score: "" });
    };

    return (
        <section>
            <div>
                <form className={styles.reviewForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Ваш номер телефона:</label>
                        <input
                            id="phone"
                            ref={nameRef}
                            type="text"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className={styles.inputField}
                            placeholder="Введите номер телефона"
                            required
                        />
                        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="text">Текст отзыва:</label>
                        <textarea
                            id="text"
                            ref={textRef}
                            className={styles.inputField}
                            placeholder="Поделитесь своими впечатлениями"
                            rows="5"
                            required
                        />
                        {errors.description && <span className={styles.error}>{errors.description}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="image">Прикрепить фотографию:</label>
                        <div className={styles.customFileInput}>
                            <input
                                id="image"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={styles.hiddenInput}
                            />
                            <button
                                type="button"
                                className={styles.fileButton}
                                onClick={() => fileInputRef.current.click()}
                            >
                                Выберите файл
                            </button>
                            <span className={styles.fileName}>{fileName}</span>
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Превью" className={styles.imagePreview} />}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Оцените обслуживание:</label>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={
                                        formData.score >= star
                                            ? styles.starActive
                                            : styles.star
                                    }
                                    onClick={() => handleStarClick(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        {errors.score && <span className={styles.error}>{errors.score}</span>}
                    </div>

                    <button type="submit" className={styles.submitButton}>Отправить</button>
                </form>
            </div>
        </section>
    );
}

export default ReviewForm;
