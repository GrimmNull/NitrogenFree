import {WebSocketServer} from 'ws';
import {
    serverList,
    findServerByName,
    addToChatHistory, addNewChannel
} from "./modules/Server.js";
import {
    connectedUsers,
    createRandomUsername,
    sendToAllOnChannel,
    sendToAll, updateUserConnectedServers, changeUserChannel, disconnectUser, shareConnectionToVoiceChat
} from "./modules/User.js";

import {
    VoiceChannels,
    connectUserToVoiceChannel,
    disconnectUserFromVoiceChannel, findVoiceChannelsByServer, findVoiceChannelById, getUsersConnectedToVoiceChannel
} from "./modules/VoiceChannel.js";

const PORT = 8080
const wss = new WebSocketServer({port: PORT, clientTracking: true})


wss.on('listening', () => {
    console.log(`Listening on port: ${PORT}`)
})

wss.on('connection', (ws) => {
    let user = {
        name: createRandomUsername(),
        server: 'Global',
        joinedServer: ['Global'],
        voiceChannelId: null,
        connection: ws
    }
    connectedUsers.push(user)
    serverList[0].connectedUsers.push(user.name)
    ws.send('You are connected to the server')

    ws.send(JSON.stringify({
        type: 'username',
        content: user.name
    }))

    sendToAllOnChannel('server', `Welcome to the server, ${user.name}`, 'SERVER', 'Global', new Date())

    ws.send(JSON.stringify({
        type: 'update_server_list',
        content: serverList.map(server => server.name)
    }))

    ws.send(JSON.stringify({
        type: 'update_voice_channel_list',
        content: findVoiceChannelsByServer('Global')
    }))

    sendToAll('update_user_list', findServerByName(user.server).connectedUsers, 'SERVER', new Date(), wss)

    ws.on('message', (data) => {
        user = handleMessage(data, ws, user)
    });

    ws.on('close', () => {
        disconnectUser(user)
        user.voiceChannelId !== null && disconnectUserFromVoiceChannel(user.voiceChannelId, user.name)
    })
})


const handleMessage = (data, ws, user) => {
    const parsedData = JSON.parse(data)
    switch (parsedData.type) {
        case 'add-channel': {
            if (findServerByName(parsedData.name)) {
                ws.send(JSON.stringify({
                    type: 'server',
                    content: `There is already a channel with the name ${parsedData.name}`
                }))
            } else {
                user = addNewChannel(parsedData.name, user, wss, ws)
            }
            break
        }
        case 'change-channel': {
            user = changeUserChannel(user, parsedData.name, ws)
            break
        }
        case 'join-channel': {
            user = updateUserConnectedServers('join', user, parsedData.content.name, wss, ws)
            break
        }
        case 'join-voice-channel': {
            connectUserToVoiceChannel(parsedData.id, user.name)
            shareConnectionToVoiceChat(parsedData.id, user.name, parsedData.sdp)
            user.voiceChannelId = parsedData.id
            sendToAllOnChannel('update_voice_channel_list', findVoiceChannelsByServer(user.server), 'SERVER', user.server)
            const usersConnected = getUsersConnectedToVoiceChannel(parsedData.id)
            usersConnected.length > 0 && ws.send(JSON.stringify({
                type: 'connection_received',
                message: usersConnected
            }))
            break
        }
        case 'leave-channel': {
            user = updateUserConnectedServers('leave', user, parsedData.content, wss, ws)
            break
        }
        case 'leave-voice-channel': {
            disconnectUserFromVoiceChannel(user.voiceChannelId, user.name)
            sendToAllOnChannel('update_voice_channel_list', findVoiceChannelsByServer(user.server), 'SERVER', user.server)
            break
        }
        case 'ping': {
            ws.send(JSON.stringify({
                type: 'pong'
            }))
            break
        }
        case 'message': {
            addToChatHistory(parsedData, user.name, user.server)
            sendToAllOnChannel('message', parsedData.content, user.name, user.server, new Date(), parsedData.attachment)
            break
        }
        default: {
            console.log(data)
        }
    }
    // parsedData.type !== 'ping' && console.log(connectedUsers.map(user => {return {name: user.name, server: user.server, joinedServers: user.joinedServer}}))
    parsedData.type !== 'ping' && console.log(serverList)
    return user
}


