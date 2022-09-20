module.exports = (app, db)=> {
    app.get("/admin/getgroups", (req,res) => {
        db.collection("Groups").find({}).toArray((err, response)=>{
            return res.send(response)
        })
          });     
}