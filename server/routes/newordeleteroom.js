module.exports = (app, fs,uuidv4) => {
  app.post("/admin/newordeleteroom", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    roomName = req.body.roomName;
    console.log(roomName)
    groupid = req.body.groupid;
    add = req.body.add;
    var allid = dummyData.groups.map((group)=>{return group.id});

    if (add) {
      groupIndex = allid.indexOf(groupid);
      roomid = uuidv4();

      dummyData.groups[groupIndex].rooms.push({name: roomName, id: roomid, users : {}});
      fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
      return res.send({success: true});
    } else {
      groupid = req.body.groupid
      roomid = req.body.roomid
      
      var allrooms = dummyData.groups[groupIndex].rooms.map((room)=>{return room.id})
      roomIndex = allrooms.indexOf(roomid)
      dummyData.groups[groupIndex].rooms.splice(roomIndex,1);
      fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
      return res.send({success: true});
  }
    });
}

