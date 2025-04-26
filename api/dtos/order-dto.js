import ClientDto from './clientDtoNew.js';
import DishDto from './dish-dto.js'; // Import the Dish DTO

export default class OrderDto {
    id;
    client;
    clientName;
    clientEmail;
    clientPhone;
    numberOfPeople;
    eventType;
    preferences;
    eventStartDate;
    budget;
    deliveryMethod;
    deliveryAddress;
    status;
    createdAt;
    dishes; // Add this field

    constructor(model) {
        this.id = model.id;
        this.client = model.User ? new ClientDto(model.User) : null;
        this.numberOfPeople = model.numberOfPeople;
        this.eventType = model.eventType;
        this.preferences = model.preferences;
        this.eventStartDate = model.eventStartDate;
        this.budget = model.budget;
        this.deliveryMethod = model.deliveryMethod;
        this.deliveryAddress = model.deliveryAddress;
        this.status = model.status;
        this.createdAt = model.createdAt;
        this.dishes = model.Dishes
            ? model.Dishes.map(dish => ({
                  ...new DishDto(dish),
                  quantity: dish.OrderDish ? dish.OrderDish.quantity : 1, // Include quantity from the join table
              }))
            : [];
    }
}
