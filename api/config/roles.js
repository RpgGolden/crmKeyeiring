import { mapObjectKeys } from '../utils/map.js';

const roles = {
    ADMINISTRATOR: 1,
    COOK: 2,
    CLIENT: 3,
};

export default roles;

export const map = mapObjectKeys(roles);
