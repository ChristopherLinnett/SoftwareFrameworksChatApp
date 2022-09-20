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

const Mongo = require('mongodb');
const url = 'mongodb://localhost:27017';
Mongo.MongoClient.connect(url, {useNewUrlParser: true}, (err, client)=>{
    if (err) {return console.log(err)}
    const dbname = 'ChatApp';
    const db = client.db(dbname);

/* Connecting to the socket.js file. */
socket.connect(io, PORT);

/* Listening for a connection on port 3000. */
server.listen(http, PORT);

require('./routes/usercheck')(app, db, sendAccess);
require('./routes/auth')(app, db, sendAccess);
require('./routes/newuser')(app,db, uuidv4);
require('./routes/deleteuser')(app,db);
require('./routes/updaterole')(app,db);
require('./routes/getgroups')(app,db);
require('./routes/addremovegroup')(app,fs);
require('./routes/newordeletegroup')(app,db, uuidv4);
require('./routes/newordeleteroom')(app,fs,uuidv4);
require('./routes/addorremovefromchannel')(app,fs);
require('./routes/createordeleteassistant')(app,fs);
require('./routes/getroomusers')(app,fs);

})


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
let infoToSend = {groups: []}
let groupsCollection = db.collection("Groups")
groupsCollection.find(
  { users: { $in: [ "6328fc2e7e8b2c327a09777a"] } }
).toArray((err,res)=>{
  let newGroups = []
    infoToSend.groups = res.map((group)=>{
      var newGroup = {}
      newGroup.name = group.name
      newGroup.assistants = group.assistants
      newGroup.id = group._id
      newGroup.rooms = []
      newGroups.push(newGroup)
    })
    for (let index = 0; index>res.length ; index++){
      for (let room of res[index].rooms){
        if (!room.users[`${userID}`]){
          continue
        }
        infoToSend.groups[index].rooms.push({name: room.name, id: room.id})
      }
    }
    })
    return infoToSend
  }
