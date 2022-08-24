const schedule = require('../node_modules/node-schedule')
const { urls, deadline } = require("../config/clients")
const requestJs = require('./request');
const projects = urls;

require('../node_modules/dotenv').config({ path: '../.env' })
const { Telegraf } = require('../node_modules/telegraf')
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)

module.exports.backupProductsResidual = () => schedule.scheduleJob(deadline, async function () {
    try {
        for await (const project of projects) {
            await requestJs.sendRequest(project.url)
            bot.telegram
                .sendMessage(process.env.ADMIN_CHAT_ID, project.organization + " dan backup qilindi")
        }
        return 0;
    } catch (error) {
        console.log(error);
    }
});