const schedule = require('node-schedule')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: './.env' })
const express = require('express')
const fs = require('fs')
const app = express()
const { Telegraf } = require('telegraf')
const request = require('request');
const { text } = require('stream/consumers');
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)

const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Tashkent';

const base64encodedData = Buffer.from(process.env.S_USERNAME + ':' + process.env.S_PASSWORD).toString('base64');
const projects = [
    {
        organization: 'CityStar',
        url: 'http://192.168.13.6:1234'
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
                    source: fs.readFileSync('report.xlsx'),
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
        ctx.replyWithDocument({
            source: fs.readFileSync('./helloworld.txt'),
            filename: 'ByeWorld.txt'
        })
        console.log(error);
    }
})

// belgilangan vaqtda tovar qoldig'ini backup qilish
schedule.scheduleJob('50 22 12 * * *', async function () {
    try {
        for (const project of projects) {
            let res = await fetch(`${project.url}/api/backup_products_count_to_xls`, {
                method: 'POST',
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + base64encodedData
                },
            })
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
        return 0;
    } catch (error) {
        console.log(error);
    }
});


bot.start((ctx) => ctx.reply(ctx))
bot.launch()

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Server is working on port ${port}`);
});