import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import styles from "./Profile.module.scss";
import { setUser } from "../../store/basicSlice/basic.Slice";
import { getOrders } from "../../API/ApiRequest";

// ...все импорты остаются прежними

function Profile() {
  const user = useSelector((state) => state.BasicSlice.user);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getOrders().then((res) => {
      if (res.status === 200) {
        setOrders(res.data);
      }
    });
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("Сохраняем изменения:", editedUser);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setEditMode(false);
    setProfileImage(null);
  };

  const funLogout = () => {
    window.location.href = "/authorization";
    localStorage.removeItem("accessToken");
    dispatch(setUser({ data: {} }));
  };

  return (
    <div className={styles.Profile}>
      <Box display="flex">
        {/* Левое меню */}
        <Box
          sx={{
            width: 240,
            height: "100vh",
            bgcolor: "white",
            borderRight: "1px solid #ccc",
            position: "fixed",
            padding: "40px 20px",
          }}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => (window.location.href = "/")}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Главная" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  showOrders ? setShowOrders(false) : setShowOrders(true);
                }}
              >
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary={showOrders ? "Профиль" : "Мои заявки"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={funLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Выйти" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* Контент */}
        <Box
          sx={{
            ml: 30,
            mt: 5,
            width: "100%",
            backgroundColor: "#f7f9fc",
            minHeight: "100vh",
            p: 4,
          }}
        >
          {!showOrders ? (
            <Paper
              sx={{
                p: 4,
                maxWidth: 800,
                margin: "0 auto",
                borderRadius: 3,
                backgroundColor: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Box display="flex" alignItems="center" gap={3} mb={4}>
                <Box position="relative">
                  <Avatar
                    sx={{ width: 80, height: 80, fontSize: 32 }}
                    src={profileImage}
                  >
                    {!profileImage && (user?.name?.[0] || "?")}
                  </Avatar>
                  {editMode && (
                    <>
                      <input
                        accept="image/*"
                        id="upload-photo"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                      <label htmlFor="upload-photo">
                        <IconButton
                          color="primary"
                          component="span"
                          sx={{
                            position: "absolute",
                            bottom: -6,
                            right: -6,
                            background: "#fff",
                            border: "1px solid #ccc",
                            backgroundColor: "#fff",
                            borderColor: "#f79e4a",
                            color: "#f79e4a",
                          }}
                        >
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      </label>
                    </>
                  )}
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {user.surname} {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Личная информация и настройки
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {["surname", "name", "patronymic", "phone", "email"].map(
                  (field) => (
                    <Grid item xs={12} sm={6} key={field}>
                      <TextField
                        fullWidth
                        label={
                          field === "surname"
                            ? "Фамилия"
                            : field === "name"
                            ? "Имя"
                            : field === "patronymic"
                            ? "Отчество"
                            : "Телефон"
                        }
                        name={field}
                        value={editedUser[field]}
                        onChange={handleChange}
                        disabled={!editMode}
                        variant="outlined"
                      />
                    </Grid>
                  )
                )}
              </Grid>

              <Box mt={4} display="flex" gap={2}>
                {editMode ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{
                        backgroundColor: "#f79e4a",
                      }}
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        backgroundColor: "#fff",
                        borderColor: "#f79e4a",
                        color: "#f79e4a",
                      }}
                    >
                      Отменить
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setEditMode(true)}
                    sx={{
                      backgroundColor: "#f79e4a",
                    }}
                  >
                    Редактировать
                  </Button>
                )}
              </Box>
            </Paper>
          ) : (
            <Box sx={{ px: 4, paddingLeft: "120px !important" }}>
              <Typography variant="h5" mb={3} fontWeight="bold">
                Мои заявки
              </Typography>
              {orders.length === 0 ? (
                <Typography color="text.secondary">Заявок пока нет.</Typography>
              ) : (
                orders.map((order) => (
                  <Paper
                    key={order.id}
                    sx={{
                      p: 3,
                      mb: 3,
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      borderLeft: "4px solid #f79e4a",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {order.eventType}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          Клиент: {order.client.clientName}
                        </Typography>
                        <Typography>
                          Почта: {order.client.clientEmail}
                        </Typography>
                        <Typography>
                          Телефон: {order.client.clientPhone}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography>
                          Дата:{" "}
                          {new Date(order.eventStartDate).toLocaleString()}
                        </Typography>
                        <Typography>Людей: {order.numberOfPeople}</Typography>
                        <Typography>Бюджет: {order.budget} ₽</Typography>
                        <Typography>
                          Доставка:{" "}
                          {order.deliveryMethod === "pickup"
                            ? "Самовывоз"
                            : order.deliveryAddress}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <Typography fontWeight="bold" gutterBottom>
                        Блюда:
                      </Typography>
                      <ul style={{ marginTop: 0 }}>
                        {order.dishes.map((dish) => (
                          <li key={dish.id}>
                            {dish.name} — {dish.quantity} шт. ({dish.price} ₽)
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Profile;
