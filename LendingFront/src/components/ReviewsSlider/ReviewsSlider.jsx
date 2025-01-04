import React, { useState, useRef, useEffect } from 'react';
import styles from './ReviewsSlider.module.scss';


const ReviewsSlider = ({ reviews }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const sliderRef = useRef(null);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    };

    const handleMouseDown = (e) => {
        setDragging(true);
        setStartX(e.clientX); // Начальная позиция мыши
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        setCurrentX(e.clientX); // Текущая позиция мыши
    };

    const handleMouseUp = () => {
        if (!dragging) return;
        const moveDistance = startX - currentX; // Расстояние перемещения
        if (moveDistance > 100) {
            handleNext(); // Перелистывание вперед
        } else if (moveDistance < -100) {
            handlePrev(); // Перелистывание назад
        }
        setDragging(false);
    };

    const handleTouchStart = (e) => {
        setDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!dragging) return;
        setCurrentX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!dragging) return;
        const moveDistance = startX - currentX;
        if (moveDistance > 100) {
            handleNext();
        } else if (moveDistance < -100) {
            handlePrev();
        }
        setDragging(false);
    };

    useEffect(() => {
        const slider = sliderRef.current;
        slider.addEventListener('mousedown', handleMouseDown);
        slider.addEventListener('mousemove', handleMouseMove);
        slider.addEventListener('mouseup', handleMouseUp);
        slider.addEventListener('mouseleave', handleMouseUp);

        slider.addEventListener('touchstart', handleTouchStart);
        slider.addEventListener('touchmove', handleTouchMove);
        slider.addEventListener('touchend', handleTouchEnd);

        return () => {
            slider.removeEventListener('mousedown', handleMouseDown);
            slider.removeEventListener('mousemove', handleMouseMove);
            slider.removeEventListener('mouseup', handleMouseUp);
            slider.removeEventListener('mouseleave', handleMouseUp);

            slider.removeEventListener('touchstart', handleTouchStart);
            slider.removeEventListener('touchmove', handleTouchMove);
            slider.removeEventListener('touchend', handleTouchEnd);
        };
    }, [dragging, startX, currentX]);

    return (
        <section id="reviews" className={styles.reviewsSection}>
            <h2>Отзывы наших клиентов</h2>
            <div className={styles.reviewsSlider} ref={sliderRef}>
                <button className={styles.arrow} onClick={handlePrev}>&lt;</button>
                <div
                    className={styles.review}
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`, // Сдвиг слайдов
                    }}
                >
                    {reviews.map((review, index) => (
                        <div key={index} className={styles.reviewItem}>
                            <img
                                src={review.img}
                                alt="Отзыв"
                                className={styles.reviewImage}
                            />
                            <div className={styles.reviewContent}>
                                <p className={styles.reviewText}>{review.text}</p>
                                <p className={styles.reviewAuthor}>— {review.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className={styles.arrow} onClick={handleNext}>&gt;</button>
            </div>
        </section>
    );
};

export default ReviewsSlider;
