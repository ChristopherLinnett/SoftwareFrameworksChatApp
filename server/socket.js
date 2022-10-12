module.exports = {
    /* A function that takes two arguments, io and PORT. */
    connect: function(io, db){
        io.on('connection',(socket) => {
            socket.on('message',(message)=> {
                time = Date.now()
                downMessage = message.message
                downId = message.userid
                downUser = message.user
                roomid = message.roomid
                db.collection("Users").find({username:message.user}).toArray((err, resArray)=>{
                    downImg = resArray[0].profileImg
                    message = {message: downMessage, roomid: roomid, user: downUser,userid: downId, time: time, img: downImg ? downImg : 'None'}
                    io.to(roomid).emit('message', message);
                    db.collection("Messages").insertOne(message)

                })
            })
            socket.on('chatReq', (request)=>{
                io.to(request.roomid).emit('chatReq', {user: request.user , userid: request.userid, receiver: request.recipient})
            })

            socket.on('confirmChat', (req)=>{
                console.log('received confirmation')
                io.to(req.roomid).emit('confirmChat', {confirmer: req.confirmer, requester: req.requester})
            })

            socket.on('image',(imageDetails)=> {
                time = Date.now()
                imgFile = imageDetails.filename
                downUser = imageDetails.user
                roomid = imageDetails.roomid
                db.collection("Users").find({username:imageDetails.user}).toArray((err, resArray)=>{
                    downImg = resArray[0].profileImg
                    message = {imgFile: imgFile,roomid: roomid, user: downUser, time: time, img: downImg ? downImg : 'None'}
                    db.collection("Messages").insertOne({messageImg: message.imgFile, roomid: roomid, time: `${new Date(message.time).getDate()}-${new Date(message.time).getMonth()}-${new Date(message.time).getFullYear().toString().slice(2,4)}`, timeVisible: false, user: message.user, img: message.img ? message.img : null})
                    io.to(roomid).emit('imageMessage', message);

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