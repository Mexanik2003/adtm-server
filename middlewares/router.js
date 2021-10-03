//const { getLessonsList, createLessons} = require('../db');

import NotFoundError from "../errors/not-found-error.js";
import {sendMsgToTelegramId} from "./tg-api.js";
import {autorizeUser, createUser, savePinToUser, checkUserSignedIn} from "./user.js";
import {getTaskList} from "./task.js";
import {savePin} from "../models/db.js";
import jwt from "jsonwebtoken";


// const getData = async (ctx, next) =>  {
//     // const result = await getLessonsList(ctx.request.query);
//     const result = {status: 200, data: ctx.request.query} 
//     ctx.status = result.status;
//     ctx.body = result.data;
//     next();
// }

const signupUserRoute = async (ctx, next) => {
    try {
        const jwt = await createUser(ctx.request.body);
        //console.log(jwt)
        if (jwt) {
            ctx.status = 200;
            ctx.body = {jwt: jwt};
        } else {
            ctx.status = 401;
            ctx.body = {error: "error"};
        }
    } catch (err) {
        console.log(err);
        ctx.status = 401;
        ctx.body = JSON.stringify(err);
    }
    return ctx;
}

const generateSignupPin = async (ctx, next) => {
    const rnd = Math.round(1000 + 8999 * Math.random());
    try {
        const result = await sendMsgToTelegramId(ctx.request.body.telegram_id, rnd);
        if (result) {
            ctx.status = 200;
            ctx.body = {pin: rnd};
        } else {
            ctx.status = 400;
            ctx.body = {error: 'Error sending pin, check Telegram identifier'};
        }
        //console.log(await savePin(ctx.request.body.telegram_id,rnd));
    } catch (err) {
    }
    return ctx;
}

const generateSigninPin = async (ctx, next) => {
    const rnd = Math.round(1000 + 8999 * Math.random());
    try {
        const user = await savePinToUser(ctx.request.body.email, rnd);
        if (user) {
            const msg = await sendMsgToTelegramId(user.telegram_id, rnd);
            if (msg) {
                ctx.status = 200;
                ctx.body = {ok: "New PIN sent"};
            } else {
                ctx.status = 400;
                ctx.body = {error: "Error sending pin, check Telegram identifier"};

            }
        } else {
            ctx.status = 400;
            ctx.body = {error: "User not found"};

        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = {error: JSON.stringify(err)};
    }
    return ctx;
}

const signinUserRoute = async (ctx, next) => {

    //const rnd = Math.round(1000+8999*Math.random());
    //const result = await sendMsgToTelegramId(ctx.request.body.telegram_id,rnd)
    // console.log({email: ctx.request.body.email, pin: ctx.request.body.pin});
    const user = await autorizeUser(ctx.request.body.email, ctx.request.body.pin);
    if (user) {
        ctx.status = 200;
        ctx.body = user;
    } else {
        ctx.status = 401;
        ctx.body = {error: "Not authorized"};
    }
    return ctx;
}

const logoutUser = async (ctx, next) => {
//     if (ctx.request.header.jwt) {
//         const user = (JSON.parse(jwt.decode(ctx.request.header.jwt).user));
//
//         ctx.status = 200;
//         ctx.body = user;
//     } else {
//         ctx.status = 401;
//         ctx.body = {error: "Not authorized"};
//     }
//     return ctx;
}

async function checkAuthorization(ctx, next) {
    console.log(ctx)
    const jwt = ctx.request.header.authorization ? ctx.request.header.authorization.replace('Bearer ','') : null;
    if (jwt) {
        const userId = await checkUserSignedIn(jwt);
        if (userId) {
            ctx.user_id = userId;
            await next();
        } else {
            ctx.status = 401;
            ctx.body = {error: "Not authorized (checkAuthorization route)"};
            return ctx;
        }
    } else {
        ctx.status = 401;
        ctx.body = {error: "Not authorized (Bearer JWT required)"};
        return ctx;

    }
}



async function getTaskListRoute(ctx, next) {
    const tasks = await getTaskList(ctx.user_id)
    ctx.status = 200;
    ctx.body = tasks;
    console.log(ctx.body)
}


// const setData = async (ctx, next) =>  {
//     // const result = await createLessons(ctx.request.body);
//     const result = {status: 200} 
//     ctx.status = result.status;
//     ctx.body = result.data;
//     next();
// }

export {
    signupUserRoute,
    generateSignupPin,
    generateSigninPin,
    signinUserRoute,
    getTaskListRoute,
    checkAuthorization,
    logoutUser
}
