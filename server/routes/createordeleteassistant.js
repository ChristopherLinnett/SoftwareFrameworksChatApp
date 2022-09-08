module.exports = (app, fs,uuidv4) => {
  app.post("/admin/createordeleteassist", (req, res) => {
    dummyData = JSON.parse(fs.readFileSync("./dummydb.json"));
    userid = req.body.userid;
    groupid = req.body.groupid;
    add = req.body.add;
    console.log(add);

    var allid = dummyData.groups.map((group)=>{return group.id});
    groupIndex = allid.indexOf(groupid);


    if (add) {
      dummyData.groups[groupIndex].assistants.push(userid)
      console.log('added '+dummyData.groups[groupIndex].assistants[dummyData.groups[groupIndex].assistants.length-1])
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

