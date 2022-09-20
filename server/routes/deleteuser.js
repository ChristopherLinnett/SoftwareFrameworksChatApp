module.exports = (app, db)=> {
    app.post("/admin/deleteuser", (req, res) => {
        db.collection("Users").findOneAndDelete({username: username})
        res.send({ success: true });
      });
      
      
}