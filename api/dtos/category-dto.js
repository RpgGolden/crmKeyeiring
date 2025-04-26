// dtos/category-dto.js
export default class CategoryDto {
    id;
    name;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
    }
}
