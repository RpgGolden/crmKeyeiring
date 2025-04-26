// dtos/dish-dto.js
export default class DishDto {
    id;
    name;
    description;
    price;
    imageUrl;
    categoryId;
    categoryName;

    constructor(model, host) {
        this.id = model.id;
        this.name = model.name;
        this.description = model.description;
        this.price = model.price;
        this.imageUrl = model.image ? `${host}/${model.image}` : null; // Use the host parameter
        this.categoryId = model.categoryId;
        this.categoryName = model.Category ? model.Category.name : null;
    }
}
