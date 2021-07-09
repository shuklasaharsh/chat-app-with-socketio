const socket = io()

socket.on('countUpdated', (response) => {
    console.log("The count has been updated", response)
})

document.querySelector('#increment').addEventListener('click', () => {
    socket.emit('increment')
})

socket.on('message', (response)=> {
    console.log(response)
})