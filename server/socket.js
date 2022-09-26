module.exports = {
    /* A function that takes two arguments, io and PORT. */
    connect: function(io){
        io.on('connection',(socket) => {
            socket.on('message',(message)=> {
                time = Date.now()
                downMessage = message.message
                downUser = message.user
                roomid = message.roomid
                io.to(roomid).emit('message', {message: downMessage, user: downUser, time: time});
            })
            let roomid;
            let username;
            socket.on('joinroom',(roomidAndUsername)=>{
                socket.join(roomidAndUsername.roomid)
                io.to(roomidAndUsername.roomid).emit('joinnotify', `${roomidAndUsername.username} has joined the room`)
                roomid = roomidAndUsername.roomid
                username = roomidAndUsername.username

            })

            socket.on('leaveroom', (roomidAndUsername)=>{
                socket.leave(roomidAndUsername.roomid)
                io.to(roomidAndUsername.roomid).emit('leavenotify', `${roomidAndUsername.username} has left the channel`)
            })
            socket.on('disconnect', ()=>{
                socket.leave(roomid)
                io.to(roomid).emit('leavenotify', `${username} has left the channel`)
            })
            


        })
    }
}