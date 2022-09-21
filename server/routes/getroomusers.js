module.exports = (app, db) => {
  app.post("/admin/getroomusers", (req, res) => {
    groupid = req.body.groupid;
    roomid = req.body.roomid;

    db.collection("Groups")
      .find({ id: groupid, "rooms.id": roomid })
      .toArray()
      .then((data) => {
        let userList;
        data[0].rooms.map((room) => {
          if (room.id == roomid) {
            userList = room.users;
          }
        });
        return userList;
      })
      .then((userList) => {
        let returnData = [];
        db.collection("Users")
          .find({ id: { $in: userList } })
          .toArray((err, usersResult) => {
            responseData = [];
            responseData = usersResult.map((user) => {
              return { id: user.id, name: user.username };
            });
            res.send(responseData);
          });
      });
  });
};
