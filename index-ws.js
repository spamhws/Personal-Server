//ssh spamhws@159.203.60.255

const { log } = require('console')
const express = require('express')
const server = require("http").createServer()
const app = express()

const PORT = 3001

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname })
})

server.on('request', app)
server.listen(PORT, function () {
    console.log(`Listening on ${PORT}`)
}
)

/** Begin Websockets **/
const WebsocketServer = require('ws').Server;
const wss = new WebsocketServer({ server: server })

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size
    console.log(`New client connected. Total: ${numClients} clients.`)

    wss.broadcast(`Current Visitors:  ${numClients}`)

    ws.readyState === ws.OPEN && ws.send('Welcome to my server!')

    ws.on('close', function close() {
        wss.broadcast(`Client disconnected. Currently: ${numClients} clients connected.`)
        console.log('A client has disconnected');
    })
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data)
    })
}