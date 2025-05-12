import axios from "axios";
const http = axios.create({
  withCredentials: true,
});

const server = "http://localhost:3000";
const REFRESH_INTERVAL = 500000; // 8 минут 500000
let refreshTokensTimeout;

//! Рефреш токенов
export const refreshTokens = async () => {
  const data = {
    refreshToken: sessionStorage.getItem("refreshToken"),
  };
  try {
    const response = await http.post(`${server}/auth/refresh`, data, {});
    // Remove old tokens
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    // Destructure the required data from the response
    const { accessToken, refreshToken } = response.data.data;
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    return response;
  } catch (error) {
    console.error("Tokens were not updated!", error);
  }
};

//!таймер рефреша
const refreshTokensTimer = () => {
  clearTimeout(refreshTokensTimeout);
  if (sessionStorage.getItem("accessToken") === "null") {
    return;
  }
  const lastRefreshTime = sessionStorage.getItem("lastRefreshTime");
  const currentTime = Date.now();
  let timeRemaining;
  if (lastRefreshTime) {
    const nextRefreshTime = parseInt(lastRefreshTime) + REFRESH_INTERVAL;
    timeRemaining = Math.max(0, nextRefreshTime - currentTime);
  } else {
    timeRemaining = 0;
  }
  refreshTokensTimeout = setTimeout(() => {
    refreshTokens();
    sessionStorage.setItem("lastRefreshTime", Date.now());
    refreshTokensTimer();
  }, timeRemaining);

  sessionStorage.setItem("refreshTokensInterval", refreshTokensTimeout);
};

window.addEventListener("load", () => {
  refreshTokensTimer();
});

window.addEventListener("unload", () => {
  clearTimeout(refreshTokensTimeout);
});

//! Запрос на авторизацию
export const LoginFunc = async (UserData) => {
  try {
    console.log("UserData", UserData);
    const response = await http.post(`${server}/auth/login`, UserData);
    const { accessToken, refreshToken, ...user } = response.data;

    // Store tokens in sessionStorage
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("userData", JSON.stringify(user));
    // Set the refresh token as a cookie
    document.Сookie = `refreshToken=${refreshToken}; path=/; secure; SameSite=Strict`; // Adjust attributes as needed

    refreshTokensTimer();
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      return false;
    }
  }
};

//! регистрация аккаунта
export const Register = async (UserData) => {
  try {
    const response = await http.post(`${server}/auth/registerAdmin`, UserData, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const LogOut = async () => {
  try {
    const response = await http.post(
      `${server}/auth/logout`,
      {
        refreshToken: sessionStorage.getItem("refreshToken"),
      },
      {
        headers: {
          Authorization: `${sessionStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Возникла ошибка при выходе!");
    }
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await http.get(`${server}/auth/getUsers`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const GetAllCategory = async () => {
  try {
    const response = await http.get(`${server}/category/getAll`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const GetAllDish = async () => {
  try {
    const response = await http.get(`${server}/dish/getAll`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const addCategory = async (data) => {
  try {
    const response = await http.post(`${server}/category/create`, data, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const addDish = async (data) => {
  try {
    const response = await http.post(`${server}/dish/create`, data, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};
export const updateCategory = async (id, data) => {
  try {
    const response = await http.patch(`${server}/category/update/${id}`, data, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const updateDish = async (id, data) => {
  try {
    const response = await http.patch(`${server}/dish/update/${id}`, data, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await http.delete(`${server}/category/delete/${id}`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const deleteDish = async (id) => {
  try {
    const response = await http.delete(`${server}/dish/delete/${id}`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const ChangeRoleUser = async (id, data) => {
  console.log("data", data);
  console.log("data", id);

  try {
    const response = await http.patch(
      `${server}/service/changeRole/${id}`,
      data,
      {
        headers: {
          Authorization: `${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const GetOrders = async () => {
  try {
    const response = await http.get(`${server}/order/get`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const GetOneOrders = async (id) => {
  try {
    const response = await http.get(`${server}/order/get/${id}`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const UpdateOrders = async (id, data) => {
  try {
    const response = await http.patch(`${server}/order/update/${id}`, data, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 403) {
      window.location.href = `${process.env.REACT_APP_WEB_URL}/Authorization`;
    } else {
      console.log("Произошла ошибка при выполнении запроса!");
      return false;
    }
  }
};

export const UpdateStatus = async (data) => {
  try {
    const response = await http.post(`${server}/order/changeStatus`, data, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const GetAllService = async () => {
  try {
    const response = await http.get(`${server}/service/getAll`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const CreateService = async (data) => {
  try {
    const response = await http.post(`${server}/service/create`, data, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const DeleteService = async (idService) => {
  try {
    const response = await http.delete(
      `${server}/service/delete/${idService}`,
      {
        headers: {
          Authorization: `${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const GetOneService = async (idService) => {
  try {
    const response = await http.get(`${server}/service/get/${idService}`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const UpdateService = async (data, nameService) => {
  console.log("nameService", nameService);
  console.log("data", data);
  try {
    const response = await http.patch(
      `${server}/service/update/${nameService}`,
      data,
      {
        headers: {
          Authorization: `${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const getAllClients = async () => {
  try {
    const response = await http.get(`${server}/client/getAll`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const getOneClient = async (id) => {
  try {
    const response = await http.get(`${server}/client/getOne/${id}`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};

export const getOrdersClient = async (id) => {
  try {
    const response = await http.get(`${server}/client/getClientOrders/${id}`, {
      headers: {
        Authorization: `${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Произошла ошибка при выполнении запроса!");
  }
};
