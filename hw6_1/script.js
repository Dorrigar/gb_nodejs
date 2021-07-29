const fs = require('fs'),
    { Worker } = require('worker_threads'),
    express = require('express'),
    path = require('path'),
    url = require('url')

let app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server)

const PORT = 3000,
    hostName = 'localhost',
    baseUrl = `http://${hostName}:${PORT}/`

server.listen(PORT)

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

connections = []
io.sockets.on('connection', function(socket) {
    let path = socket.handshake.headers.referer
    connections.push(socket)
    sendUserCount(connections)
    console.log(path)

    sendMessage(path)

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1)
        sendUserCount(connections)
    })
})

function sendUserCount(count) {
    const message = "<div id=\"connectionsCount\">Программу использует пользователей: " + count.length + "</div>"
    io.sockets.emit('CONN_EVENT', {mess: message});
}

function sendMessage(path) {
    const folderPath = url.parse(path, true).query.path || __dirname
    let message = ""
    if (isFile(folderPath)) {
        let fileValue = `<div><ui><li><a href=\"${baseUrl}?path=${folderPath}/..\">..</a></li></ui></div>`
        start(folderPath)
            .then(result => {
                fileValue += `<div>${result.result}</div>`
                io.sockets.emit('SERVER_MSG', {mess: fileValue})
            })
            .catch(err => console.error(err));
    } else {
        message = "<div>" + generaleListLinks(isDirectory(folderPath) ? folderPath : __dirname) + "</div>"
        io.sockets.emit('SERVER_MSG', {mess: message})
    }
}

function start(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, './worker.js'), { workerData });

        worker.on('message', resolve);
        worker.on('error', reject);
    })
}

function generaleListLinks(folderPath) {
    const list = fs.readdirSync(folderPath)
    list.unshift("..")

    let result = "<ui>"
    list.forEach((element) => {
        const filePath = path.join(folderPath, element)
        result += `<li><a href=\"${baseUrl}?path=${filePath}\">${element}</a></li>`
    })
    result += "</div>"
    return result
}

function isFile(filePath) {
    try {
        return fs.lstatSync(filePath)?.isFile()
    } catch (error) {
        console.error(error)
    }
}

function isDirectory(filePath) {
    try {
        return fs.lstatSync(filePath)?.isDirectory()
    } catch (error) {
        console.error(error)
    }
}