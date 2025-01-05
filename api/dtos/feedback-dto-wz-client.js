export default class FeedBackWZClientDto {
    id;
    description;
    image;
    score;
    constructor(model) {
        this.id = model.id;
        this.description = model.description;
        this.image = model.image;
        this.score = model.score;
    }
}
