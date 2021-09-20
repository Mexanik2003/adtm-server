import { addUser, getUserParams, isUserAuthorized } from "../models/db.js";
import jwt from 'jsonwebtoken'


function createUser(query) {
    return addUser(query)
    .then((result) => {
        return {
            data: result.data,
            status: result.status,
        }
    })
}

function autorizeUser(email,pin) {
    if (email && pin) {
        if (isUserAuthorized(email,pin)) {
            return token = jwt.sign({ text: `${email}+${pin}`}, process.env.JWT_SECRET);
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export { 
    createUser,
    autorizeUser
};