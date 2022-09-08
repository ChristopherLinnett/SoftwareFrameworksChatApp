const fs = require("fs");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require('uuid');
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

/* Connecting to the socket.js file. */
socket.connect(io, PORT);

/* Listening for a connection on port 3000. */
server.listen(http, PORT);

var usercheck = require('./routes/usercheck')(app, fs, sendAccess);
var auth = require('./routes/auth')(app, fs, sendAccess);
var newuser = require('./routes/newuser')(app,fs);
var deleteuser = require('./routes/deleteuser')(app,fs);
var updaterole = require('./routes/updaterole')(app,fs);
var getgroups = require('./routes/getgroups')(app,fs);
var inviteremove = require('./routes/addremovegroup')(app,fs);
var newordeletegroup = require('./routes/newordeletegroup')(app,fs,uuidv4);
var newordeleteroom = require('./routes/newordeleteroom')(app,fs,uuidv4);



/**
 * It takes a userID and a database, and returns an object containing the groups and rooms that the
 * user has access to
 * @param userID - The user's ID
 * @param db - the database
 * @returns An object with a groups property that is an array of objects. Each object in the array has
 * a name, id, and rooms property. The rooms property is an array of objects. Each object in the rooms
 * array has a name and id property.
 */
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