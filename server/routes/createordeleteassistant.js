module.exports = (app, db) => {
  app.post("/admin/createordeleteassist", (req, res) => {
    userid = req.body.userid;
    groupid = req.body.groupid;
    add = req.body.add;


    if (add) {
      db.collection("Groups").updateOne({id: groupid}, {$push: {'assistants': userid}}).then((data)=>{
        return res.send({success: true});
      })
    } else {
      db.collection("Groups").updateOne({id: groupid}, {$pull: {'assistants': userid}}).then((data)=>{
      return res.send({success: true});
      })
  }
    });
}

