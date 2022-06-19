import dotenv from 'dotenv'
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import TeleBot  from 'telebot';
import {checkEventTriggers, onGetTelegramCallback, onGetTelegramCmd, onGetTelegramMsg} from './middlewares/tg-api.js';
import { router } from './routes/router.js';
import cors from 'koa2-cors';
const { koaCors } = cors;

dotenv.config()

let app = new Koa();
app.use(cors({options: {
        origin: false,
        allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']
    }}));
app.use(bodyParser());

app.use(router.routes())

const server = app.listen(process.env.PORT);

//app.use(router.allowedMethods());
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

setInterval(checkEventTriggers,30000);


// Колбэки от кнопок
bot.on('callbackQuery', (msg) => {
    onGetTelegramCallback(msg)
    .then(answer => {
        console.log(JSON.stringify(answer));
        bot.answerCallbackQuery(msg.id);
        bot.sendMessage(
            msg.from.id,
            answer.text,
            { 
                replyMarkup: answer.replyMarkup,
                parseMode: 'HTML'
            }
        )
    })
});

// Команды (начинаются с "/")
bot.on(/^\/(.+)$/, (msg, props) => {
    try {
        onGetTelegramCmd(msg, props)
        .then((answer) => {
            console.log(JSON.stringify(answer));
            try {
                bot.sendMessage(
                    msg.from.id,
                    answer.text,
                    {
                        replyMarkup: answer.replyMarkup,
                        parseMode: 'HTML'
                    }
                )

            } catch (err) {
                console.log(err)
            }
        })
        .catch(err => {
            console.log(err);
        })
    } catch (err) {
        console.log(err);
    }
});

// Обычный текст (не начинается с "/")
bot.on(/^(?!\/).*/, (msg) => {

    try {
        onGetTelegramMsg(msg)
        .then((answer) => {
            console.log(JSON.stringify(answer));
            try {
                bot.sendMessage(
                    msg.from.id,
                    answer.text,
                    {
                        replyMarkup: answer.replyMarkup,
                        parseMode: 'HTML'
                    }
                )

            } catch (err) {
                console.log(err)
            }


            //msg.reply.text(answer)
        })
        .catch (err => {
            console.log(err);
        })

    } catch (err) {
        console.log(err);
    }

});
bot.start();

export default server; // для тестирования