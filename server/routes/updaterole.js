module.exports = (app, db) => {
  app.post("/admin/updaterole", (req, res) => {
        userCollection = db.collection("Users")   
        username = req.body.username
        
        userCollection.find({"username": username}).toArray((error,userRes)=>{
          user = userRes[0]

        oldRole = req.body.oldRole
        role = req.body.newRole;

        if (oldRole == 'superuser'){
          db.collection("SuperAdmins").findOneAndDelete({'id': user.id})
        } 
        if (oldRole == 'groupuser'){
          db.collection("GroupAdmins").findOneAndDelete({'id': user.id})
        } 
        if (role == 'superuser'){
          db.collection("SuperAdmins").insertOne({'id': user.id})
        }
        if (role == 'groupuser'){
          db.collection("GroupAdmins").insertOne({'id': user.id})
        }
        res.send({ success: true });
      })
      });
      
      
}