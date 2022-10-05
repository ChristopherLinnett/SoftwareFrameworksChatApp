module.exports = {
    /* A function that takes two arguments, io and PORT. */
    connect: function(io, db){
        io.on('connection',(socket) => {
            socket.on('message',(message)=> {
                time = Date.now()
                downMessage = message.message
                downUser = message.user
                roomid = message.roomid
                db.collection("Users").find({username:message.user}).toArray((err, resArray)=>{
                    downImg = resArray[0].profileImg
                    io.to(roomid).emit('message', {message: downMessage, user: downUser, time: time, img: downImg ? downImg : 'None'});
                })
            })
            socket.on('image',(imageDetails)=> {
                time = Date.now()
                imgFile = imageDetails.filename
                downUser = imageDetails.user
                roomid = imageDetails.roomid
                db.collection("Users").find({username:imageDetails.user}).toArray((err, resArray)=>{
                    downImg = resArray[0].profileImg
                    io.to(roomid).emit('imageMessage', {imgFile: imgFile, user: downUser, time: time, img: downImg ? downImg : 'None'});
                })
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