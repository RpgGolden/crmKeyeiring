import axios from "axios";
const http = axios.create({
  withCredentials: true,
});

const server = "http://localhost:3000";

//! Создание заявки
export const CreateOrder = async (Data) => {
  try {
    const response = await http.post(`${server}/order/create`, Data, {
      headers: {
        Authorization: `${localStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    return false;
  }
};

export const getOrders = async () => {
  try {
    const response = await http.get(`${server}/order/get`, {
      headers: {
        Authorization: `${localStorage.getItem("accessToken")}`,
      },
    });
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

export const GetAllDish = async () => {
  try {
    const response = await http.get(`${server}/dish/getAll`, {
      headers: {
        Authorization: `${localStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

//! Запрос на авторизацию
export const apiLogin = async (data) => {
  try {
    const response = await http.post(`${server}/auth/login`, data);
    if (response?.status === 200) {
      localStorage.setItem("accessToken", response?.data?.accessToken);
    }
    return response;
  } catch (error) {
    return error;
  }
};

//! Запрос на регистрацию
export const apiRegister = async (data) => {
  try {
    const response = await http.post(`${server}/auth/register`, data);
    if (response?.status === 200) {
      localStorage.setItem("accessToken", response?.data?.accessToken);
    }
    return response;
  } catch (error) {
    return error;
  }
};

export const apiGetUsers = async () => {
  try {
    const response = await http.get(`${server}/auth/getUsers`, {
      headers: {
        Authorization: `${localStorage.getItem("accessToken")}`,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};
