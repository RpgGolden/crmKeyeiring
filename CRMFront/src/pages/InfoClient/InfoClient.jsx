import { useContext, useEffect, useState } from "react";
import styles from "./InfoClient.module.scss";
import { getOneClient } from "../../API/ApiReguest";
import { useLocation, useNavigate } from "react-router-dom";
import DataContext from "../../context";

function InfoClient() {
    const [dataClient, setDataClient] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(DataContext);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const clientId = queryParams.get("IdClient");

        if (clientId) {
            getOneClient(clientId).then((res) => {
                setDataClient(res.data);
            });
        }
    }, [location.search]);

    if (!dataClient) {
        return <div className={styles.InfoClientContainer}>Loading...</div>;
    }
    const goBack = () => {
        navigate(-1);
    };

    const status = {
        pending: "Создан",
        approved: "Одобрен",
        declined: "Отклонен",
        completed: "Выполнен",
        canceled: "Отменен",
      };

      const deliveryMethod = {
        pickup: "Самовывоз",
        delivery: "Доставка",
      };

    return (
        <div className={styles.InfoClientContainer}>
            <div className={styles.ContainerBack}>
                <button onClick={() => goBack()}>Назад</button>
            </div>
            <div className={styles.clientInfo}>
                <h2>Информация о клиенте</h2>
                <p><strong>Имя:</strong> {dataClient.clientName}</p>
                <p><strong>Email:</strong> {dataClient.clientEmail}</p>
                <p><strong>Телефон:</strong> {dataClient.clientPhone}</p>
            </div>
    
            <div className={styles.ordersHistory}>
                <h2>История заказов</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Тип события</th>
                            <th>Предпочтения</th>
                            <th>Событие</th>
                            <th>Бюджет</th>                            
                            <th>Адрес доставки</th>
                            <th>Метод доставки</th>
                            <th>Статус</th>
                            <th>Дата события</th>
                            <th>Дата создания зявки</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataClient.orders.map((order, index) => (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{order.eventType}</td>
                                <td>{order.preferences}</td>
                                <td>{order.numberOfPeople}</td>
                                <td>{order.budget}</td>
                                <td>{order.deliveryAddress}</td>
                                <td>{deliveryMethod[order.deliveryMethod]}</td>
                                <td>{status[order.status]}</td>
                                <td>{new Date(order.eventStartDate).toLocaleDateString()}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InfoClient;
