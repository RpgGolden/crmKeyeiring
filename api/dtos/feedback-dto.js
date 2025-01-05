import ClientDto from './clientDtoNew.js';
export default class FeedBackDto {
    id;
    client;
    description;
    image;
    score;
    constructor(model) {
        this.id = model.id;
        this.client = model.Client ? new ClientDto(model.Client) : null;
        this.description = model.description;
        this.image = model.image;
        this.score = model.score;
    }
}
