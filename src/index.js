const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { messageStructure, generateLocationMessage } = require('./utilis/messageStructure')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utilis/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const pathDirectory = path.join(__dirname, '../public')

app.use(express.static(pathDirectory))

// server(countUpdate) -> send to client(countUpdate)
// client(increment) -> send to server(increment)
// server(countUpdate) -> send to every connected cliented(countUpdate)

io.on('connection', (socket) => {
    console.log('New web socket connection')

    // socket.emit -> emits to acctualy one connection 
    // io.emit -> emits to evry connetion 

    socket.on('join', ({ username, room }, callback) => {

        const ob = {
            id: socket.id,
            username,
            room
        }
        const { user, error } = addUser(ob)

        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('messages', messageStructure('Welcome!', 'Admin'))
        socket.to(user.room).broadcast.emit('messages', messageStructure(`${user.username} has joined`, 'Admin'))
        io.to(user.room).emit('userList', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('messageToOthers', (message, callback) => {
        //console.log(message)
        const user = getUser(socket.id)

        if (!user) {
            return callback(error)
        }

        io.to(user.room).emit('messages', messageStructure(message, user.username))
        callback('Delivered!')
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('messages', messageStructure(`${user.username} has left!`, 'Admin'))
            io.to(user.room).emit('userList', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (location, callback) => {

        const user = getUser(socket.id)

        if (!user) {
            return callback(error)
        }
        io.to(user.room).emit('locationMessage', generateLocationMessage(location, user.username))
        callback('Location shared!')
    })
})

app.use(express.static(pathDirectory))


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})