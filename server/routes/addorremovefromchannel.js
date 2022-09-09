module.exports = (app, fs) => {
  app.post("/admin/inviteremoveroomuser", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    username = req.body.username;
    if (!Object.keys(dummyData.users).includes(username)) {return res.send({success: false, message: "The name matched no users"})}
    userid = dummyData.users[`${username}`].ID
    groupid = req.body.groupid;
    roomid = req.body.roomid
    add = req.body.add;
    grouplist = dummyData.groups.map((group)=>{return group.id})
    groupindex = grouplist.indexOf(groupid)
    roomlist = dummyData.groups[groupindex].rooms.map((room)=>{return room.id})
    roomindex = roomlist.indexOf(roomid);
        if (add) {
          dummyData.groups[groupindex].users[`${userid}`] = username;
          dummyData.groups[groupindex].rooms[roomindex].users[`${userid}`] = username;
          fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
          return res.send({ success: true, userid: userid});
        }
        delete dummyData.groups[groupindex].rooms[roomindex].users[`${userid}`];
        fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
        return res.send({ success: true, userid: userid });
      });
    }
