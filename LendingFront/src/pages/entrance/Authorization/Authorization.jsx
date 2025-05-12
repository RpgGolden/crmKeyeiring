import { useNavigate } from "react-router-dom";
import styles from "./Authorization.module.scss";
import { inputs } from "./data";
import { useState } from "react";
import { apiLogin } from "../../../API/ApiRequest";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/basicSlice/basic.Slice";

function Authorization({ funUpdUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const funSetData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const funSave = () => {
    apiLogin(data).then((res) => {
      if (res.status === 200) {
        navigate("/");
        dispatch(setUser({ data: res.data }));
      }
    });
  };
  return (
    <div className={styles.Authorization}>
      <div className={styles.back}>
        <span onClick={() => navigate("/")}>Главная</span>
      </div>
      <div className={styles.container}>
        <h1>Авторизация</h1>
        <div className={styles.auth}>
          <span>Еще не зарегистрированы?</span>
          <a href="/registration">Регистрация</a>
        </div>
        <div className={styles.form}>
          {inputs.map((item, index) => (
            <div className={styles.input_box} name={item.key} key={index}>
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
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

export default Authorization;
