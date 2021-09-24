import { addUser, getUserParams, getUserInfo, setJwt, updateUser, isUserAuthorized } from "../models/db.js";
import jwt from 'jsonwebtoken'


async function createUser(query) {
    const jwtToken = jwt.sign({ text: `${query.email}+${query.pin}+${Date.now()}`}, process.env.JWT_SECRET);
    return await addUser({...query, jwt: jwtToken});
}

function autorizeUser(email,pin) {
    if (email && pin) {
        return getUserInfo(email,pin)
        .then((user) => {
            if (user) {

                // console.log(user);
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

function savePinToUser(email, pin) {
    return updateUser(email,{pin})
}

async function checkUserSignedIn(userId, jwt) {
    return await isUserAuthorized(userId, jwt);
}

export { 
    createUser,
    autorizeUser,
    savePinToUser,
    checkUserSignedIn
};