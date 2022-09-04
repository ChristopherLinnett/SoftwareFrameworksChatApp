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
const dummyData = require("./dummydb.js");

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

socket.connect(io, PORT);

server.listen(http, PORT);

var usercheck = require('./routes/usercheck')(app, dummyData);
var auth = require('./routes/auth')(app, dummyData);
