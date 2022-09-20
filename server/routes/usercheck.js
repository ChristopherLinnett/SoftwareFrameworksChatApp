module.exports = (app, db, sendAccess) => {
  app.post("/admin/usercheck", (req, res) => {
    username = req.body.username;
    let role = "user";
    usersCollection = db.collection("Users");
    
    usersCollection
      .find({ $or: [{ username: username }, { email: username }] })
      .toArray((err, dbres) => {
        if (dbres.length != 1) {
          console.log(dbres)
          return res.send({ validUser: false });
        }
        console.log(dbres)
        let savedUser = dbres[0];
        superAdminCollection = db.collection("SuperAdmins");
        superAdminCollection
          .find({ _id: savedUser._id })
          .toArray((err, res) => {
            if (res.length == 1) {
              role = "superuser";
            } else {
              db.collection("GroupAdmins").find({ _id: savedUser._id }).toArray((err, res) => {
                if (res.length == 1) {
                  role = "groupuser";
                }
              });
            }
          });
      var accessPath = sendAccess(savedUser._id, db);
      return res.send({
        username: savedUser.username,
        _id: savedUser._id,
        email: savedUser.email,
        role: role,
        validUser: true,
        access: accessPath,
      });
    })
  });
};
