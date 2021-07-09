// NPM modules
const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io')

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

/*let count = 0
io.on('connection', (socket) => {
    console.log('something')
    socket.emit('countUpdated', count)
    socket.on('increment', ()=> {
        count++
        // socket.emit('countUpdated', count)
        io.emit('countUpdated', count)
    })
})*/

io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!')
})



server.listen(port, () => {
    console.log('Server listening on port: ' + port)
})