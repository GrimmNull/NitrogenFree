import {
    CHANGE_SERVER,
    CONNECTION_FAILED,
    INCREMENT_ATTEMPTS, RECONNECT, SCROLL_TO_BOTTOM, SET_HISTORY, SET_JOINED_SERVERS,
    SET_SOCKET,
    SET_USERNAME,
    UPDATE_HISTORY,
    UPDATE_PLAYER_LIST,
    UPDATE_SERVER_LIST, UPDATE_VOICE_LIST
} from './types'
import { reconnectAttempts, SOCKET_URL } from "../../helpers/config";
import { MutableRefObject } from 'react';
import { IState, TDispatcher } from "../../helpers/Interfaces";

export const initializeSocket = (dispatch: TDispatcher, send: (message: string) => void, connection: WebSocket) => {
    dispatch({
        type: SET_SOCKET,
        payload: {
            send: send,
            connection: connection
        }
    })
}

export const connectToServer = (app: IState, intervalId: MutableRefObject<any>, attempts = 0) => {
    const socket = new WebSocket(SOCKET_URL)
    initializeSocket(app.dispatch, (message: string) => socket.send(message), socket)
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

export const interpretMessage = async (app: IState, dispatch: TDispatcher, message: any) => {
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