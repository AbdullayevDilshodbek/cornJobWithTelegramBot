require('../node_modules/dotenv').config({ path: '../.env' })
const { Telegraf } = require('../node_modules/telegraf')
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)

const schedule = require('../node_modules/node-schedule')

module.exports.selfRequest = () => schedule.scheduleJob('*/20 * * * *', async function () {
    await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, "Salom brat")
});