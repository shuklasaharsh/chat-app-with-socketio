// NPM modules
const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io')
const Filter = require('bad-words')
// Files
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socket(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        name: 'Something'
    })
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser(({id: socket.id, username, room}))
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('chat', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('chat', generateMessage(`${user.username} has joined`))
        callback('Successfully connected')
    })
    socket.on('chat', (response, callback) => {
        const filter = new Filter()
        if (filter.isProfane(response)) {
            callback('Error')
            return socket.emit('chat', generateMessage("Profanity is not accepted"))
        }
        io.to('vit').emit('chat', generateMessage(response))
        callback('Success')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user[0].room).emit('chat', generateMessage(`${user[0].username} has left`))
        }
    })


    socket.on('location', (response, callback) => {
        let sendData = `https://google.com/maps?q=${response.latitude},${response.longitude}`
        socket.broadcast.emit('sendLocation', generateLocationMessage(sendData))
        callback('Location Shared!')
    })
})


server.listen(port, () => {
    console.log('Server listening on port: ' + port)
})

