import {
    CHANGE_SERVER,
    CONNECTION_FAILED,
    RECONNECT,
    RESET_HISTORY,
    RESET_USERS_CONNECTED,
    SCROLL_TO_BOTTOM,
    SET_HISTORY,
    SET_JOINED_SERVERS,
    SET_LOCAL_PEER,
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
import {IAction, IState} from "../../helpers/Interfaces";

const INITIAL_STATE: IState = {
    username: '',
    sendMessage: () => {},
    receivedMessage: '',
    connection: null,
    connectionStatus: '',
    openModal: (name) => {},
    onlineUsers: [],
    activeServer: 'Global',
    devices: {},
    serverList: [],
    activeVoiceChannel: null,
    voiceChannels: [],
    connectedServers: ['Global'],
    history: [],
    bottomRef: null
}

const rootReducer = (state = INITIAL_STATE, action: IAction) => {
    switch(action.type) {
        case CHANGE_SERVER: {
            return {...state, activeServer: action.payload}
        }
        case CONNECTION_FAILED: {
            return {...state, history: [{
                    sender: 'SERVER',
                    content: 'The connection to the server failed, please refresh or try again later'
                }]}
        }
        case RECONNECT: {
            return {...state, history: [{
                    sender: 'SERVER',
                    content: 'Trying to reconnect...'
                }]}
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