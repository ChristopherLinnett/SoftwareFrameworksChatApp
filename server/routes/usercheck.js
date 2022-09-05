module.exports = (app, dummyData) => {
    app.post("/admin/usercheck", (req, res) => {
  username = req.body.username;
  if (!username.includes("@") && dummyData.users[username]) {
    savedUser = dummyData.users[username];
      return res.send({
        username: savedUser.username,
        id: savedUser.id,
        email: savedUser.email,
        validUser: true,
      });
  }
  processList = Object.keys(dummyData.users).map((username)=>{return dummyData.users[username]})
  emailList = processList.map((userprofile)=>{return [userprofile.email, userprofile.username]})
  for (let email of emailList) {
    if (username == email[0]) {
      savedUser = dummyData.users[email[1]];
      return res.send({
        username: savedUser.username,
        id: savedUser.id,
        email: savedUser.email,
        validUser: true,
      });
    }
  }
  res.send({ validUser: false });
});
}