module.exports = (app, fs) => {
  app.post("/admin/updaterole", (req, res) => {
        dummyData = JSON.parse(fs.readFileSync('./dummydb.json'));    
        username = req.body.username
        userID = dummyData.users[`${username}`].ID
        oldRole = req.body.oldRole
        role = req.body.newRole;
        if (oldRole == 'superuser'){
          delete dummyData.superUsers[`${userID}`]
        } 
        if (oldRole == 'groupuser'){
          delete dummyData.groupUsers[`${userID}`]
        } 
        if (role == 'superuser'){
        dummyData.superUsers[`${userID}`]=username
        }
        if (role == 'groupuser'){
          dummyData.groupUsers[`${userID}`]=username
        }
        fs.writeFileSync('./dummydb.json', JSON.stringify(dummyData))
        res.send({ success: true });
      });
      
      
}