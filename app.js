const express = require('express')
const app = express()

require('dotenv').config({ path: './.env' })

// Cron-job with bot
require('./cron/main');

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Server is working on port ${port}`);
});