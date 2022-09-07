module.exports = (app, fs, sendAccess) => {
  app.post("/auth", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    username = req.body.username;
    password = req.body.password;
    if (dummyData.users[username]) {
      savedUser = dummyData.users[username];
      if (password == savedUser.password) {
        if (dummyData.superUsers[`${savedUser.ID}`]) {
          role = "superuser";
        } else {
          if (dummyData.groupUsers[`${savedUser.ID}`]) {
            role = "groupuser";
          } else {
            role = "user";
          }
        }
        accessInfo = sendAccess(savedUser.ID, dummyData);
        return res.send({
          username: savedUser.username,
          id: savedUser.ID,
          email: savedUser.email,
          role: role,
          access: accessInfo,
          loginSuccess: true,
        });
      }
    }

    res.send({ loginSuccess: false });
  });
};
