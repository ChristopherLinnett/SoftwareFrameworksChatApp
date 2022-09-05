module.exports = (app, dummyData)=> {
    app.post("/auth", (req, res) => {
        username = req.body.username;
        password = req.body.password;
        if (dummyData.users[username]) {
          savedUser = dummyData.users[username];
          if (password == savedUser.password) {
            if (dummyData['superUsers'].includes(savedUser.ID)){
              role = 'superuser'
            } else {
              if (dummyData['groupUsers'].includes(savedUser.ID)){
                role = 'groupuser'
            }
            else { role = 'user'}
          }
            return res.send({
              username: savedUser.username,
              id: savedUser.ID,
              email: savedUser.email,
              role: role,
              loginSuccess: true,
            });
          }
        }
      
        res.send({ loginSuccess: false });
      });
      
      
}