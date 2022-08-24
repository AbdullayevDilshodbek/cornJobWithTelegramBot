const schedule = require('node-schedule')

const express = require('express')
const app = express()

require('dotenv').config({ path: './.env' })

const { Telegraf } = require('telegraf')
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)

const fs = require('fs')
const request = require('request');

const requestJs = require('./config/request');

const projects = [
    {
        organization: 'CityStar',
        url: 'http://192.168.13.68:1234'
    }
];

// xxxx-xx-xx-i vaqt formatli message dan xisobtni serverdan bot ga yulklash
bot.on('message', async ctx => {
    try {
        let user = ctx.update.message.from.username;
        if (user == 'don_1996') {
            let filename = (ctx.update.message.text);
            filename = filename.split('-')
            filename.pop()
            filename = filename.join('-')
            let year = filename.split('-')[0]
            let month = filename.split('-')[1]
            let index = (ctx.update.message.text)
                .split('-')
                .reverse()[0]
            let url = `${projects[index]['url']}/storage/${year}/${month}/${filename}.xlsx`
            await request(url).pipe(fs.createWriteStream('report.xlsx'))
            await setTimeout(() => {
                ctx.replyWithDocument({
                    source: 'report.xlsx',
                    filename: filename + '.xlsx'
                })
            }, 5000);
        } else {
            ctx.replyWithDocument({
                source: fs.readFileSync('./helloworld.txt'),
                filename: 'ByeWorld.txt'
            })
        }
    } catch (error) {
        fs.writeFileSync('./helloworld.txt', 'Hey there!');
        ctx.replyWithDocument({
            source: fs.readFileSync('./helloworld.txt'),
            filename: 'ByeWorld.txt'
        })
        console.log(error);
    }
})

// belgilangan vaqtda tovar qoldig'ini backup qilish
schedule.scheduleJob('50 56 18 * * *', async function () {
    try {
        for await (const project of projects) {
            let res = await requestJs.sendRequest(project.url)
            // yuklangan file ni bot ga yuborish
            res = await res.json()
            request(`${project.url}${res.url_}`).pipe(fs.createWriteStream('report.xlsx'))
            let filename = (res.url_).split('/').reverse()[0]
            await setTimeout(async () => {
                await bot.telegram.sendDocument(process.env.ADMIN_CHAT_ID,
                    {
                        source: 'report.xlsx',
                        filename
                    })
            }, 5000);
        }
        await request(process.env.SELF_URL, () => {
            console.log('gooo');
        })
        return 0;
    } catch (error) {
        console.log(error);
    }
});

// server running => send admin message
schedule.scheduleJob('*/1 * * * *', async function () {
    await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, "Salom brat")
});



app.get('/', (req,res) => {
    res.send(`Server is working ${new Date()} `)
})

bot.start((ctx) => ctx.reply(ctx))
bot.launch()

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Server is working on port ${port}`);
});