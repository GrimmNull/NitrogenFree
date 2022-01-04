
export const VoiceChannels = [{
    id: 1,
    name: 'Boring Name',
    parentServer: 'Global',
    connectedUsers: []
}]

let nextId = 2

export const findVoiceChannelById = (channelId) => {
    return VoiceChannels.filter(channel => channel.id === channelId)[0]
}

export const findVoiceChannelsByServer = (serverName) => {
    return VoiceChannels.filter(channel => channel.parentServer === serverName)
}


export const addVoiceChannel = (serverName, channelName) => {
    VoiceChannels.push({
        id: nextId,
        name: channelName,
        parentServer: serverName,
        connectedUsers: []
    })
    nextId++
}

export const connectUserToVoiceChannel = (channelId, userName) => {
    const channel = findVoiceChannelById(channelId)
    channel.connectedUsers.push(userName)
}

export const disconnectUserFromVoiceChannel = (channelId, userName) => {
    const channel = findVoiceChannelById(channelId)
    channel.connectedUsers = channel.connectedUsers.filter(user => user !== userName)
}

export const getUsersConnectedToVoiceChannel = (channelId) => {
    const channel = findVoiceChannelById(channelId)
    return channel.connectedUsers
}