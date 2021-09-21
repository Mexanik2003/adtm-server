import { getUserParams } from "../models/db.js";
import NotFoundError from '../errors/not-found-error.js';
import dotenv from 'dotenv'

import TeleBot  from 'telebot';

dotenv.config()
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
let user = {};

function onGetTelegramMsg(msg)  {
    return ValidateUser(msg.from.id)
    .then(isValidatedUser => {
        if (isValidatedUser) {
            switch(msg.text) {
                case '/start': 
                    return `Ваш идентификатор для регистрации:\r\n<b>${msg.from.id}</b>`
                case '/user': 
                    return JSON.stringify(user)


                default:
                    return JSON.stringify(msg)


            }
        } else {
            return `Пользователь не зарегистрирован. Ваш идентификатор для регистрации:\r\n${msg.from.id}`
        }

    })
}

function ValidateUser(telegramid = 0, jwt="") {
    return getUserParams(telegramid)
    .then((results) => {
        user = results;
        if (results && telegramid === results.telegram_id) {
            return true
        } else {
            return false;
        }
    })
    .catch((error) => {
        return false;
        //throw Error('User validation error')
    })
}

function sendMsgToTelegramId(telegram_id,text) {
    console.log({telegram_id,text})
    bot.sendMessage(telegram_id, text)
}

export {
    onGetTelegramMsg,
    sendMsgToTelegramId
}

