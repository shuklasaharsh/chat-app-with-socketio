// NPM modules
const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io')
const Filter = require('bad-words')
// Files
const {generateMessage, generateLocationMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socket(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('', (req,res)=>{
    res.render('index', {
        name: 'Something'
    })
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({username, room}) => {
        socket.join(room)
        socket.emit('chat', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('chat', generateMessage(`${username} has joined`))
        socket.on('disconnect',() => {
            io.emit('chat', generateMessage('A user has left'))
        })
    })
    socket.on('chat', (response, callback)=> {
        const filter = new Filter()
        if(filter.isProfane(response)) {
            callback('Error')
            return socket.emit('chat', generateMessage("Profanity is not accepted"))
        }
        socket.broadcast.emit('chat', generateMessage(response))
        callback('Success')
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

