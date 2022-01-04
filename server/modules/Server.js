import {changeUserChannel, sendToAll, sendToAllOnChannel} from "./User.js";

const stun = { iceServers: [{
        urls: "stun:stun.services.mozilla.com",
        username: "louis@mozilla.com",
        credential: "webrtcdemo"
    }, {
        urls: [
            "stun:stun.example.com",
            "stun:stun-1.example.com"
        ]
    }]
}

export let serverList = [{
    id: 1,
    name: 'Global',
    connectedUsers: [],
    joinedUsers: [],
    history: [],
    RTCconn: null
}]
export let serverID = 2

export const findServerByName = (name) => {
    return serverList.filter(server => server.name === name)[0]
}

export const checkChannelToClose = (name, wss) => {
    const channel = findServerByName(name)
    if (name !== 'Global' && channel.joinedUsers.length === 0) {
        serverList = serverList.filter(server => server.name !== channel.name)
        sendToAll('update_server_list', serverList.map(server => server.name), 'SERVER', new Date(), wss)
    }
}

export const notifyUserListUpdate = (server1, server2) => {
    sendToAllOnChannel('update_user_list', findServerByName(server1).connectedUsers, '', server1)
    sendToAllOnChannel('update_user_list', findServerByName(server2).connectedUsers, '', server2)
}

export const addNewChannel = (serverName, user, wss, ws) => {
    serverList.push({
        id: serverID,
        name: serverName,
        freshServer: true,
        connectedUsers: [],
        joinedUsers: [user.name],
        history: []
    })
    serverID++
    sendToAll('update_server_list', serverList.map(server => server.name), 'SERVER', new Date(), wss)
    let localUser = changeUserChannel(user, serverName, ws)
    localUser.joinedServer = [...localUser.joinedServer, serverName]
    ws.send(JSON.stringify({
        type: 'update_joined_server',
        content: localUser.joinedServer
    }))
    return localUser
}


export const updateServerUserList = (serverName, user) => {
    const index = serverList.findIndex(server => server.name === serverName)
    serverList[index].connectedUsers = serverList[index].connectedUsers.filter(username => username !== user)
}

export const changeChannel = (newServerName, user, connectedUsers) => {
    const newChannel = Object.create(findServerByName(newServerName))
    const oldChannel = Object.create(findServerByName(user.server))
    newChannel.connectedUsers.push(user.name)
    oldChannel.connectedUsers = oldChannel && oldChannel.connectedUsers ? oldChannel.connectedUsers.filter(userConnected => userConnected !== user.name) : []

    updateServerUserList(user.server, user.name)
    const index = connectedUsers.findIndex(userConnected => userConnected.name === user.name)
    connectedUsers[index].server = newChannel.name

    checkChannelToClose(user.server)

    user.connection.send(JSON.stringify({
        type: 'server',
        content: `Welcome to ${newChannel.name}`,
        sender: 'SERVER',
        timestamp: new Date()
    }))

    return newChannel.name
}

export const addToChatHistory = (content, sender, onServer) => {
    const server = findServerByName(onServer)
    server.history = [...server.history, {
        sender: sender,
        content: content.content,
        timestamp: content.timestamp ? content.timestamp : new Date(),
        attachment: content.attachment
    }]
}

export const establishRTCConnection = async (serverName) => {
    const server = findServerByName(serverName)
    const connectionTest = new RTCPeerConnection(stun)
    const offerTest = await connectionTest.createOffer()
    server.RTCconn = offerTest
}