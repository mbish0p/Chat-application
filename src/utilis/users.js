const users = []

const addUser = ({ id, username, room }) => {

    // Clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validation get object 
    if (username === "" || room === "") {
        return {
            error: 'No specified username or room'
        }
    }

    //Validation username
    const isExist = users.find((user) => {
        return (user.room === room && user.username === username)
    })

    if (isExist) {
        return {
            error: 'User with that name already exist'
        }
    }

    //add to array
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {

    const index = users.findIndex((user) => {
        return (user.id === id)
    })


    if (index === -1) {
        return {
            error: 'No user with this id'
        }
    }

    return users.splice(index, 1)[0]
}

const getUser = (id) => {

    const user = users.find((user) => {
        return (user.id === id)
    })

    return user
}

const getUsersInRoom = (room) => {

    console.log(room)
    //room = room.trim().toLowerCase()

    const usersInRoom = []

    users.forEach((user) => {
        if (user.room === room) {
            usersInRoom.push(user)
        }
    })

    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}