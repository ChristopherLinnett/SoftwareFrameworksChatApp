const express = require('express');
const app = express();
var cors = require('cors');
var http = require('http').Server(app);
const bodyparser = require('body-parser')
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
    for (const [key, value] of Object.entries(dummyData.users)) {
        if (username && username == value.username && password == value.password){
        console.log("success")
       return res.send({username: value.username, id: value.ID, email: value.email, loginSuccess: true});
    }
}
    console.log("fail")
    res.send({loginSuccess: false});
})

