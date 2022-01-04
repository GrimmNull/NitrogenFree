import {
    ADD_USER_TO_CONNECTION,
    CHANGE_SERVER,
    CONNECTION_FAILED,
    INCREMENT_ATTEMPTS,
    RECONNECT, REMOVE_USER_FROM_CONNECTIONS,
    RESET_HISTORY, RESET_USERS_CONNECTED,
    SCROLL_TO_BOTTOM,
    SET_HISTORY,
    SET_JOINED_SERVERS, SET_LOCAL_PEER,
    SET_MEDIA_DEVICES,
    SET_MODAL,
    SET_REF_TO_BOTTOM,
    SET_RTC_CONNECTION,
    SET_SOCKET,
    SET_USERNAME,
    UPDATE_CONNECTION_STATUS,
    UPDATE_HISTORY,
    UPDATE_PLAYER_LIST,
    UPDATE_SERVER_LIST,
    UPDATE_VOICE_LIST
} from '../actions/types'


const INITIAL_STATE = {
    username: '',
    sendMessage: () => {},
    receivedMessage: '',
    connection: {},
    connectionStatus: '',
    connectionAttempts: 0,
    openModal: () => {},
    onlineUsers: [],
    activeServer: 'Global',
    devices: {},
    serverList: [],
    activeVoiceChannel: null,
    voiceChannels: [],
    localSDP: null,
    localPeer: null,
    connectedServers: ['Global'],
    connectedRTCs: [],
    history: [],
    bottomRef: null
}

const rootReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ADD_USER_TO_CONNECTION: {
            return {...state, connectedRTCs: [...state.connectedRTCs, action.payload]}
        }
        case CHANGE_SERVER: {
            return {...state, activeServer: action.payload}
        }
        case CONNECTION_FAILED: {
            return {...state, history: [{
                    sender: 'SERVER',
                    content: 'The connection to the server failed, please refresh or try again later'
                }]}
        }
        case INCREMENT_ATTEMPTS: {
            return {...state, connectionAttempts: state.connectionAttempts + 1}
        }
        case RECONNECT: {
            return {...state, history: [{
                    sender: 'SERVER',
                    content: 'Trying to reconnect...'
                }]}
        }
        case REMOVE_USER_FROM_CONNECTIONS: {
            return {...state, connectedRTCs: state.connectedRTCs.filter(connection => connection.username !== action.payload)}
        }
        case RESET_HISTORY: {
            return {...state, history: []}
        }
        case RESET_USERS_CONNECTED: {
            return {...state, connectedRTCs: []}
        }
        case SCROLL_TO_BOTTOM: {
            setTimeout(() => {
                state.bottomRef && state.bottomRef.current.scrollIntoView({
                    block: "nearest",
                    inline: "center",
                    behavior: "smooth",
                    alignToTop: false})
            }, 150)
            return state
        }
        case SET_HISTORY: {
            return {...state, history: action.payload}
        }
        case SET_JOINED_SERVERS: {
            return {...state, connectedServers: action.payload}
        }
        case SET_LOCAL_PEER: {
            return {...state, localPeer: action.payload}
        }
        case SET_MEDIA_DEVICES: {
            return {...state, devices: action.payload}
        }
        case SET_MODAL: {
            return {...state, openModal: action.payload}
        }
        case SET_REF_TO_BOTTOM: {
            return {...state, bottomRef: action.payload}
        }
        case SET_RTC_CONNECTION: {
            return {...state, localSDP: action.payload}
        }
        case SET_SOCKET: {
            return {...state, sendMessage: action.payload.send, connection: action.payload.connection}
        }
        case SET_USERNAME: {
            return {...state, username: action.payload}
        }
        case UPDATE_CONNECTION_STATUS: {
            return {...state, connectionStatus: action.payload}
        }
        case UPDATE_HISTORY: {
            const aux = [...state.history]
            aux.push(action.payload)
            return {...state, history: aux}
        }
        case UPDATE_PLAYER_LIST: {
            const userList = [...action.payload]
            return {...state, onlineUsers: userList.filter(user => user !== state.username)}
        }
        case UPDATE_SERVER_LIST: {
            return {...state, serverList: action.payload}
        }
        case UPDATE_VOICE_LIST: {
            return {...state, voiceChannels: action.payload}
        }
        default: {
            return state
        }
    }
}

export {INITIAL_STATE, rootReducer}