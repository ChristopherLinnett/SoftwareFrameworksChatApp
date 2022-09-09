module.exports = (app, fs)=> {
    app.post("/admin/deleteuser", (req, res) => {
        dummyData = JSON.parse(fs.readFileSync('./dummydb.json'));    
        username = req.body.user;
        delete dummyData['users'][`${username}`]
        fs.writeFileSync('./dummydb.json', JSON.stringify(dummyData))
        res.send({ success: true });
      });
      
      
}