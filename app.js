const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config({ path: './.env' })

// Cron-job with bot
require('./cron/main');

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

app.get('/test-socket', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/', (req,res) => {
    res.send(`Server is working ${new Date()}`)
})


const server = http.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Server is working on port ${port}`);
});