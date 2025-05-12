import { useState } from "react";
import { inputs } from "./data";
import styles from "./Registration.module.scss";
import { useNavigate } from "react-router-dom";
import { apiRegister } from "../../../API/ApiRequest";
import { formatPhoneNumber } from "../../../utils/validations/Validations";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/basicSlice/basic.Slice";

function Registration({ funUpdUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({});

  const funSetData = (key, value) => {
    if (key === "phone") {
      setData({ ...data, [key]: formatPhoneNumber(value) });
      return;
    }
    setData({ ...data, [key]: value });
  };

  const funSave = () => {
    const dat = {
      ...data,
      phone: data.phone.replace(/\D/g, ""),
    };

    apiRegister(dat).then((res) => {
      if (res.status === 200) {
        navigate("/");
        dispatch(setUser({ data: res.data }));
      }
    });
  };

  return (
    <div className={styles.Registration}>
      <div className={styles.back}>
        <span onClick={() => navigate("/")}>Главная</span>
      </div>
      <div className={styles.container}>
        <h1>Регистрация</h1>
        <div className={styles.auth}>
          <span>Есть аккаунт?</span>
          <a href="/authorization">Войти</a>
        </div>
        <div className={styles.form}>
          {inputs.map((item, index) => (
            <div className={styles.input_box} name={item.key}>
              <input
                key={index}
                type={item.type}
                placeholder={item.name}
                autoComplete="new-password"
                value={data[item.key]}
                onChange={(e) => funSetData(item.key, e.target.value)}
              />
            </div>
          ))}
          <button className={styles.save} onClick={funSave}>
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registration;
