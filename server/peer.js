const fs = require('fs');
const { PeerServer } = require('peer');
PORT = 3000
const peerServer = PeerServer({
    port: PORT
});
console.log(`peer service active on ${PORT}`)