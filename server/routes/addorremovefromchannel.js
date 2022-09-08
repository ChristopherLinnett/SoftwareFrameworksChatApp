module.exports = (app, fs) => {
  app.post("/admin/inviteremoveroomuser", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    username = req.body.username;
    userid = dummyData.users[`${username}`].ID
    groupid = req.body.groupid;
    roomid = req.body.roomid
    add = req.body.add;
    grouplist = dummyData.groups.map((group)=>{return group.id})
    groupindex = grouplist.indexOf(groupid)
    roomlist = dummyData.groups[groupindex].rooms.map((room)=>{return room.id})
    roomindex = roomlist.indexOf(roomid);
        if (add) {
          dummyData.groups[groupindex].rooms[roomindex].users[`${userid}`] = username;
          fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
          return res.send({ success: true });
        }
        delete dummyData.groups[groupindex].rooms[roomindex].users[`${userid}`];
        fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
        return res.send({ success: true });
      });
    }
