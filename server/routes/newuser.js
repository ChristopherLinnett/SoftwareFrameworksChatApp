module.exports = (app, dummyData, fs)=> {
    app.post("/admin/newuser", (req, res) => {
        console.log('received request')
        username = req.body.username;
        email = req.body.email
        password = username
        newUser = {username: username, email: email, ID: Object.keys(dummyData['users']).length+1, password: password}
        dummyData.users[`${username}`] = newUser
        var testWrite = fs.writeFileSync('./dummydb.json', JSON.stringify(dummyData))

        res.send({ success: true });
      });
      
      
}