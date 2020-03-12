const messageStructure = (message, username) => {
    const now = new Date()
    //console.log(now.getTime())
    return {
        text: message,
        createdAt: now.getTime(),
        username
    }
}

const generateLocationMessage = (url, username) => {
    return {
        url,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {

    messageStructure,
    generateLocationMessage
}