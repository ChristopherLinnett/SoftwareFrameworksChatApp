module.exports = (app, fs,uuidv4) => {
  app.post("/admin/newordeletegroup", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    groupname = req.body.groupName;
    add = req.body.add;
    if (add) {
      groupid = uuidv4();
      console.log(groupid)
      dummyData.groups.push({name: groupname, id: groupid, users : {},rooms: [], assistants: []});
      fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
      return res.send({success: true});
    } else {
      groupid = req.body.id
      var allid = dummyData.groups.map((group)=>{return group.id});
      groupindex = allid.indexOf(groupid);
      dummyData.groups.splice(groupindex,1);
      fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
      return res.send({success: true});
  }
    });
}

