module.exports = (app, db) => {
  app.post("/admin/inviteremoveroomuser", (req, res) => {
    username = req.body.username;
    db.collection("Users").find({'username': username}).toArray().then((userArray)=>{
      userid = userArray[0].id
      groupid = req.body.groupid;
      roomid = req.body.roomid
      add = req.body.add;
        if (add) {
          
          db.collection("Groups").updateOne({"id": groupid,"rooms.id": roomid},{$push: {"rooms.$.users": userid}
          }).then((data)=>{
            return res.send({ success: true, userid: userid});
          })
        } else {
        db.collection("Groups").updateOne({"id": groupid,"rooms.id": roomid},{$pull: {"rooms.$.users": userid}}).then((data)=>{
          console.log(data)
          return res.send({ success: true, userid: userid });
        })
      }
      });
    })
    }
