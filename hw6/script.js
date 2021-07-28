var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server)

server.listen(3000)


app.get('/', function(request, respons) {
    respons.sendFile(__dirname + '/index.html');
});

// Массивы подключений и пользователей
connections = [];
users = [];

io.sockets.on('connection', function(socket) {
    // Добавление нового соединения в массив и отправка сообщения
    io.sockets.emit('NEW_CONN_EVENT', {mess: "В чате новый участник", name: "System message"});
    connections.push(socket);
    console.log("Успешное соединение");

    socket.on('disconnect', function(data) {

        // Удаления пользователя и сокета из массивов с сообщением в канал
        io.sockets.emit('SERVER_MSG', {
            mess: `${users[connections.indexOf(socket)]} вышел из чата`, name: "System message"
        })
        console.log(users[connections.indexOf(socket)] + " отключился ")
        connections.splice(connections.indexOf(socket), 1)
        users.splice(connections.indexOf(socket), 1)
    });

    socket.on('reconnecting', function(data) {
        io.sockets.emit('SERVER_MSG', {
            mess: `${users[connections.indexOf(socket)]} переподключился`, name: "System message"
        })
        console.log(users[connections.indexOf(socket)] + " переподключился")
    })

    socket.on('CLIENT_MSG', function(data) {
        //Получая сообщение о клиенте достаем оттуда имя
        users.splice(connections.indexOf(socket), 0, data.name)
        io.sockets.emit('SERVER_MSG', {mess: data.mess, name: data.name});
    })
})