import ClientDto from './auth-dto copy.js';

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

    constructor(model) {
        this.id = model.id;
        this.client = model.Client ? new ClientDto(model.Client) : null;
        this.numberOfPeople = model.numberOfPeople;
        this.eventType = model.eventType;
        this.preferences = model.preferences;
        this.eventStartDate = model.eventStartDate;
        this.budget = model.budget;
        this.deliveryMethod = model.deliveryMethod;
        this.deliveryAddress = model.deliveryAddress;
        this.status = model.status;
    }
}
