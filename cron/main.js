require('dotenv').config({ path: '../.env' })

const { Telegraf } = require('../node_modules/telegraf')
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)
const backup = require('./backup');
const download = require('./download-backup');
const reload = require('./self-request');

    // xxxx-xx-xx-i vaqt formatli message dan xisobtni serverdan bot ga yulklash
bot.on('message', download.loadBackup());

// belgilangan vaqtda tovar qoldig'ini backup qilish
backup.backupProductsResidual()

// check server running => send message to admin
reload.selfRequest();
reload.checkServer();

bot.start((ctx) => ctx.reply(ctx))
bot.launch()

module.exports;