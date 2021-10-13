import moment from 'moment';
import {changeSomeTasks, changeTask, createNewTask, getSomeTasks, getTask, getTaskList, getTaskTypes} from "./task.js";
import NotFoundError from '../errors/not-found-error.js';
import dotenv from 'dotenv'

import TeleBot from 'telebot';
import {getUser, getUserParamsByTelegramId, updateUser} from "./user.js";

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

async function checkEventTriggers() {
    console.log(`+++ event tick +++ ${moment().format()}`);

    let taskTypes = await getTaskTypes();
    let urgentTasks = await getTaskList(
        null,
        {
            filter: {
                column: 'urgent',
                operator: '=',
                value: `true`
            }
        }
    );
    let notifyTasks = {};
    urgentTasks.map(task => {
        if (!task.trashed && !task.completed) {
            notifyTasks[task.user_id] = notifyTasks[task.user_id] ? notifyTasks[task.user_id] : {};
            notifyTasks[task.user_id].urgent = notifyTasks[task.user_id].urgent ? notifyTasks[task.user_id].urgent : []
            notifyTasks[task.user_id].urgent.push(task.id);
        }
    });
    let duedateTasks = await getTaskList(
        null,
        {
            filter: {
                column: 'type',
                operator: '=',
                value: `${taskTypes.filter(type => type.name === 'duedate')[0].id}`
            }
        }
    );
    duedateTasks.map(task => {
        if (task.deadline && !task.trashed && !task.completed) {
            let now = moment();
            let dueDate = moment(task.deadline);
            let modifiedDate = task.date_modified ? moment(task.date_modified) : moment(task.date_created);
            const diffToModified = dueDate.diff(modifiedDate,'minutes');
            const diffToNow = dueDate.diff(now,'minutes');
            // console.log(`${task.id} ${dueDate} ${modifiedDate} ${now}`)
            console.log(`${task.id} ${diffToNow} ${diffToModified} ${diffToNow/diffToModified}`)
            // По прошествии двух третей срока между последним уведомлением и дедлайном уведомляем снова
            if ((Math.abs(diffToNow/diffToModified) < 0.66 || diffToNow < 0) && (moment(task.start_notify).isBefore(moment()))) {
                notifyTasks[task.user_id] = notifyTasks[task.user_id] ? notifyTasks[task.user_id] : [];
                notifyTasks[task.user_id].duedate = notifyTasks[task.user_id].duedate ? notifyTasks[task.user_id].duedate : []
                notifyTasks[task.user_id].duedate.push(task.id);
            }
            // console.log(`${task.id} need to notify`)
        }
    });
    console.log(notifyTasks)
    await notifyUsersForTasks(notifyTasks);
}


async function onGetTelegramCallback(msg) {
    //let {data} = msg;
    //console.log(JSON.parse(data));
    answer.text = "No answer"
    return ValidateUser(msg.from.id)
        .then(async user => {
            if (user) {
                const data = JSON.parse(msg.data);
                data.action = data.action ? data.action : "";
                let task = data.task_id ? (await getTask(data.task_id)) : {};
                const types = await getTaskTypes();
                switch (data.action) {
                    case "showall":
                        const tasklistOfType = await getTasksOfType(user);
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
                    case "newtask":
                        const newTask = await createNewTask({subject: user.telegram_lastaction.subject, user_id: user.id, type: 1});
                        await updateUser(user.id, {telegram_lastaction: null});
                        if (newTask) {
                            answer = {
                                text: `Создана задача /${newTask.id} (${newTask.subject})`,
                            };
                        } else {
                            answer = {
                                text: 'Ошибка при создании задачи'
                            };

                        }
                    break;
                    case "urgent":
                        await changeTask(data.task_id, {urgent: !task.urgent})
                        if (task.urgent) {
                            answer = {text: "Пожар выключен"}
                        } else {
                            answer = {text: "Пожар включен"}
                        }
                        break;
                    case "duedate":
                        //console.log(JSON.parse((await getUser(user.id)).telegram_lastaction));
                        answer.text = `Выберите действие`;
                        answer.replyMarkup = {
                            inline_keyboard: [
                                [{text: `Указать дату/время`, callback_data: JSON.stringify({task_id: task.id, action: "changedate"})}],
                                [{text: "Сменить категорию", callback_data: JSON.stringify({task_id: task.id, action: "category"})}],
                            ],
                        }
                        break;
                    case "changedate":
                        await updateUser(user.id, {telegram_lastaction: JSON.stringify({...data, action: "setnewdate"})});
                        answer.text = "Введите дату в формате ДД.ММ.ГГГГ ЧЧ:ММ";
                        answer.replyMarkup = {};
                        break;
                    case "category":
                        //console.log(types)
                        answer.text = "Выберите категорию";
                        let keyboard = [];
                        types.map(type => keyboard.push([{
                            text: type.fullname,
                            callback_data: JSON.stringify({task_id: task.id, type_id: type.id, action: "setcategory"})
                        }]))
                        answer.replyMarkup = {
                            inline_keyboard: keyboard
                        };
                        //console.log(answer.replyMarkup)
                        break;
                    case "setcategory":
                        //console.log(data.type_id)
                        task = await changeTask(task.id, {type: data.type_id})

                        //console.log(task)
                        answer.text = `Категория изменена на "${types.filter(type => type.name === task.task_type)[0].fullname}"`
                        answer.replyMarkup = {}
                        break;
                    case "complete":
                        task = await changeTask(task.id, {completed: !task.completed})
                        answer.text = `${task.completed ? "Задача отмечена как выполненная" : "Задача возвращена в работу"}`
                        answer.replyMarkup = {}
                        break;
                    case "trash":
                        task = await changeTask(task.id, {trashed: !task.trashed})
                        answer.text = `${task.trashed ? "Задача удалена в корзину" : "Задача восстановлена"}`
                        answer.replyMarkup = {}
                        break;
                    case "startnotif":
                        let date = moment(task.deadline).subtract('hours',data.val).format("DD.MM.YYYY HH:mm")
                        task = await changeTask(task.id, {start_notify: date})

                        answer.text = `${date}`
                        answer.replyMarkup = {}


                        break;
                    default:
                        answer = {
                            text: "No action",
                        };
                }


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
                                        [{text: "Все задачи"}, /*{text: "Входящие"},  {text: "Пожарные"},{text: "Со сроком исполнения"}],
                                        [{text: "Следующие действия"}, {text: "Проекты"}, {text: "Отложенное"}, {text: "Когда-нибудь"}],
                                        [{text: "Мои настройки"}*/],
                                    ],
                                    {once: true, resize: true}
                                )
                            }
                        }
                        break;
                    case (Number.isInteger(+cmd)):
                        const task = (await getTaskList(user.id, {filter: {column: 'id', operator: '=', value: +cmd}}))[0];
                        const task_type = (await getTaskTypes()).filter(type => type.id === task.type)[0].fullname
                        if (task) {
                            answer.text = `/${task.id}\r\nКатегория: ${task_type}\r\nТема: ${task.subject}\r\nТекст: ${task.text || "-"}\r\n${task.task_type === 'duedate' ? "Срок: "+moment(task.deadline).utcOffset(user.timezone).format("DD.MM.YYYY hh:mm")+"\r\n" : ""}`;
                            answer.replyMarkup = {
                                inline_keyboard: [
                                    [{text: `${task.urgent ? '**Пожар**' : 'Пожар'}`, callback_data: JSON.stringify({task_id: task.id, action: "urgent"})},{text: `${task.task_type === 'duedate' ? '**Срок**' : 'Срок'}`, callback_data: JSON.stringify({task_id: task.id, action: "duedate"})}],
                                    [{text: `${task.completed ? '**Завершена**' : 'Завершить'}`, callback_data: JSON.stringify({task_id: task.id, action: "complete"})}, {text: `${task.trashed ? '**Удалена**' : 'В корзину'}`, callback_data: JSON.stringify({task_id: task.id, action: "trash"})}],
                                    [{text: "Сменить категорию", callback_data: JSON.stringify({task_id: task.id, action: "category"})}],
                                ],
                            }

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
                        if (user.telegram_lastaction) {
                            switch(user.telegram_lastaction.action) {
                                case "setnewdate":
                                    let newDate = moment(msg.text,"DD.MM.YYYY HH:mm", true);
                                    console.log(msg.text)
                                    console.log(newDate)
                                    //let newDate = moment(msg.text);
                                    if (newDate.isValid()) {
                                        let taskTypeId = taskTypes.filter(type => type.name === 'duedate')[0].id;
                                        let newTask = await changeTask(user.telegram_lastaction.task_id, {deadline: newDate, type: taskTypeId});
                                        await updateUser(user.id, {telegram_lastaction: null});

                                        answer = {
                                            text: `Срок выполнения установлен на ${moment(newTask.deadline).format("DD.MM.YYYY HH:mm")}\r\nНачать напоминать за:`,
                                            replyMarkup: {
                                                inline_keyboard: [
                                                    [
                                                        {text: `1 час`, callback_data: JSON.stringify({task_id: newTask.id, action: "startnotif", val: "1"})},
                                                        {text: `1 день`, callback_data: JSON.stringify({task_id: newTask.id, action: "startnotif", val: "24"})},
                                                    ],
                                                    [
                                                        {text: "2 часа", callback_data: JSON.stringify({task_id: newTask.id, action: "startnotif", val: "2"})},
                                                        {text: `2 дня`, callback_data: JSON.stringify({task_id: newTask.id, action: "startnotif", val: "48"})},
                                                    ],
                                                    [
                                                        {text: "6 часов", callback_data: JSON.stringify({task_id: newTask.id, action: "startnotif", val: "6"})},
                                                    ],
                                                ],
                                            }
                                        }
                                        console.log(newTask)
                                    } else {
                                        answer = {
                                            text: `Формат даты неверен.\r\nВведите дату в формате ДД.ММ.ГГГГ ЧЧ:ММ`,
                                            replyMarkup: {}
                                        }

                                    }

                                    break;
                                default:
                                    answer = {
                                        text: `No action`,
                                        replyMarkup: {}
                                    }

                            }
                        } else {
                            await updateUser(user.id, {telegram_lastaction: JSON.stringify({action: "newtask", subject: msg.text})});

                            answer.text = "Создать задачу из введенного сообщения?";
                            answer.replyMarkup = {
                                inline_keyboard: [
                                    [{text: "Создать новую задачу", callback_data: JSON.stringify({action: "newtask"})}],
                                    [{text: "Показать все задачи", callback_data: JSON.stringify({action: "showall"})}],
                                ],
                            }

                        }
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
    let showAllTypes = !typeFullName;
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
                    .filter(item => item.task_type === type.name && !item.trashed)
                    .map(item => `${item.urgent ? "!!!" : ""} ${item.task_type === 'duedate' ? "(СРОК)" : ""} /${item.id} ${item.subject}`).join('\r\n').toString()
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

async function notifyUsersForTasks(taskList) {
    let message = "";
    for (let userID in taskList) {
        let user = await getUser(userID);
        let lastNotify = user.last_notified ? moment(user.last_notified) : moment(0);
        if (taskList[userID].urgent) {
            message += taskList[userID].urgent.length > 1 ? "ПОЖАРНЫЕ задачи:\r\n" : "ПОЖАРНЫЕ задача:\r\n";
            const urgentTasks = await getSomeTasks(taskList[userID].urgent);
            urgentTasks.map(task => message += `/${task.id}: ${task.subject}\r\n`)
        }
        if (taskList[userID].duedate) {
            message += taskList[userID].duedate.length > 1 ? "Запланированные задачи:\r\n" : "Запланированная задача:\r\n";
            const duedateTasks = await getSomeTasks(taskList[userID].duedate);
            duedateTasks.map(task => message += `/${task.id}: ${task.subject}\r\n`)
        }
        if (Math.abs(lastNotify.diff(moment(),'minutes')) >= +user.notify_freq) {
                await bot.sendMessage(user.telegram_id, message);
                await updateUser(userID,{last_notified: moment().format()})
                if (taskList[userID].duedate) {
                    await changeSomeTasks(taskList[userID].duedate, {
                        date_modified: moment().format()
                    })
                }
                try {
            } catch (err) {
                return null;
            }
        }
    }
}


export {
    onGetTelegramMsg,
    sendMsgToTelegramId,
    onGetTelegramCallback,
    onGetTelegramCmd,
    checkEventTriggers
}

