import { Link, useNavigate } from "react-router-dom";
import Button from "../../ui/Button/Button";
import InputField from "../../ui/Input/Input";
import styles from "./AuthModule.module.scss";
import { useContext, useState } from "react";
import DataContext from "../../context";
import { LoginFunc, emailFunc } from "../../API/ApiReguest";
// import { emailFunc } from "../../API/ApiRequest";

function AuthModule() {
    const navigate = useNavigate()
    const context = useContext(DataContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (error) {
            setError('');
        }
    };

    const handleSubmit = () => {
        const { email, password} = formData;
        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        LoginFunc(formData).then((res) => {
            console.log("res", res)
            if (res?.status === 200) {
                navigate("/HomePage")
            }else{
                setError('Неверный логин или пароль!');
                return;
            }
        })
    };

    return ( 
        <div className={styles.AuthModule}>
            <div className={styles.AuthModuleContainer}> 
                <div className={styles.AuthModuleContainerImg}>
                    <img src="/img/crm.png" alt="Auth Illustration" />
                </div>
                <div>
                    <div className={styles.title}>
                        <p>Вход</p>
                        <p>Управляй заказами и клиентами!</p>
                    </div>
               
                   <InputField 
                       typelabel="Email" 
                       type="text" 
                       name="email" 
                       value={formData.email} 
                       handleChange={handleChange} 
                   />
                   <InputField 
                       typelabel="Пароль" 
                       type="password" 
                       name="password" 
                       value={formData.password} 
                       handleChange={handleChange} 
                   />
                    {error && <p className={styles.errorMessage}>{error}</p>}
                   <Button text="Войти" onClick={handleSubmit} />
                   <div className={styles.NotAccount}>
                        <p>Нет аккаунта? <span onClick={() => context.setUnauthorized(!context.unauthorized)}>Зарегистрироваться</span></p>
                   </div>
                </div>
            </div>
        </div>
     );
}

export default AuthModule;