import dotenv from 'dotenv'
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import TeleBot  from 'telebot';
import { onGetTelegramMsg } from './middlewares/tg-api.js';
import { router } from './routes/router.js';

dotenv.config()

let app = new Koa();
app.use(bodyParser());
app.use(router.routes())
const server = app.listen(process.env.PORT);

//app.use(router.allowedMethods());
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
bot.on('text', (msg) => {
    console.log(msg)
    onGetTelegramMsg(msg)
    .then((answer) => {
        msg.reply.text(answer)
    })
});
bot.start();

export default server; // для тестирования