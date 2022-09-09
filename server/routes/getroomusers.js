module.exports = (app, fs)=> {
    app.post("/admin/getroomusers", (req,res) => {
      groupid = req.body.groupid
      roomid = req.body.roomid
      console.log(groupid, roomid)
        dummyData = JSON.parse(fs.readFileSync('./dummydb.json'));
        var allid = dummyData.groups.map((group)=>{return group.id});
        groupIndex = allid.indexOf(groupid);
        roomlist = dummyData.groups[groupIndex].rooms.map((room)=>{return room.id})
        roomindex = roomlist.indexOf(roomid);

        roomUserObjects = dummyData.groups[groupIndex].rooms[roomindex].users
        roomUsersArray = Object.keys(roomUserObjects)
        idsandnames = roomUsersArray.map((id)=>{return {id: id, name: roomUserObjects[`${id}`]}})
            return res.send(idsandnames);
          });     
}