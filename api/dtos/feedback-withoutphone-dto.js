import ClientWZPhoneDto from "./client-dto-wz-phone.js";
export default class FeedBackWZPhoneDto {
    id;
    client;
    description;
    image;
    score;
    constructor(model) {
        this.id = model.id;
        this.client = model.Client ? new ClientWZPhoneDto(model.Client) : null;
        this.description = model.description;
        this.image = model.image;
        this.score = model.score;
    }
}
