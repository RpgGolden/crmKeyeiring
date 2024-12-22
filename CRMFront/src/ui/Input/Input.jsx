import React from 'react';
import styles from "./Input.module.scss";

const InputField = (props) => {
  return (
    <div className={styles.inputCont}>
      <label>
        <p>{props.typelabel}</p>
        <input
          type={props.type}
          name={props.name} // Ensure the name attribute is passed
          value={props.value || ''} // Ensure the value is always a string
          onChange={props.handleChange} // Pass the event directly
          placeholder={props.placeholder}
          required={props.required}
          className={styles.input}
        />
      </label>
    </div>
  );
};

export default InputField;