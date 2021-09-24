import { getTasks, isUserAuthorized } from "../models/db.js"

async function getTaskList (userId) {
    return await getTasks(userId);
    
}

export { getTaskList }