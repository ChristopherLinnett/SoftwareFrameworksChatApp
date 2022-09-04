module.exports = (app, dummyData)=> {
    app.post("/auth", (req, res) => {
        username = req.body.username;
        password = req.body.password;
        if (dummyData.users[username]) {
          savedUser = dummyData.users[username];
          if (password == savedUser.password) {
            return res.send({
              username: savedUser.username,
              id: savedUser.id,
              email: savedUser.email,
              loginSuccess: true,
            });
          }
        }
      
        res.send({ loginSuccess: false });
      });
      
      
}