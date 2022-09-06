module.exports = (app, dummyData, fs)=> {
    app.post("/admin/deleteuser", (req, res) => {
        username = req.body.user;
        delete dummyData['users'][`${username}`]
        console.log(dummyData['users'][`${username}`])
        fs.writeFileSync('./dummydb.json', JSON.stringify(dummyData))
        res.send({ success: true });
      });
      
      
}