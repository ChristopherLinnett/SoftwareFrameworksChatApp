module.exports = (app, fs,uuidv4) => {
  app.post("/admin/createordeleteassist", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    userid = req.body.userid;
    groupid = req.body.groupid;
    add = req.body.add;
    var allid = dummyData.groups.map((group)=>{return group.id});
    groupIndex = allid.indexOf(groupid);


    if (add) {
      dummyData.groups[groupIndex].assistants.push(userid)
      fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
      return res.send({success: true});
    } else {
      userInAssistIndex = dummyData.groups[groupIndex].assistants.indexOf(userid)
      dummyData.groups[groupIndex].assistants.splice(userInAssistIndex,1)
      fs.writeFileSync("./dummydb.json", JSON.stringify(dummyData));
      return res.send({success: true});
  }
    });
}

