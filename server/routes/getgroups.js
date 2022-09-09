module.exports = (app, fs)=> {
    app.get("/admin/getgroups", (req,res) => {
        dummyData = JSON.parse(fs.readFileSync('./dummydb.json'));   
        groups = dummyData.groups 
            return res.send(groups);
          });     
}