const schedule = require('node-schedule')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config()
const express = require('express')
const fs = require('fs')
const app = express()
const { Telegraf } = require('telegraf')


const rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Tashkent';

let base64encodedData = Buffer.from('don' + ':' + 'test123').toString('base64');
const projects = [
    {
        organization: 'CityStar',
        url: 'http://192.168.13.120:1234/api/'
    }
];

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
            } else if (res.status == 201) {

            }
        });
    }
});

const token_bot = 'telegram token';
const bot = new Telegraf(token_bot)
bot.on('message', ctx => {
    ctx.replyWithDocument({
        source: fs.readFileSync('./.env'),
        filename: '.env'
    })
})

bot.telegram.sendMessage(271459846,'File yuborildi')
bot.start((ctx) => ctx.reply(ctx))
bot.launch()



const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
});