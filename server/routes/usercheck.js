module.exports = (app, dummyData) => {
  app.post("/admin/usercheck", (req, res) => {
    username = req.body.username;
    if (!username.includes("@") && dummyData.users[username]) {
      savedUser = dummyData.users[username];
      if (dummyData["superUsers"].includes(savedUser.ID)) {
        role = "superuser";
      }
      if (dummyData["groupUsers"].includes(savedUser.ID)) {
        role = "groupuser";
      }
      if (!role) {
        role = "user";
      }
      return res.send({
        username: savedUser.username,
        id: savedUser.id,
        email: savedUser.email,
        role: role,
        validUser: true,
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
        console.log('reached here')
        savedUser = dummyData.users[email[1]];
        if (dummyData["superUsers"].includes(savedUser.ID)) {
          role = "superuser";
        }
        if (dummyData["groupUsers"].includes(savedUser.ID)) {
          role = "groupuser";
        }
        if (!role) {
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
