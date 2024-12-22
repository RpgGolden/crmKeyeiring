import axios from "axios";
const http = axios.create({
  withCredentials: true,
});

const server = "http://localhost:3000";

//! Создание заявки
export const CreateOrder = async (Data) => {
    try {
      const response = await http.post(`${server}/order/create`, Data);
      return response;
    } catch (error) {
        console.log("Такой пользователь уже существует!");
        return false;
    }
  };