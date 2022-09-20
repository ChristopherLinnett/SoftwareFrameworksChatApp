module.exports = (app, db, sendAccess) => {
  app.post("/auth", (req, res) => {
    username = req.body.username;
    password = req.body.password;
    userCollection = db.collection("Users")
    let role = 'user'
    userCollection.find({username: username, password: password}).toArray((err, docs)=>{

      if (err) {
        return res.send(error)
      }
      if (docs.length!=1){return res.send({loginSuccess: false})}
      savedUser = docs[0]
      superAdminCollection = db.collection('SuperAdmins')
      superAdminCollection.find({_id: savedUser._id}).toArray((err,docs)=>{
        if (err) {return res.send(err)}
        console.log(docs)
        if (docs.length > 0){
          role = "superuser"
          console.log('settingsuperuser')
        }
        else {
          groupAdminCollection = db.collection('GroupAdmins')
          groupAdminCollection.find({_id: savedUser._id}).toArray((err,docs)=>{
            if (err) {return res.send(err)}
            if (docs.length > 0){
              role = "groupuser"
            }
        })
      }
        accessInfo = sendAccess(savedUser._id, db);
        console.log(role)
        return res.send({
          username: savedUser.username,
          id: savedUser._id,
          email: savedUser.email,
          role: role,
          access: accessInfo,
          loginSuccess: true,
        })

        });
    })
  });
}

