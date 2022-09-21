
module.exports = (app, db,uuidv4) => {
  app.post("/admin/newordeleteroom", (req, res) => {
    groupsCollection = db.collection("Groups")
    creator = req.body.creator
    roomName = req.body.roomname;
    groupid = req.body.groupid;
    add = req.body.add;
    
    if (add) {
      db.collection("Users").find({'username': creator}).toArray().then((userArray)=>{
        creatorID = userArray[0].id
        roomid = uuidv4();
        newRoom = {
        name: roomName,
        id: roomid,
        users: [creatorID]
      }
      db.collection("Groups").updateOne({id: groupid}, {$push: {rooms: newRoom}})
       res.send({success: true});
    })
    } else {
      groupid = req.body.groupid
      roomid = req.body.roomid

      db.collection("Groups").updateOne({id: groupid}, {$pull: {rooms: {id: roomid}}})
      return res.send({success: true});
  }
    });
}

