const { randomUUID } = require("crypto");

module.exports = (app, db) => {
  app.post("/admin/newordeletegroup", (req, res) => {
    groupname = req.body.groupName;
    add = req.body.add;

    if (add) {
      id = randomUUID()
      db.collection("Groups").insertOne({id: id, name: groupname, users : {},rooms: [], assistants: []})
      return res.send({success: true});
    }
    groupid = req.body.id
    db.collection("Groups").find({id: groupid}).toArray((err,testRes)=>{console.log(testRes)})
      db.collection("Groups").findOneAndDelete({'id': groupid}).then((delRes)=>{console.log(delRes)})
      return res.send({success: true});
    });
}

