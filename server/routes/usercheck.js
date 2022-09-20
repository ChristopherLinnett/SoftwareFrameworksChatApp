module.exports = (app, db, sendAccess) => {
  app.post("/admin/usercheck", (req, res) => {
    username = req.body.username;
    let role = "user";
    usersCollection = db.collection("Users");

    usersCollection
      .find({ $or: [{ username: username }, { email: username }] })
      .toArray((err, dbres) => {
        if (dbres.length != 1) {
          return res.send({ validUser: false });
        }
        let savedUser = dbres[0];
        db.collection("GroupAdmins")
          .find({ _id: savedUser._id })
          .toArray((err, resGroup) => {
            resGroup.length == 1 ? (role = "groupuser") : role == "user";
            db.collection("SuperAdmins")
              .find({ _id: savedUser._id })
              .toArray((err, resSuper) => {
                resSuper.length == 1 ? (role = "superuser") : null;

                var accessPath = sendAccess(savedUser._id, db);
                return res.send({
                  username: savedUser.username,
                  _id: savedUser._id,
                  email: savedUser.email,
                  role: role,
                  validUser: true,
                  access: accessPath,
                });
              });
          });
      });
  });
};
