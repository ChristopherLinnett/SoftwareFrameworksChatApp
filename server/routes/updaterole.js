module.exports = (app, db) => {
  app.post("/admin/updaterole", (req, res) => {
        userCollection = db.collection("Users")   
        username = req.body.username
        
        userCollection.find({"username": username}).toArray((error,userRes)=>{
          user = userRes[0]

        oldRole = req.body.oldRole
        role = req.body.newRole;

        if (oldRole == 'superuser'){
          db.collection("SuperAdmins").findOneAndDelete({'_id': user._id})
        } 
        if (oldRole == 'groupuser'){
          db.collection("GroupAdmins").findOneAndDelete({'_id': user._id})
        } 
        if (role == 'superuser'){
          db.collection("SuperAdmins").insertOne({'_id': user._id})
        }
        if (role == 'groupuser'){
          db.collection("GroupAdmins").insertOne({'_id': user._id})
        }
        res.send({ success: true });
      })
      });
      
      
}