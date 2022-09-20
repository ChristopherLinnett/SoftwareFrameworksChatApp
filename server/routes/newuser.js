const { randomUUID } = require("crypto");

module.exports = (app, db)=> {
    app.post("/admin/newuser", (req, res) => {
        userCollection = db.collection("Users")
        username = req.body.username;
        email = req.body.email
        password = username
        newUser = {username: username, email: email, password: password}
        userCollection.insertOne(newUser, (err, result)=>{
          console.log(res)
        })
        res.send({ success: true });
      });
      
      
}