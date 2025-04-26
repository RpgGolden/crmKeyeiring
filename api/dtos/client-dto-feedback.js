import FeedBackWZClientDto from './feedback-dto-wz-client.js';
import OrderClientDto from './order-client-dto.js';

export default class UserFeedBackDto {
    id;
    clientName;
    clientEmail;
    clientPhone;
    orders;
    feedbacks;

    constructor(model) {
        this.id = model.id;
        this.clientName = model.clientName;
        this.clientEmail = model.clientEmail;
        this.clientPhone = model.clientPhone;
        this.orders = model.Orders ? model.Orders.map(order => new OrderClientDto(order)) : []; // Изменено
        this.feedbacks = model.FeedBacks ? model.FeedBacks.map(feedbacks => new FeedBackWZClientDto(feedbacks)) : [];
    }
}
