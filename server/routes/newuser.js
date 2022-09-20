const { randomUUID } = require("crypto");

module.exports = (app, db)=> {
    app.post("/admin/newuser", (req, res) => {
        userCollection = db.collection("Users")
        id = randomUUID()
        username = req.body.username;
        email = req.body.email
        password = username
        newUser = {id: id, username: username, email: email, password: password}
        userCollection.insertOne(newUser, (err, result)=>{
        })
        res.send({ success: true });
      });
      
      
}