const express = require('express');
const app = express();
var cors = require('cors');
var http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
    }
});
const socket = require ('./socket.js');
const server = require('./listen.js')

const PORT = 3000;


app.use(cors());

socket.connect(io,PORT);

server.listen(http, PORT);



