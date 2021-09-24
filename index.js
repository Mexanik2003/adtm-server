import dotenv from 'dotenv'
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import TeleBot  from 'telebot';
import { onGetTelegramCallback, onGetTelegramMsg } from './middlewares/tg-api.js';
import { router } from './routes/router.js';
import cors from 'koa-cors';
const { koaCors } = cors;

dotenv.config()

let app = new Koa();
app.use(bodyParser());
app.use(router.routes())
const server = app.listen(process.env.PORT);

//app.use(router.allowedMethods());
app.use(cors({options: {
    origin: false
}}));
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.on('callbackQuery', (msg) => {
    console.log(msg);
    onGetTelegramCallback(msg)
    .then(answer => {
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
bot.on('text', (msg) => {
    //console.log(msg)

    try {
        onGetTelegramMsg(msg)
        .then((answer) => {
            console.log(answer);
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