module.exports = (app, db) => {
    app.post("/roomMessage", (req, res) => { 
        collection = db.collection("Messages")
        console.log(req.body.roomid)
        collection.find({roomid: req.body.roomid}).toArray((err, response)=>{
            console.log(response)
            return res.send(response.slice(-10))
    })
})
}