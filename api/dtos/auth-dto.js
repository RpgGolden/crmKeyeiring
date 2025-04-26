import { map as rolesMap } from '../config/roles.js';

export default class AuthDto {
    id;
    name;
    surname;
    patronymic;
    login;
    phone;
    role;

    constructor(model, isAdmin) {

        this.id = model.id;
        this.name = model.name;
        this.surname = model.surname;
        this.patronymic = model.patronymic;
        this.login = model.login;
        this.phone = !isAdmin ? model.phone : undefined;
        this.role = rolesMap[model.role];
    }
}
