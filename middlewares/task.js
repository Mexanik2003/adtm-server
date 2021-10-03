import {getTasks, getTaskTypesDB, isUserAuthorized} from "../models/db.js"

function getTaskList (userId, params = {}) {
    return getTasks(userId, params);
}

function getTaskTypes () {
    return getTaskTypesDB()
}





export { getTaskList,getTaskTypes }