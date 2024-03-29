const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id,username,room})=> {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if (!username || !room) {
        return {
            error: 'Username and Room are required'
        }
    }

    const existingUser = users.find((user)=> {
        return user.room===room && user.username===username
    })

    if (existingUser) {
        return  {
            error: 'Username is already taken'
        }
    }

    const user = {id, username, room}
    users.push(user)

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user)=>user.id===id)
    if (index !== -1) {
        return users.splice(index, 1)
    }
}

const getUser = (id) => {
    const index = users.findIndex((user)=> user.id===id)
    if (index !== -1) {
        return users[index]
    }
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const usersInRoom = users.filter((user)=>user.room===room)
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}