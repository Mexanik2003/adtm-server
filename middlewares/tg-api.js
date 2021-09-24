import { getUserParams } from "../models/db.js";
import NotFoundError from '../errors/not-found-error.js';
import dotenv from 'dotenv'

import TeleBot  from 'telebot';
import { getTaskList } from "./task.js";

dotenv.config()
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
let user = {};

let answer = {
    text: "",
    replyMarkup: {
        // keyboard: [
        //     [{text: "Все заявки"}],
        // ],
        // one_time_keyboard: true
    }
};

function onGetTelegramCallback(msg) {
    let { data } = msg;
    console.log(JSON.parse(data));
    return ValidateUser(msg.from.id)
    .then(isValidatedUser => {
        if (isValidatedUser) {
            answer =  {
                text: data,
                replyMarkup: {...answer.replyMarkup}
            };

            
            // switch(msg.text) {
            //     case '/start': 
            //         return {
            //             text: `Ваш идентификатор для регистрации:\r\n<b>${msg.from.id}</b>`,
            //             replyMarkup: {
            //                 inline_keyboard: [
            //                     [{text: "Cards", callback_data: "Button \"Тык\" has been pressed"}],
            //                 ],
            //             }

            //         }
            //     case '/user': 
            //         return JSON.stringify(user)
            //     default:
            //         return {text: JSON.stringify(msg)}


            // }
            return answer;
        } else {
            return `Пользователь не зарегистрирован. Ваш идентификатор для регистрации:\r\n${msg.from.id}`
        }

    })
    
}

function onGetTelegramMsg(msg)  {
    return ValidateUser(msg.from.id)
    .then(async (user) => {
        if (user) {
            switch(msg.text) {
                case '/start': 
                    answer = {
                        text: `Ваш идентификатор для регистрации:\r\n<b>${msg.from.id}</b>`,
                        replyMarkup: {
                            ...bot.keyboard(
                                [
                                    [{text: "Все задачи"},{text: "Входящие"}],
                                    [{text: "Пожарные"},{text: "Со сроком"}],
                                    [{text: "Следующие действия"},{text: "Проекты"}],
                                    [{text: "Приостановленные"},{text: "Когда-нибудь"}],
                                ],
                                {once: true, resize: true}
                            )
                            
                            
                            // ...answer.replyMarkup,
                            // inline_keyboard: [
                            //     [{  
                            //         text: "Cards", 
                            //         callback_data: JSON.stringify({
                            //             telegram_id: msg.from.id,
                            //             task: 123
                            //         })
                            //     }],
                            // ],
                            //reply_markup: '{"keyboard":[[{"text":"Cards","url":"/test"}]]}'

                            // inlineKeyboard: [
                            //     [bot.inlineButton("Cards", {url: "/test"})],
                            // ],
                            // remove_keyboard: true
                        }
                    }

                    break;
                case 'Все задачи':
                    let tasklist = await getTaskList(user.id);
                    answer = {
                        text:  tasklist.map(item => item.subject).join('\r\n').toString(),
                        replyMarkup: {}
                    }
                    break;
                default:
                    answer.text = JSON.stringify(msg);


            }
            

        } else {
            answer.text = `Пользователь не зарегистрирован. Ваш идентификатор для регистрации:\r\n${msg.from.id}`
        }
        return answer;
    })
}

function ValidateUser(telegramid = 0, jwt="") {
    return getUserParams(telegramid)
    .then((results) => {
        user = results;
        if (results && telegramid === results.telegram_id) {
            return user;
        } else {
            return null;
        }
    })
    .catch((error) => {
        return null;
        //throw Error('User validation error')
    })
}

async function sendMsgToTelegramId(telegram_id,text) {
    try {
        return await bot.sendMessage(telegram_id, text)
    } catch (err) {
        return null;
    }
}

export {
    onGetTelegramMsg,
    sendMsgToTelegramId,
    onGetTelegramCallback
}

