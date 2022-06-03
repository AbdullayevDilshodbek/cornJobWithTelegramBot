const schedule = require('node-schedule')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config({ path: './.env' })
const express = require('express')
const fs = require('fs')
const app = express()
const { Telegraf } = require('telegraf')
const request = require('request');
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)

const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Tashkent';

const base64encodedData = Buffer.from(process.env.S_USERNAME + ':' + process.env.S_PASSWORD).toString('base64');
const projects = [
    {
        organization: 'CityStar',
        url: 'http://192.168.13.6:1234/api/'
    }
];

app.get('/', async (req, response) => {
    try {
        let res = await fetch(`http://192.168.13.6:1234/api/backup_products_count_to_xls`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64encodedData
            },
        })
        let json_response = await res.json();
        let url = `http://192.168.13.6:1234${json_response.url}`
        let filename = url.split('/').at(-1)
        request(url).pipe(fs.createWriteStream(filename))
        // --------- Send file to telegram bot ------------------
        bot.on('message', ctx => {
            let user = ctx.update.message.from.username;
            if (user == 'don_1996') {
                ctx.replyWithDocument({
                    source: fs.readFileSync(`./${filename}`),
                    filename
                })
            } else {
                ctx.replyWithDocument({
                    source: fs.readFileSync('./.env'),
                    filename: '.env'
                })
            }
        })
        bot.start((ctx) => ctx.reply(ctx))
        bot.launch()
        // ---------------------Send message successfully---------------------------------
        response.send(filename)
    } catch (error) {
        console.log(error);
    }
})

bot.on('message', async ctx => {
    try {
        let user = ctx.update.message.from.username;
        if (user == 'don_1996') {
            let filename = ctx.update.message.text + '.xlsx'
            let url = `http://192.168.13.6:1234/storage/2022/${filename}`
            await request(url).pipe(fs.createWriteStream('report.xlsx'))
            await setTimeout(() => {
                ctx.replyWithDocument({
                    source: fs.readFileSync('report.xlsx'),
                    filename
                })
            }, 5000);
        } else {
            ctx.replyWithDocument({
                source: fs.readFileSync('./helloworld.txt'),
                filename: 'ByeWorld.txt'
            })
        }
    } catch (error) {
        console.log(error);
    }
})
bot.start((ctx) => ctx.reply(ctx))
bot.launch()

schedule.scheduleJob('30 15 15 * * *', async function () {
    for (const project of projects) {
        await fetch(`${project.url}set_serial_number`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64encodedData
            },
        }).then(res => {
            if (res.status == 200) {
                console.log('send ' + Date());
            } else {
                console.log('error 88');
            }
        });
    }
});



const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Server is working on port ${port}`);
});