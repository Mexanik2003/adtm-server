import { addUser, getUserParams, getUserInfo, setJwt } from "../models/db.js";
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
        return getUserInfo(email,pin)
        .then((user) => {
            if (user) {

                //console.log(user);
                const jwtToken = jwt.sign({ text: `${email}+${pin}+${Date.now()}`}, process.env.JWT_SECRET);
                setJwt(email,jwtToken);
                return {
                    ...user, pin: "", jwt: jwtToken
                }
            } else {
                return null;
            }

        })
    } else {
        return null;
    }
}

export { 
    createUser,
    autorizeUser
};