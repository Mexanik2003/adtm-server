//const Router = require('koa-router');
import Router from 'koa-router'
import { createUserRoute, generatePin, signinUserRoute } from '../middlewares/router.js';
let router = new Router();

router.post('/signup',createUserRoute);
router.post('/signin',signinUserRoute);
router.post('/signup/pin',generatePin);
//router.post('/signin',signUserRoute);
//router.post('/lessons', setData);

export {
    router
};