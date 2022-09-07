module.exports = (app, fs)=> {
    app.get("/admin/getgroups", (req,res) => {
      console.log('accessed endpoint')
        dummyData = JSON.parse(fs.readFileSync('./dummydb.json'));   
        groups = dummyData.groups 
            return res.send(groups);
          });     
}