export default class ClientDto {
    id;
    clientName;
    clientEmail;
    clientPhone;

    constructor(model) {
        this.id = model.id;
        this.clientName = model.name;
        this.clientEmail = model.email;
        this.clientPhone = model.phone;
    }
}
