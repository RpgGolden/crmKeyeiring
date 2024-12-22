import styles from "./Button.module.scss";

function Button(props) {
    return ( 
        <div className={styles.ButtonContainer}>
            <button onClick={props?.onClick}>{props.text}</button>
        </div>
     );
}

export default Button;