import OrderClientDto from './order-client-dto.js';

export default class ClientDto {
    id;
    clientName;
    clientEmail;
    clientPhone;
    order;

    constructor(model) {
        this.id = model.id;
        this.clientName = model.clientName;
        this.clientEmail = model.clientEmail;
        this.clientPhone = model.clientPhone;
        this.orders = model.Orders ? model.Orders.map(order => new OrderClientDto(order)) : []; // Изменено
    }
}
