module.exports = (app, db, sendAccess) => {
  app.post("/auth", (req, res) => {
    username = req.body.username;
    password = req.body.password;
    userCollection = db.collection("Users");
    let role = "user";
    userCollection
      .find({ username: username, password: password })
      .toArray((err, docs) => {
        if (err) {
          return res.send(err);
        }
        if (docs.length != 1) {
          return res.send({ loginSuccess: false });
        }
        savedUser = docs[0];
        superAdminCollection = db.collection("SuperAdmins");
        superAdminCollection.find({ id: savedUser.id }).toArray((err, docs) => {
          if (err) {
            return res.send(err);
          }
          if (docs.length > 0) {
            role = "superuser";
          }
        });
        groupAdminCollection = db.collection("GroupAdmins");
        groupAdminCollection.find({ id: savedUser.id }).toArray((err, docs) => {
          if (err) {
            return res.send(err);
          }
          if (docs.length > 0) {
            role = "groupuser";
          }
          sendAccess(savedUser.id, db).then((accessInfo)=>{
          return res.send({
            username: savedUser.username,
            profileImg: savedUser.profileImg,
            id: savedUser.id,
            email: savedUser.email,
            role: role,
            access: accessInfo,
            loginSuccess: true,
          });
        })
        });
      });
  });
};
