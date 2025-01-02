
export default class OrderClientDto {
    id;
    numberOfPeople;
    eventType;
    preferences;
    eventStartDate;
    budget;
    deliveryMethod;
    deliveryAddress;
    status;
    createdAt;

    constructor(model) {
        this.id = model.id;
        this.numberOfPeople = model.numberOfPeople;
        this.eventType = model.eventType;
        this.preferences = model.preferences;
        this.eventStartDate = model.eventStartDate;
        this.budget = model.budget;
        this.deliveryMethod = model.deliveryMethod;
        this.deliveryAddress = model.deliveryAddress;
        this.status = model.status;
        this.createdAt = model.createdAt;
    }
}
