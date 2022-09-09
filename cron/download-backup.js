const { urls } = require("../config_js/clients");
const projects = urls;

require('../node_modules/dotenv').config({ path: '../.env' })
const { Telegraf } = require('../node_modules/telegraf')
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)

const fs = require('fs')
const request = require('../node_modules/request');

// xxxx-xx-xx-i vaqt formatli message dan xisobtni serverdan bot ga yulklash
module.exports.loadBackup = () => async ctx => {
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
            console.log(url);
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
        console.log(error);
        fs.writeFileSync('./helloworld.txt', error.message);
        ctx.replyWithDocument({
            source: fs.readFileSync('./helloworld.txt'),
            filename: 'ByeWorld.txt'
        })
    }
}
