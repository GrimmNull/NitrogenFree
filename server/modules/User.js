import {
    changeChannel,
    checkChannelToClose,
    findServerByName,
    notifyUserListUpdate,
    updateServerUserList
} from "./Server.js";
import {findVoiceChannelsByServer} from "./VoiceChannel.js";

const AnimalNames = ['Margay', 'Red Panda', 'Elephant Shrew', 'Meerkat', 'Qoukka', 'Flapjack Octopus', 'Fennec Fox', 'Klipspringer', 'Numbat', 'Japanese weasel']
const maxTag = 10000
const minTag = 1000
const usedTags = []
export let connectedUsers = []

export const sendToAllOnChannel = (type, content, sender, onServer, timestamp, attachment) => {
    console.log('Send to: ' + onServer)
    const clients = connectedUsers.filter(user => user.server === onServer)
    clients.forEach(client => client.connection.send(JSON.stringify({
        type: type,
        content: content,
        sender: sender,
        timestamp: timestamp ? timestamp : new Date(),
        attachment: attachment
    })))
}

export const sendToAll = (type, content, sender, timestamp, wss) => {
    wss.clients.forEach(client => client.send(JSON.stringify({
        type: type,
        content: content,
        sender: sender,
        timestamp: timestamp ? timestamp : new Date()
    })))
}

export const changeUserChannel = (user, serverName, ws) => {
    const oldServer = user.server.toString()
    user.server = changeChannel(serverName, user, connectedUsers)
    notifyUserListUpdate(oldServer, user.server)
    ws.send(JSON.stringify({
        type: 'channel_history',
        content: findServerByName(user.server).history
    }))
    ws.send(JSON.stringify({
        type: 'update_voice_channel_list',
        content: findVoiceChannelsByServer(user.server)
    }))
    return user
}

export const shareConnectionToVoiceChat = (channelId, userName, connectionSDP) => {
    const clients = connectedUsers.filter(user => user.voiceChannelId === channelId && user.name !== userName)
    clients.forEach(client => client.connection.send(JSON.stringify({
        type: 'connect_to_user',
        user: userName,
        connection: connectionSDP
    })))
}

export const updateUserConnectedServers = (type, user, serverName, wss, ws) => {
    const oldServer = user.server.toString()
    const newChannel = findServerByName(serverName)
    console.log()
    switch (type) {
        case 'join': {
            newChannel.joinedUsers = newChannel.joinedUsers ? [...newChannel.joinedUsers, user.name] : []
            user.joinedServer = [...user.joinedServer, serverName]
            user.server = changeChannel(serverName, user, connectedUsers)
            break
        }
        case 'leave': {
            newChannel.joinedUsers = newChannel.joinedUsers.filter(userName => userName !== user.name)
            user.joinedServer = user.joinedServer.filter(server => server !== serverName)
            user.server = changeChannel('Global', user, connectedUsers)
            ws.send(JSON.stringify({
                type: 'channel_history',
                content: findServerByName(user.server).history
            }))
            checkChannelToClose(serverName, wss)
            break
        }
        default: {
            break
        }
    }
    notifyUserListUpdate(oldServer, user.server)
    ws.send(JSON.stringify({
        type: 'update_joined_server',
        content: user.joinedServer
    }))
    return user
}

export const disconnectUser = (user) => {
    connectedUsers = connectedUsers.filter(userConnected => userConnected.name !== user.name)
    updateServerUserList(user.server, user.name)
    sendToAllOnChannel('update_user_list', findServerByName(user.server).connectedUsers, '', user.server)
}

export const createRandomUsername = () => {
    const animalIndex = Math.floor(Math.random() * AnimalNames.length)
    return AnimalNames[animalIndex] + '#' + generateTag()
}

const generateTag = () => {
    let tag = getRandomTag()
    while (usedTags.includes(tag)) {
        tag = getRandomTag()
    }
    return tag
}

const getRandomTag = () => {
    return Math.floor(Math.random() * (maxTag - minTag) + minTag)
}