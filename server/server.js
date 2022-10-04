const fs = require("fs");
const Blob = require('buffer').Blob
const express = require("express");
const path = require('path')
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
const PORT = 80;
app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname , 'images')))
const Mongo = require('mongodb');
const url = 'mongodb://localhost:27017';
Mongo.MongoClient.connect(url, {useNewUrlParser: true}, (err, client)=>{
    if (err) {return console.log(err)}
    const dbname = 'ChatApp';
    const db = client.db(dbname);

/* Connecting to the socket.js file. */
socket.connect(io, db);

/* Listening for a connection on port 3000. */
server.listen(http, PORT);
require('./routes/getimg')(app,fs, path, Blob)
require('./routes/usercheck')(app, db, sendAccess);
require('./routes/auth')(app, db, sendAccess);
require('./routes/newuser')(app,db, uuidv4);
require('./routes/deleteuser')(app,db);
require('./routes/updaterole')(app,db);
require('./routes/getgroups')(app,db);
require('./routes/addremovegroup')(app,db);
require('./routes/newordeletegroup')(app,db, uuidv4);
require('./routes/newordeleteroom')(app,db,uuidv4);
require('./routes/addorremovefromchannel')(app,db);
require('./routes/createordeleteassistant')(app,db);
require('./routes/getroomusers')(app,db);
require('./routes/photoupload')(app,db, uuidv4);


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
async function sendAccess(userId, db){
  let myGroups

let groupsCollection = db.collection("Groups")
 myGroups = await groupsCollection.find({ users: { $in: [ userId] } }).toArray()
 return {groups: myGroups}
}
