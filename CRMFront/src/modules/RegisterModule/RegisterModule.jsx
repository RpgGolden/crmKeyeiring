import React, { useContext, useState } from "react";
import styles from "./RegisterModule.module.scss";
import InputField from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import DataContext from "../../context";
// import { Register } from "../../API/ApiRequest";
import { useNavigate } from "react-router-dom";
import { Register } from "../../API/ApiReguest";

function RegisterModule() {
  const context = useContext(DataContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error message when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = () => {
    const { name, email, password, confirmPassword } = formData;

    // Check if any fields are empty
    if (!name || !email || !password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    const fioArr = name.split(" ")
    const data = {
      name: fioArr[1],
      surname: fioArr[0],
      patronymic: fioArr[2],
      email: email,
      password: password,
    };
    console.log("data", data)

    Register(data).then((res) => {
      if (res.status === 200) {
        context.setUnauthorized(true);
        navigate("/");
      }
    });
  };

  return (
    <div className={styles.RegisterModule}>
      <div className={styles.AuthModuleContainer}>
        <div className={styles.AuthModuleContainerImg}>
          <img src="/img/crm.png" alt="Auth Illustration" />
        </div>
        <div>
          <div className={styles.title}>
            <p>Регистрация</p>
            <p>Управляй заказами и клиентами!</p>
          </div>
          <InputField
            typelabel="ФИО"
            type="text"
            name="name"
            value={formData.name}
            handleChange={handleChange}
          />
          <InputField
            typelabel="Email"
            type="text"
            name="email"
            value={formData.email}
            handleChange={handleChange}
          />
          <InputField
            typelabel="Придумайте пароль"
            type="password"
            name="password"
            value={formData.password}
            handleChange={handleChange}
          />
          <InputField
            typelabel="Повторите пароль"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            handleChange={handleChange}
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <Button text="Зарегистрироваться" onClick={() =>handleSubmit()} />
          <div className={styles.NotAccount}>
            <p>
              Уже есть аккаунт?{" "}
              <span
                onClick={() => context.setUnauthorized(!context.unauthorized)}
              >
                Войти
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModule;
