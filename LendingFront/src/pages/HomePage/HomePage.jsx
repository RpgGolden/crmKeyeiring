import { useEffect, useRef, useState } from "react";
import Head from "../../components/Header/Head";
import styles from "./HomePage.module.scss";
import Form from "../../components/Form/Form";

function HomePage() {

    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;

        if (slider) {
            // Дублируем содержимое для создания бесконечного эффекта
            const clonedSlides = slider.innerHTML;
            slider.insertAdjacentHTML("beforeend", clonedSlides);
        }
    }, []);

    return ( 
       <>
        <Head/>
            <main>
                    <section className={styles.mainSection}>
                        <h1>Премиальный кейтеринг для вашего события</h1>
                        <p>Сервировка, обслуживание и восхитительная кухня на высшем уровне</p>
                        <button className={styles.button}>Заказать</button>
                    </section>
                <div className={styles.container}>
                    <section id="about" className={styles.about}>
                        <h2>О нас</h2>
                        <div className={styles.aboutContent}>
                            <div className={styles.aboutText}>
                                <p>Мы создаем уникальные гастрономические впечатления для ваших событий: от камерных встреч до масштабных праздников.</p>
                                <p>Наша команда — это профессионалы с многолетним опытом, которые учитывают каждую деталь для создания идеального кейтеринга.</p>
                            </div>
                            <div className={styles.aboutImages}>
                                <img src="/img/1.jpeg" alt="Команда кейтеринга" />
                                <img src="https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=400&q=80" alt="Процесс приготовления" />
                            </div>
                        </div>
                    </section>


                    <section id="advantages" className={styles.advantages}>
                        <h2>Наши преимущества</h2>
                        <div className={styles.advantagesGrid}>
                            <div className={styles.advantageCard}>
                                <img src="/img/menu.jpg" alt="Изысканное меню" />
                                <h3>Изысканное меню</h3>
                                <p>Широкий выбор блюд от классических до авторских решений.</p>
                            </div>
                            <div className={styles.advantageCard}>
                                <img src="/img/servises.webp" alt="Профессиональный сервис" />
                                <h3>Профессиональный сервис</h3>
                                <p>Опытные официанты и повара — залог вашего спокойствия.</p>
                            </div>
                            <div className={styles.advantageCard}>
                                <img src="/img/organiz.jpg" alt="Полное сопровождение" />
                                <h3>Полное сопровождение</h3>
                                <p>Организация мероприятия под ключ от начала до конца.</p>
                            </div>
                        </div>
                    </section>

                    <section id="stats" className={styles.stats}>
                        <div className={styles.statItem}>
                            <img src="/img/time.png" alt="Опыт" />
                            <h3>10</h3>
                            <p>ЛЕТ</p>
                            <span>успешной работы</span>
                        </div>
                        <div className={styles.statItem}>
                            <img src="/img/people.png" alt="Команда" />
                            <h3>250+</h3>
                            <p>ЧЕЛОВЕК</p>
                            <span>персонала в сезон</span>
                        </div>
                        <div className={styles.statItem}>
                            <img src="/img/smile.png" alt="Гости" />
                            <h3>3000+</h3>
                            <p>ГОСТЕЙ</p>
                            <span>обслуживаем ежедневно</span>
                        </div>
                        <div className={styles.statItem}>
                            <img src="/img/case.png" alt="Проекты" />
                            <h3>100</h3>
                            <p>ПРОЦЕНТОВ</p>
                            <span>выполненных договоров</span>
                        </div>
                    </section>

                    <div className={styles.container}>
                    {/* Галерея */}
                    <section id="gallery" className={styles.gallery}>
                        <h2>Галерея</h2>
                        <div className={styles.gallerySlider}>
                            <div ref={sliderRef} className={styles.sliderTrack}>
                                <img src="/img/s1.jpg" alt="Сервировка" />
                                <img src="/img/2.webp" alt="Сервировка" />
                                <img src="/img/1.jpg" alt="Сервировка" />
                                <img src="/img/3.webp" alt="Сервировка" />
                                <img src="/img/5.jpg" alt="Сервировка" />
                                <img src="/img/6.webp" alt="Сервировка" />
                            </div>
                        </div>
                    </section>
                </div>


                    <section id="prices" className={styles.prices}>
                        <h2>Цены на наши услуги</h2>
                        <div className={styles.cardContainer}>
                            <div className={styles.card}>
                                <img src="/img/fursh.webp" alt="Фуршет"/>
                                <h3>Фуршет</h3>
                                <p>Легкие закуски и напитки</p>
                                <span>от 2000 ₽/гость</span>
                            </div>
                            <div className={styles.card}>
                                <img src="/img/banket.webp" alt="Банкет"/>
                                <h3>Банкет</h3>
                                <p>Полное меню с обслуживанием</p>
                                <span>от 3500 ₽/гость</span>
                            </div>
                            <div className={styles.card}>
                                <img src="/img/kofe.webp" alt="Кофе-брейк"/>
                                <h3>Кофе-брейк</h3>
                                <p>Кофе, чай и свежая выпечка</p>
                                <span>от 800 ₽/гость</span>
                            </div>
                        </div>
                    </section>
                    
                    <section id="howItWorks" className={styles.howItWorks}>
                        <h2>Как это работает</h2>
                        <div className={styles.steps}>
                            <div className={styles.step}>
                                <div className={styles.circle}>
                                    1
                                </div>
                                <h4>СВЯЖИТЕСЬ С НАМИ</h4>
                                <p>Договоримся о встрече и согласуем условия договора</p>
                            </div>
                            <div className={styles.step}>
                            <div className={styles.circle}>
                                    2
                                </div>
                                <h4>УКОМПЛЕКТУЕМ ОБЪЕКТ</h4>
                                <p>Доставим оборудование и весь необходимый инвентарь</p>
                            </div>
                            <div className={styles.step}>
                            <div className={styles.circle}>
                                    3
                                </div>
                                <h4>ОТКРОЕМСЯ ЗА НОЧЬ</h4>
                                <p>Гости не испытают неудобств и будут приятно удивлены</p>
                            </div>
                        </div>
                    </section>

                  {/* Контактная информация и форма обратной связи */}
                <section id="contacts" className={styles.contacts}>
                    <div className={styles.contactContent}>
                        {/* Контакты */}
                        <div className={styles.contactInfo}>
                            <h2>Наши контакты</h2>
                            <p>г. Краснодар, ул. Восточно-Кругляковская, д.32, офис 7</p>
                            <p>8 800 101 8 365</p>
                            <p>Email: <strong>info@accord365.ru</strong></p>
                        </div>
                        {/* Форма обратной связи */}
                        <Form/>
                    </div>
                    </section>
                </div>
            </main>
            <footer style={styles.footerCont}>
                <p>&copy; 2024 Премиальный Кейтеринг. Все права защищены.</p>
            </footer>
       </>
     );
}

export default HomePage;
