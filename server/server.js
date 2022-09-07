const fs = require("fs");
const express = require("express");
const app = express();
var cors = require("cors");
var http = require("http").Server(app);
const bodyParser = require("body-parser");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const socket = require("./socket.js");
const server = require("./listen.js");
var dummyData = fs.readFileSync('dummydb.json');
dummyData = JSON.parse(dummyData)
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

socket.connect(io, PORT);

server.listen(http, PORT);

var usercheck = require('./routes/usercheck')(app, fs, sendAccess);
var auth = require('./routes/auth')(app, fs, sendAccess);
var newuser = require('./routes/newuser')(app,fs);
var deleteuser = require('./routes/deleteuser')(app,fs);
var updaterole = require('./routes/updaterole')(app,fs);
var getgroups = require('./routes/getgroups')(app,fs);
var inviteremove = require('./routes/addremovegroup')(app,fs);



function sendAccess(userID, db){
infoToSend = {groups: []}
  for (let group of db.groups){
    if (!group.users[`${userID}`]){
      continue
    }
    infoToSend.groups.push({name: group.name, id: group.id, rooms: []})
      for (let room of group.rooms){
        if (!room.users[`${userID}`]){
          continue
        }
        infoToSend.groups[infoToSend.groups.length-1].rooms.push({name: room.name, id: room.id})
      }
  }
  return infoToSend
}