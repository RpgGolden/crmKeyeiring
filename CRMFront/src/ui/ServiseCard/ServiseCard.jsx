import styles from "./ServiseCard.module.scss";

function ServiseCard(props) {
    return ( 
    <div className={styles.card}>
        <img src={props?.item?.imageUrl} alt="IMG"/>
        <h3>{props?.item?.name}</h3>
        <p>{props?.item?.description}</p>
        <span>от {props?.item?.price} ₽/гость</span>
        <button>Редактировать</button>
    </div>
     );
}

export default ServiseCard;