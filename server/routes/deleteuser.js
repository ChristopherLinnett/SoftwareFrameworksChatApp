module.exports = (app, dummyData, fs)=> {
    app.post("/admin/deleteuser", (req, res) => {
        username = req.body.user;
        delete dummyData['users'][`${username}`]
        var testWrite = fs.writeFileSync('./dummydb.json', JSON.stringify(dummyData))
        res.send({ success: true });
      });
      
      
}