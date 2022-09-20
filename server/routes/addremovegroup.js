module.exports = (app, fs) => {
  app.post("/admin/inviteremoveuser", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    username = req.body.username;
    groupid = req.body.id;
    add = req.body.add;
    userID = dummyData.users[`${username}`].ID;
    for (let group of dummyData.groups) {
      if (group.id == groupid) {
        if (add) {
          group.users[`${userID}`] = username;
          fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
          return res.send({ success: true });
        }
        delete group.users[`${userID}`];
        fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
        return res.send({ success: true });
      }
    }
  });
};
