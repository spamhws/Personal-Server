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

process.on('SIGINT', () => {
    console.log('sigint');
    wss.clients.forEach((client) => {
        client.send('Server shutting down...')
        client.close()
    })
    server.close(() => {
        shutdownDB()
    })
})

/** Begin Websockets **/
const WebsocketServer = require('ws').Server;
const wss = new WebsocketServer({ server: server })

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size
    console.log(`New client connected. Total: ${numClients} clients.`)

    wss.broadcast(`Current Visitors:  ${numClients}`)

    ws.readyState === ws.OPEN && ws.send('Welcome to my server!')

    db.run(`INSERT INTO visitors (count, time) 
        VALUES (${numClients}, datetime('now'))
    `)

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

// end WebSockets
// Begin Database

const sqlite = require('sqlite3')
const db = new sqlite.Database(':memory:')

db.serialize(() => {
    db.run(`
        CREATE TABLE visitors (
            count INTEGER,
            time TEXT
        )
    `)
})

function getCount() {
    db.each('SELECT * FROM visitors', (err, row) => {
        console.log(row)
    })
}

function shutdownDB() {
    getCount()
    console.log('Closing database');
    db.close()
}