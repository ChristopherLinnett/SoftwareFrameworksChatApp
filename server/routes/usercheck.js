module.exports = (app, fs, sendAccess) => {
  app.post("/admin/usercheck", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync('./dummydb.json'));    
    username = req.body.username;
    if (!username.includes("@") && dummyData.users[username]) {
      savedUser = dummyData.users[username];
      if (dummyData["superUsers"][savedUser.ID]) {
        role = "superuser";
      }
      if (dummyData["groupUsers"][savedUser.ID]) {
        role = "groupuser";
      }
      if (!role) {
        role = "user";
      }
      accessPath = sendAccess(savedUser.ID, dummyData)
      return res.send({
        username: savedUser.username,
        id: savedUser.ID,
        email: savedUser.email,
        role: role,
        validUser: true,
        access: accessPath
      });
    }
    processList = Object.keys(dummyData.users).map((username) => {
      return dummyData.users[username];
    });
    emailList = processList.map((userprofile) => {
      return [userprofile.email, userprofile.username];
    });
    for (let email of emailList) {
      if (username == email[0]) {
        savedUser = dummyData.users[email[1]];
        var role;
        if (dummyData.superUsers[`${savedUser.ID}`]) {
          role = "superuser";
        }
        if (dummyData.groupUsers[`${savedUser.ID}`]) {
          role = "groupuser";
        }
        if (role == undefined) {
          role = "user";
        }
        return res.send({
          username: savedUser.username,
          id: savedUser.ID,
          email: savedUser.email,
          role: role,
          validUser: true,
        });
      }
    }
    res.send({ validUser: false });
  });
};
