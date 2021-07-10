const socket = io()
// Elements
const $chatForm = document.querySelector('#chat-form')
const $chatFormInput = $chatForm.querySelector('input')
const $chatFormButton = $chatForm.querySelector('button')
const $sendLocationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#message-template-location').innerHTML

// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })


$chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // Disable
    $chatFormButton.setAttribute('disabled', 'disabled')

    const input = e.target.elements.message.value
    socket.emit('chat', input, (response) => {
        console.log(response.text)
        // Enable
        $chatFormButton.removeAttribute('disabled')
        $chatFormInput.value = ''
        $chatFormInput.focus()
    })
})

socket.on('chat', (response) => {
    console.log(response.text)
    const text = response.text
    const html = Mustache.render(messageTemplate, {
        messageData: text,
        createdAt: moment(response.createdAt).format('H:m a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$sendLocationButton.addEventListener(('click'), (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
        $sendLocationButton.setAttribute('disabled', 'disabled')
        return alert('location not supported')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords)
        socket.emit('location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (response) => {
            $sendLocationButton.removeAttribute('disabled')
            console.log(response)
        })
    })

})

socket.on('sendLocation', ({url, createdAt}) => {
    console.log(url)
    const html = Mustache.render(locationTemplate, {
        url,
        createdAt: moment(createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.emit('join', {username, room})