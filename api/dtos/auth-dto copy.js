export default class ClientDto {
    id;
    clientName;
    clientEmail;
    clientPhone;

    constructor(model) {
        this.id = model.id;
        this.clientName = model.clientName;
        this.clientEmail = model.clientEmail;
        this.clientPhone = model.clientPhone;
    }
}
