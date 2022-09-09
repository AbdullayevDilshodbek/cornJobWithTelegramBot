const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config({ path: './.env' })
app.use(express.static(__dirname + '/public'));
// Cron-job with bot
require('./cron/main');

// Socket
const iO = require('./socket/socket')
io.on('connection', (socket) => iO.socketIO(socket, io));

// routes
app.get('/test-socket', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/', (req,res) => {
    res.send(`Server is working ${new Date()}`)
})

// server
const host = (process.env.SELF_URL).slice(7,20);
const server = http.listen(process.env.PORT || 5000,host, () => {
    const port = server.address().port;
    console.log(`Server is working on port ${port}`);
});
