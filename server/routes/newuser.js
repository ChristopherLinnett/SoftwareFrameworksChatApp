module.exports = (app, fs)=> {
    app.post("/admin/newuser", (req, res) => {
        dummyData = JSON.parse(fs.readFileSync('./dummydb.json'));    
        username = req.body.username;
        email = req.body.email
        password = username
        newUser = {username: username, email: email, ID: String(Object.keys(dummyData['users']).length+1), password: password}
        dummyData.users[`${username}`] = newUser
        fs.writeFileSync('./dummydb.json', JSON.stringify(dummyData))

        res.send({ success: true });
      });
      
      
}