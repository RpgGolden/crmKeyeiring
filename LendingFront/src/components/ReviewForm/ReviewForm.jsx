import { useState, useRef } from "react";
import styles from "./ReviewForm.module.scss"; // Импорт стилей

function ReviewForm() {
    const nameRef = useRef();
    const textRef = useRef();
    const fileInputRef = useRef();

    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState("Файл не выбран");
    const [formData, setFormData] = useState({
        name: "",
        text: "",
        image: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // Устанавливаем имя выбранного файла
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
            setFileName("Файл не выбран"); // Возврат к тексту по умолчанию
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const text = textRef.current.value;
        const image = formData.image;

        if (name && text) {
            // Здесь можно отправить данные на сервер, например, с помощью Fetch или Axios
            console.log("Отправляем отзыв:", { name, text, image });
            // Очистить форму после отправки
            nameRef.current.value = "";
            textRef.current.value = "";
            fileInputRef.current.value = "";
            setFileName("Файл не выбран");
            setImagePreview(null);
            setFormData({ name: "", text: "", image: null });
        }
    };

    return (
        <section>
            <div>
                <form className={styles.reviewForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Ваше ФИО:</label>
                        <input
                            id="name"
                            ref={nameRef}
                            type="text"
                            className={styles.inputField}
                            placeholder="Введите ваше ФИО"
                            required
                        />
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
                    <button type="submit" className={styles.submitButton}>Отправить</button>
                </form>
            </div>
        </section>
    );
}

export default ReviewForm;
