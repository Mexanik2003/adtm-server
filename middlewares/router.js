//const { getLessonsList, createLessons} = require('../db');

import NotFoundError from "../errors/not-found-error.js";
import { sendMsgToTelegramId } from "./tg-api.js";
import { autorizeUser, createUser } from "./user.js";


// const getData = async (ctx, next) =>  {
//     // const result = await getLessonsList(ctx.request.query);
//     const result = {status: 200, data: ctx.request.query} 
//     ctx.status = result.status;
//     ctx.body = result.data;
//     next();
// }

const createUserRoute = async (ctx, next) =>  {
    const result = await createUser(ctx.request.body)
    ctx.status = result.status;
    ctx.body = result.data;
    //console.log(ctx);
    next();
}

const generatePin = async (ctx, next) =>  {
    const rnd = Math.round(1000+8999*Math.random());
    const result = await sendMsgToTelegramId(ctx.request.body.telegram_id,rnd)
    ctx.status = 200;
    ctx.body = rnd;
    next();
}

const signinUserRoute = async (ctx, next) =>  {
    //const rnd = Math.round(1000+8999*Math.random());
    //const result = await sendMsgToTelegramId(ctx.request.body.telegram_id,rnd)
    // console.log({email: ctx.request.body.email, pin: ctx.request.body.pin});
    const jwt = await autorizeUser(ctx.request.body.email, ctx.request.body.pin);
    ctx.status = 200;
    ctx.body = jwt;
    next();
}


// const setData = async (ctx, next) =>  {
//     // const result = await createLessons(ctx.request.body);
//     const result = {status: 200} 
//     ctx.status = result.status;
//     ctx.body = result.data;
//     next();
// }

export {
    createUserRoute,
    generatePin,
    signinUserRoute
}
