//var types = require('pg').types;
import types from 'pg';
import knex from 'knex'
import moment from "moment";
// override parsing date column to Date()
types.types.setTypeParser(1082, val => val);

const db = knex({
    client: 'pg',
    connection: {
      host : process.env.PGHOST,
      user : process.env.PGUSER,
      password : process.env.PGPASSWORD,
      database : process.env.PGDATABASE,
      multipleStatements: true
    }
});

async function getUserParamsByTelegramIdDB(telegramid = 0) {
    let data = {};
    const fetch = await db.select('*'). from('users').where('telegram_id',telegramid);
    return fetch[0];
}

async function addUser({telegram_id,fullname,email,jwt}) {
    if (telegram_id && fullname && email) {
        const data = {
            telegram_id,
            email,
            fullname,
            jwt
        }
        try {
            const userId = await db.insert(data).returning('id').into('users');
            if (userId) {
                return jwt;
            }
        } catch (err) {
            
        }
    } else {

    }
    return null;
}

async function updateUserPin(email, data) {
    if (email) {
        try {
            const result = await db('users')
                .returning('*')
                .where('email', email)
                .update(data);
            return result[0];
        } catch(err) {
            return null;
        }
    } else {
        return null;
    }
}

async function updateUserDB(id, params = {}) {
    try {
        if (params) {
            let query = db('users')
                .returning('*')
                .where('id', id)
                .update(params);
            // console.log(query.toSQL().toNative())
            await query;
        }
        const user = (await getUserDB(id));
        return user;
    } catch (e) {
        const user = (await getUserDB(id));
        return {
            ...user,
            error: e
        };
    }
}

async function getUserDB(id) {
    try {
        const user = await db.select('*'). from('users').where('id',id);
        return {
            ...user[0],
            jwt: ""
        };
    } catch (e) {
        return {error: e};
    }
}


async function getUserInfo(email) {
    const result = await db.select('*'). from('users').where('email',email);
    if (result) {
        return result[0];
    } else {
        return null;
    }
}

async function createNewTaskDB(params) {
    try {
        return (await db.insert(params).returning('id').into('tasks'));
    } catch (err) {
        console.log(err)
        return null;
    }
}

async function setJwt(email,jwtToken) {
    const date = new Date(Date.now());
    await db('users')
        .where('email', email)
        .update({
            'jwt': jwtToken,
            'pin': "",
            lastlogin:   moment().format
        });
    return jwtToken;
}

async function savePin(telegram_id, pin) {
    const date = new Date(Date.now());
    const data = {
        telegram_id,
        pin,
        date:   moment().format
    }
    return await db.insert(data).returning('id').into('sentpins');
}

async function isUserAuthorized(jwt) {
    const fetch = await db.select('id'). from('users').where('jwt',jwt);
    if (fetch[0]) return fetch[0].id;
    return null;
}

async function getTasks(userId, params = {}) {
    if (userId) {
        return (await db
            .select(['*',db.raw('(select name as task_type from task_types tt where tasks.type = tt.id)')])
            .from('tasks')
            .where('user_id',userId)
            .andWhere((builder) => {
                if (params && params.filter && params.filter.column && params.filter.operator && params.filter.value) {
                    builder.where(params.filter.column, params.filter.operator, params.filter.value);
                }
            }));
    } else {
        let query = db
            .select(['*',db.raw('(select name as task_type from task_types tt where tasks.type = tt.id)')])
            .from('tasks')
            .where((builder) => {
                if (params && params.filter && params.filter.column && params.filter.operator && params.filter.value) {
                    builder.where(params.filter.column, params.filter.operator, params.filter.value);
                }
            });
        // console.log(query.toSQL().toNative())
        return (await query);
    }
}

async function getTaskDB(id) {
    const query = await db
        .select(['*',db.raw('(select name as task_type from task_types tt where tasks.type = tt.id)')])
        .from('tasks')
        .where('id',id)
    return query[0];
}

async function getSomeTasksDB(ids = []) {
    const query = await db
        .select(['*',db.raw('(select name as task_type from task_types tt where tasks.type = tt.id)')])
        .from('tasks')
        .whereIn('id',ids)
    return query;
}

// Меняем одну задачу
async function changeTaskDB(id, params = {}) {
    const date = new Date(Date.now());
    try {
        const query = await db('tasks')
            .where('id', id)
            .update({
                date_modified:   moment().format,
                ...params
            });
        return (await getTaskDB(id))[0];
    } catch (e) {
        const task = await getTaskDB(id);
        return {
            ...task[0],
            error: e
        };

    }

}

// Меняем несколько задач
async function changeSomeTasksDB(ids = [], params = {}) {
    const date = new Date(Date.now());
    try {
        const query = db('tasks')
            .whereIn('id', ids)
            .update({
                date_modified:   moment().format,
                ...params
            });
        // console.log(query.toSQL().toNative())
        return await query;
    } catch (e) {
        //const task = await getTaskDB(id);
        console.log(e)
        return {
        //    ...task[0],
            error: e
        };

    }

}



async function getTaskTypesDB() {
    const fetch = await db
        .select('*')
        .from('task_types')
    return fetch;
}

export {
    getUserParamsByTelegramIdDB,
    addUser,
    getUserInfo,
    setJwt,
    getTasks,
    isUserAuthorized,
    savePin,
    updateUserPin,
    updateUserDB,
    getTaskTypesDB,
    changeTaskDB,
    changeSomeTasksDB,
    getUserDB,
    createNewTaskDB,
    getSomeTasksDB,
    getTaskDB
}


    
    