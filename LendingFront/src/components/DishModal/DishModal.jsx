import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Divider,
  List,
  ListItem,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { GetAllDish } from "../../API/ApiRequest";

const DishModal = ({
  open,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  cartItems,
  onSaveCart,
}) => {
  const [dishesByCategory, setDishesByCategory] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      GetAllDish().then((res) => {
        const grouped = {};
        res.data?.forEach((dish) => {
          if (!grouped[dish.categoryName]) {
            grouped[dish.categoryName] = [];
          }
          grouped[dish.categoryName].push(dish);
        });
        setDishesByCategory(grouped);
      });
    }
  }, [open]);

  const isInCart = (id) => cartItems.some((item) => item.id === id);

  const handleQuantityChange = (id, quantity) => {
    const qty = Math.min(100, Math.max(1, Number(quantity)));
    onUpdateQuantity(id, qty);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent sx={{ display: "flex", height: "70vh", p: 0 }}>
        {/* Корзина */}
        <Box
          sx={{
            width: "300px",
            p: 2,
            borderRight: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">Корзина</Typography>
          <Divider sx={{ mb: 1, mt: 1 }} />
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {cartItems.length === 0 ? (
              <Typography variant="body2">Корзина пуста</Typography>
            ) : (
              <List dense>
                {cartItems.map((item) => (
                  <ListItem
                    key={item.id}
                    alignItems="flex-start"
                    sx={{ alignItems: "flex-start" }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onRemoveFromCart(item.id)}
                        >
                          ✕
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Цена: {item.price} ₽
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Кол-во:
                        </Typography>
                        <TextField
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          inputProps={{ min: 1, max: 100 }}
                          sx={{ width: 60 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5, mb: 2 }}>
                        Сумма: <strong>{item.price * item.quantity} ₽</strong>
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1">
              Итого: <strong>{getTotalPrice()} ₽</strong>
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onSaveCart}
            sx={{
              mt: 1,
              backgroundColor: "#f79e4a",
            }}
          >
            Сохранить корзину
          </Button>
        </Box>

        {/* Каталог */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          <DialogTitle
            sx={{
              position: "sticky",
              top: "-20px",
              backgroundColor: "#fff",
              zIndex: 1,
            }}
          >
            Каталог блюд и корзина
            <TextField
              label="Поиск блюда"
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </DialogTitle>

          {Object.entries(dishesByCategory)
            .map(([category, dishes]) => {
              const filteredDishes = dishes.filter((dish) =>
                `${dish.name} ${dish.description}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              );
              return { category, dishes: filteredDishes };
            })
            .filter(({ dishes }) => dishes.length > 0)
            .map(({ category, dishes }) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {category}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {dishes.map((dish) => (
                    <Card
                      key={dish.id}
                      sx={{
                        width: "250px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {dish.imageUrl && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={dish.imageUrl}
                          alt={dish.name}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {dish.name}
                        </Typography>
                        <Typography variant="body2">
                          {dish.description}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>{dish.price} ₽</strong>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          fullWidth
                          variant={isInCart(dish.id) ? "outlined" : "contained"}
                          color={isInCart(dish.id) ? "error" : "primary"}
                          sx={{
                            mt: 1,
                            backgroundColor: isInCart(dish.id)
                              ? "#fff"
                              : "#f79e4a",
                          }}
                          onClick={() =>
                            isInCart(dish.id)
                              ? onRemoveFromCart(dish.id)
                              : onAddToCart({ ...dish, quantity: 1 })
                          }
                        >
                          {isInCart(dish.id) ? "Удалить" : "Добавить"}
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              </Box>
            ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DishModal;
