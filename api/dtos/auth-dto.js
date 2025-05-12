import { map as rolesMap } from '../config/roles.js';

export default class AuthDto {
    id;
    name;
    surname;
    patronymic;
    email;
    phone;
    role;

    constructor(model, isAdmin) {

        this.id = model.id;
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.email = model.email;
        this.phone = !isAdmin ? model.phone : undefined;
        this.role = rolesMap[model.role];
    }
}
