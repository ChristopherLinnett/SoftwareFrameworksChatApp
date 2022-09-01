const express = require('express');
const app = express();
var cors = require('cors');
var http = require('http').Server(app);
const bodyParser = require('body-parser')
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
});
const socket = require ('./socket.js');
const server = require('./listen.js')
const dummyData = require('./dummydb.js');


const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

socket.connect(io,PORT);

server.listen(http, PORT);

app.post('/auth', (req,res)=>{
    username = req.body.username
    password = req.body.password
    if (dummyData.users[username]) {
        savedUser = dummyData.users[username]
        if (password == savedUser.password){
           return res.send({username: savedUser.username, id: savedUser.id, email: savedUser.email, loginSuccess: true});
    }
    }
       
    res.send({loginSuccess: false});
})

