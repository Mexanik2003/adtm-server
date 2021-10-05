import {
    getTasks,
    getTaskTypesDB,
    changeTaskDB,
    createNewTaskDB,
    changeSomeTasksDB,
    getSomeTasksDB, getTaskDB
} from "../models/db.js"

async function getTaskList (userId = null, params = {}) {
    return await getTasks(userId, params);
}

async function getTaskTypes () {
    return await getTaskTypesDB()
}

async function changeTask(id, params) {
    return await changeTaskDB(id,params)
}

async function changeSomeTasks(ids, params) {
    return await changeSomeTasksDB(ids,params)
}

async function getSomeTasks(ids, params) {
    return await getSomeTasksDB(ids,params)
}

async function getTask(id) {
    return await getTaskDB(id)
}

async function createNewTask(params) {
    return createNewTaskDB(params);
}





export { getTaskList,getTaskTypes,changeTask,createNewTask,changeSomeTasks,getSomeTasks,getTask }