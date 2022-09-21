module.exports = (app, db) => {
  app.post("/admin/inviteremoveuser", (req, res) => {
    username = req.body.username;
    groupid = req.body.id;
    add = req.body.add;
    userCollection = db.collection("Users")
    userCollection.find({'username': username}).toArray((err,userSearchRes)=>{
      userid = userSearchRes[0].id
        if (add){
          db.collection("Users").find({'username': username}).toArray((err, newresponse)=>{
            userid = newresponse[0].id
          db.collection("Groups").updateOne({id: groupid}, {$push: {"users":userid}})
        })
          return res.send({ success: true });
        }
        console.log('data being checked')
        console.log(groupid)
        console.log(userid)
        db.collection("Groups").updateOne({id: groupid}, {$pull: {'users': userid}})
        return res.send({success: true});

    })
  });
};
