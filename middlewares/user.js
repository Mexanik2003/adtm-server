import {
    addUser,
    getUserInfo,
    setJwt,
    updateUserPin,
    isUserAuthorized,
    getUserParamsByTelegramIdDB,
    updateUserDB, getUserDB
} from "../models/db.js";
import jwt from 'jsonwebtoken'


async function createUser(query) {
    const jwtToken = jwt.sign({ text: `${query.email}+${query.pin}+${Date.now()}`}, process.env.JWT_SECRET);
    return await addUser({...query, jwt: jwtToken});
}

async function getUser(id) {
    return await getUserDB(id);
}

async function updateUser(id,params) {
    return await updateUserDB(id,params);
}

function autorizeUser(email,pin) {
    if (email && pin) {
        return getUserInfo(email)
        .then((user) => {
            if (user && user.pin === pin) {

                const jwtToken = jwt.sign(
                    {
                        user: `${JSON.stringify({
                            ...user,
                            pin: "",
                            jwt: ""
                        })}`
                    },
                    process.env.JWT_SECRET
                );
                return setJwt(email,jwtToken)
                    .then(() => {
                        return {
                            ...user, pin: "", jwt: jwtToken
                        }
                    })
                    .catch ((err) =>
                        { error: JSON.stringify(err)}
                    )
            } else {
                return null;
            }

        })
    } else {
        return null;
    }
}

function savePinToUser(email, pin) {
    return updateUserPin(email,{pin})
}

async function checkUserSignedIn(jwt) {
    return await isUserAuthorized(jwt);
}

async function getUserParamsByTelegramId(id) {
    return await getUserParamsByTelegramIdDB(id);
}

export { 
    createUser,
    autorizeUser,
    savePinToUser,
    checkUserSignedIn,
    getUserParamsByTelegramId,
    getUser,
    updateUser
};