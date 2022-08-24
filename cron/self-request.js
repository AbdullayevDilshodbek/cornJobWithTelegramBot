require('../node_modules/dotenv').config({ path: '../.env' })
const { Telegraf } = require('../node_modules/telegraf')
const token_bot = process.env.BOT_TOKEN;
const bot = new Telegraf(token_bot)

const schedule = require('../node_modules/node-schedule')
const request = require('../node_modules/request');

module.exports.checkServer = () => schedule.scheduleJob('0 0 */5 * * *', async function () {
    await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, "Salom brat")
});

module.exports.selfRequest = () => schedule.scheduleJob('*/30 * * * *', async function () {
	await request(process.env.SELF_URL, () => {
          fs.writeFileSync('./request.txt', `Server is working ${new Date()}`); 
        })
        return 0;
});