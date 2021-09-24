//const Router = require('koa-router');
import Router from 'koa-router'
import { signupUserRoute, generateSignupPin, signinUserRoute, getTaskListRoute, generateSigninPin } from '../middlewares/router.js';
let router = new Router();

router.post('/signup',signupUserRoute);
router.post('/signup/pin',generateSignupPin);

router.post('/signin',signinUserRoute);
router.post('/signin/pin',generateSigninPin);

router.get('/tasks',getTaskListRoute);

//router.post('/signin',signUserRoute);
//router.post('/lessons', setData);

export {
    router
};