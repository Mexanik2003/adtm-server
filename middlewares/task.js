import { getTasks, isUserAuthorized } from "../models/db.js"

async function getTaskList (userId,jwt) {
    const isAuthorized = await isUserAuthorized(userId, jwt);
    if (isAuthorized) {
        return {
            status: 200,
            data: await getTasks(userId)
        }
    } else {
        return {
            status: 401,
            data: {error: "Не авторизован"}
        }
    }
}

export { getTaskList }