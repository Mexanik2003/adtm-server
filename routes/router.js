//const Router = require('koa-router');
import Router from 'koa-router'
import {
    signupUserRoute,
    generateSignupPin,
    signinUserRoute,
    getTaskListRoute,
    generateSigninPin,
    checkAuthorization,
    logoutUser,
    editTask,
    getUserInfo,
    editUser,
    createNewTaskRoute,
    getTypeListRoute
} from '../middlewares/router.js';
let router = new Router();

// Роуты без авторизации
router.post('/signup',signupUserRoute);
router.post('/signup/pin',generateSignupPin);

router.post('/signin',signinUserRoute);
router.post('/signin/pin',generateSigninPin);

// Проверка авторизации
router.use(checkAuthorization)

// Роуты с авторизацией
router.get('/tasks', getTaskListRoute);
router.get('/tasktypes', getTypeListRoute);
router.post('/tasks/new', createNewTaskRoute);
router.post('/logout', logoutUser);
router.patch('/tasks/:id', editTask);
router.get('/user', getUserInfo);
router.patch('/user', editUser);

export {
    router
};