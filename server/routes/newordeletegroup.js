module.exports = (app, db, uuid) => {
  app.post("/admin/newordeletegroup", (req, res) => {
    groupname = req.body.groupName;
    add = req.body.add;

    if (add) {
      id = uuid()
      db.collection("Groups").insertOne({id: id, name: groupname, users : [],rooms: [], assistants: []})
      return res.send({success: true});
    }
    groupid = req.body.id
      db.collection("Groups").findOneAndDelete({'id': groupid})
      return res.send({success: true});
    });
}

