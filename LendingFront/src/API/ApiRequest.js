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
        return false;
    }
  };

  export const GetAllService = async () => {
    try {
      const response = await http.get(`${server}/service/getAll`);
      return response;
    } catch (error) {
        console.log("Такой пользователь уже существует!");
    }
  };

  export const CreateFeedback = async (data) => {
    try {
      const response = await http.post(`${server}/client/createFeedback`, data);
      return response;
    } catch (error) {
        console.log("Такой пользователь уже существует!");
    }
  };

  export const GetAllFeedback = async () => {
    try {
      const response = await http.get(`${server}/client/getFeedbacksSite`);
      return response;
    } catch (error) {
        console.log("Такой пользователь уже существует!");
    }
  };
  
