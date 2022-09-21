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
          .find({ id: savedUser.id })
          .toArray((err, resGroup) => {
            resGroup.length == 1 ? (role = "groupuser") : role == "user";
             db.collection("SuperAdmins")
              .find({ id: savedUser.id })
              .toArray((err, resSuper) => {
                resSuper.length == 1 ? (role = "superuser") : null;
                sendAccess(savedUser.id, db).then((accessPath)=>{
                  return res.send({
                    username: savedUser.username,
                    id: savedUser.id,
                    email: savedUser.email,
                    role: role,
                    validUser: true,
                    access: accessPath,
                  });

                });
                
              });
          });
      });
  });
};
