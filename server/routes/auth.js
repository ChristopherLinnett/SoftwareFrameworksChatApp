module.exports = (app, db, sendAccess) => {
  app.post("/auth", (req, res) => {
    username = req.body.username;
    password = req.body.password;
    userCollection = db.collection("Users")
    userCollection.find({username: username, password: password}).toArray((err, docs)=>{

      if (err) {
        return res.send(error)
      }
      if (docs.length!=1){return res.send({loginSuccess: false})}
      savedUser = docs[0]
      let role;
      superAdminCollection = db.collection('SuperAdmins')
      superAdminCollection.find({_id: savedUser._id}).toArray((err,docs)=>{
        if (err) {return res.send(err)}
        if (docs.length > 0){
          role = "superuser"
        }
        else {
          groupAdminCollection = db.collection('GroupAdmins')
          groupAdminCollection.find({_id: savedUser._id}).toArray((err,docs)=>{
            if (err) {return res.send(err)}
            if (docs.length > 0){
              role = "groupuser"
            }
            else {role = "user"}
        })
      }
    })
        accessInfo = sendAccess(savedUser._id, db);
        return res.send({
          username: savedUser.username,
          id: savedUser._id,
          email: savedUser.email,
          role: role,
          access: accessInfo,
          loginSuccess: true,
        });
    })
  });
}

