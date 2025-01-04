import { map as rolesMap } from '../config/roles.js';
export default class UserDto {
    id;
    name;
    surname;
    patronymic;
    email;
    role;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.email = model.email;
        this.role = rolesMap[model.role];
    }
}
