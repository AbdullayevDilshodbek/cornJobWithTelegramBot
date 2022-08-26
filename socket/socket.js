module.exports.socketIO = (socket, io) => {
    // test u-n
    socket.on('chat_message', (msg) => {
        io.emit('chat_message', msg);
    });

    // bosh kassirni `main_cashbox` room ga join qilish
    socket.on('join_main_cashbox', (msg) => {
        const { app_id } = msg;
        socket.join(`main_cashbox_${app_id}`)
        io.emit('chat_message', "salom123");
    })

    // kassadan kassaga pul o'tganda `main_cashbox` room dagilarga habar berish
    socket.on("transaction", (msg) => {
        const { app_id } = msg;
        io.to(`main_cashbox_${app_id}`).emit(`wait_transaction`, msg)
    })
}