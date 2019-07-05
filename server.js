const express = require('express')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')

const server = express()
const port = 9000;

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
    extended: true
}))

const app = server.listen(port, function (err, result) {
    console.log('running in port http://localhost:' + port)
})

const users = [];
const io = socketIO.listen(app);
// รอการ connect จาก client
io.on('connection', client => {
    console.log('user connected')

    client.on('login', function (data) {
        console.log('a user ' + data + ' connected');
        users.push(data); 
        io.sockets.emit('datalist', users)
    });

    // เมื่อ Client ตัดการเชื่อมต่อ
    client.on('disconnect', () => {
        console.log('user disconnected')
        users.splice(users.indexOf(client), 1);
    })

    // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
    client.on('sent-message', function (message) {
        console.log('user message', message)
        io.sockets.emit(message.id, message)
    })
})

//export default server