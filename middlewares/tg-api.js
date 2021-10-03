import {getTaskList, getTaskTypes} from "./task.js";
import NotFoundError from '../errors/not-found-error.js';
import dotenv from 'dotenv'

import TeleBot from 'telebot';
import {getUserParamsByTelegramId} from "./user.js";

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
    let {data} = msg;
    //console.log(JSON.parse(data));
    return ValidateUser(msg.from.id)
        .then(isValidatedUser => {
            if (isValidatedUser) {
                answer = {
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
                return {text: `Пользователь не зарегистрирован. Ваш идентификатор для регистрации:\r\n${msg.from.id}`}
            }

        })

}

function onGetTelegramCmd(msg, props) {
    return ValidateUser(msg.from.id)
        .then(async (user) => {
            if (user) {
                let cmd = props.match[1];
                switch (true) {
                    case (cmd === 'start'):
                        answer = {
                            text: `Ваш идентификатор для регистрации:\r\n<b>${msg.from.id}</b>`,
                            replyMarkup: {
                                ...bot.keyboard(
                                    [
                                        [{text: "Все задачи"}, {text: "Входящие"}, {text: "Пожарные"}, {text: "Со сроком исполнения"}],
                                        [{text: "Следующие действия"}, {text: "Проекты"}, {text: "Отложенное"}, {text: "Когда-нибудь"}],
                                        [{text: "Мои настройки"}],
                                    ],
                                    {once: true, resize: true}
                                )
                            }
                        }
                        break;
                    case (Number.isInteger(+cmd)):
                        const task = await getTaskList(user.id, {filter: {column: 'id', operator: '=', value: +cmd}});
                        //console.log(task)
                        if (task[0]) {
                            answer.text = `${task[0].id}\r\n${task[0].task_type}\r\n${task[0].subject}\r\n${task[0].text}\r\n`;
                        } else {
                            answer.text = `Задача не найдена: ${cmd}`
                        }
                        break;
                    default:
                        answer.text = `Команда не распознана: ${cmd}`


                }
            } else {
                answer.text = `Пользователь не зарегистрирован. Ваш идентификатор для регистрации:\r\n${msg.from.id}`
            }
            return answer;
        });
}

function onGetTelegramMsg(msg) {
    return ValidateUser(msg.from.id)
        .then(async (user) => {
            if (user) {

                // Проверяем, не запрошен ли список задач определенной категории
                let tasklistOfType = [];
                let taskTypes = await getTaskTypes();
                let taskType = '';
                if (taskTypes.find(type => type.fullname === msg.text)) taskType = msg.text;

                switch (msg.text) {

                    case 'Все задачи':
                        tasklistOfType = await getTasksOfType(user);
                        if (tasklistOfType) {
                            answer = {
                                text: tasklistOfType,
                                replyMarkup: {}
                            }
                        } else {
                            answer = {
                                text: "Нет задач",
                                replyMarkup: {}
                            }
                        }
                        break;
                    case taskType:
                        tasklistOfType = await getTasksOfType(user, taskType);
                        if (tasklistOfType) {
                            answer = {
                                text: tasklistOfType,
                                replyMarkup: {}
                            }
                        } else {
                            answer = {
                                text: "Нет задач этой категории",
                                replyMarkup: {}
                            }
                        }
                        break;
                    case 'Мои настройки':
                        if (tasklistOfType) {
                            answer = {
                                text: `Имя: ${user.fullname}\r\nTelegram ID: ${user.telegram_id}\r\nЧасовой пояс: ${user.timezone}`,
                                replyMarkup: {}
                            }
                        } else {
                            answer = {
                                text: "Нет информации",
                                replyMarkup: {}
                            }
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

async function getTasksOfType(user, typeFullName = "") {
    let taskListSorted = await getTaskList(user.id);
    let taskTypes = await getTaskTypes();
    let answer = "";
    let showAllTypes = typeFullName ? false : true;
    taskTypes.sort((a, b) => {
        if (a.view_order > b.view_order) {
            return 1
        } else if (a.view_order < b.view_order) {
            return -1
        } else {
            return 0
        }
    })
    taskTypes.forEach((type) => {
        if (taskListSorted.find(task => task.task_type === type.name) && (type.fullname === typeFullName || showAllTypes)) {
            answer += `${type.fullname}:\r\n`
                + taskListSorted
                    .filter(item => item.task_type === type.name)
                    .map(item => `/${item.id} ${item.subject}`).join('\r\n').toString()
                + '\r\n\r\n';
            //console.log(answer)
        }
    })
    return answer;
}

function ValidateUser(telegramid = 0, jwt = "") {
    return getUserParamsByTelegramId(telegramid)
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

async function sendMsgToTelegramId(telegram_id, text) {
    try {
        return await bot.sendMessage(telegram_id, text)
    } catch (err) {
        return null;
    }
}

export {
    onGetTelegramMsg,
    sendMsgToTelegramId,
    onGetTelegramCallback,
    onGetTelegramCmd
}

