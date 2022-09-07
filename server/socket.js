module.exports = {

    /* A function that takes two arguments, io and PORT. */
    connect: function(io, PORT){
        io.on('connection',(socket) => {
            console.log(`user connection on port ${PORT}: ${socket.id}`);

            socket.on('message',(message)=> {
                time = Date.now()
                downMessage = message.message
                downUser = message.user
                io.emit('message', {message: downMessage, user: downUser, time: time});
            })
        })
    }
}