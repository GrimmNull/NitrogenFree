import {
    CHANGE_SERVER,
    CONNECTION_FAILED,
    INCREMENT_ATTEMPTS, RECONNECT, SCROLL_TO_BOTTOM, SET_HISTORY, SET_JOINED_SERVERS,
    SET_SOCKET,
    SET_USERNAME,
    UPDATE_HISTORY,
    UPDATE_PLAYER_LIST,
    UPDATE_SERVER_LIST,
    SET_MEDIA_DEVICES, UPDATE_VOICE_LIST, SET_RTC_CONNECTION, ADD_USER_TO_CONNECTION, SET_LOCAL_PEER
} from './types'
import {reconnectAttempts, SOCKET_URL} from "../../helpers/config";
import Peer from "peerjs";

export const initializeSocket = (dispatch, send, connection) => {
    dispatch({
        type: SET_SOCKET,
        payload: {
            send: send,
            connection: connection
        }
    })
}

export const establishRTCConnection = async (app, message) => {
    const server = { iceServers: [{
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

    // const userRTCConnection = new RTCPeerConnection(server)
    // app.devices.getTracks().forEach(track => {
    //     userRTCConnection.addTrack(track)
    // })
    // const localOffer = await userRTCConnection.createOffer()
    // await userRTCConnection.setLocalDescription(localOffer)
    //
    // app.sendMessage(JSON.stringify({
    //     type: 'answer_call',
    //     user: localOffer
    // }))
    //
    // app.dispatch({
    //     type: SET_RTC_CONNECTION,
    //     payload: userRTCConnection.localDescription
    // })
    console.log(app)
    const remotePeer = app.localPeer && app.localPeer.connect(message.user)
    remotePeer && remotePeer.on('open', () => {
        remotePeer.send(`hi from ${app.username}!`);
    });
}

export const createLocalPeer = (app) => {
    const localPeer = new Peer(app.username)
    app.dispatch({
        type: SET_LOCAL_PEER,
        payload: localPeer
    })
    localPeer.on('connection', (conn) => {
        conn.on('data', (data) => {
            // Will print 'hi!'
            console.log(data);
        });
        conn.on('open', () => {
            conn.send('hello using webrtc!');
        });
    });
}

export const getMediaDevices = async (dispatch) => {
    await navigator.getUserMedia({audio: true, video: true}, stream => dispatch({
        type: SET_MEDIA_DEVICES,
        payload: stream
    }), error => console.warn(error.message))
}

export const connectToServer = (app, intervalId, attempts = 0) => {
    const socket = new WebSocket(SOCKET_URL)
    initializeSocket(app.dispatch, (message) => socket.send(message), socket)
    socket.onmessage = event => interpretMessage(app, app.dispatch, JSON.parse(event.data))
    socket.onclose = () => setTimeout(() => {
        if(attempts >= reconnectAttempts) {
            app.dispatch({
                type: CONNECTION_FAILED
            })
            return
        }
        app.dispatch({
            type: CHANGE_SERVER,
            payload: 'Global'
        })
        app.dispatch({
            type: RECONNECT
        })
        app.dispatch({
            type: INCREMENT_ATTEMPTS
        })
        connectToServer(app, intervalId, attempts + 1)
    }, 1000)
    intervalId.current = setInterval(() => {
        if(socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify({
                type: 'ping'
            }))
        }
        return () => {
            clearInterval(intervalId.current)
        }
    },3000)
}

export const interpretMessage = async (app, dispatch, message) => {
    message.type !== 'pong' && console.log(app)
    switch (message.type) {
        case 'channel_history': {
            dispatch({
                type: SET_HISTORY,
                payload: message.content
            })
            dispatch({
                type: SCROLL_TO_BOTTOM
            })
            break
        }
        case 'connection_received': {
            // app.dispatch({
            //     type: ADD_USER_TO_CONNECTION,
            //     payload: {
            //         username: message.username,
            //         remoteDescription: message.description
            //     }
            // })

            break
        }
        case 'message' : {
            dispatch({
                type: UPDATE_HISTORY,
                payload: message
            })
            dispatch({
                type: SCROLL_TO_BOTTOM
            })
            break
        }
        case 'pong' : {
            break
        }
        case 'server' : {
            dispatch({
                type: UPDATE_HISTORY,
                payload: {...message, sender: 'SERVER'}
            })
            dispatch({
                type: SCROLL_TO_BOTTOM
            })
            break
        }
        case 'connect_to_user': {
            await establishRTCConnection(app, message)
            break
        }
        case 'update_joined_server': {
            dispatch({
                type: SET_JOINED_SERVERS,
                payload: message.content
            })
            break;
        }
        case 'update_server_list': {
            dispatch({
                type: UPDATE_SERVER_LIST,
                payload: message.content
            })
            break
        }
        case 'update_user_list': {
            dispatch({
                type: UPDATE_PLAYER_LIST,
                payload: message.content
            })
            break
        }
        case 'update_voice_channel_list': {
            dispatch({
                type: UPDATE_VOICE_LIST,
                payload: message.content
            })
            break
        }
        case 'username' : {
            dispatch({
                type: SET_USERNAME,
                payload: message.content
            })
            break
        }
        default: {
            console.log(message)
        }
    }
}

export const interpretRTCMessage = (message) => {
    console.log(message)
}