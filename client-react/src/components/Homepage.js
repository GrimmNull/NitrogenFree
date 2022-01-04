import {useEffect, useRef, useState} from 'react'
import {connectToServer, createLocalPeer, interpretMessage} from '../context/actions/userActions'
import {useAppContext} from '../context/hooks/useAppContext'
import {Chat} from './Chat'
import {UsersTable} from './UsersTable'
import {ServerList} from './ServerList'
import {UPDATE_CONNECTION_STATUS} from "../context/actions/types";
import {Modal} from './Modal'
import {VoRTC} from "./VoRTC";


export const Homepage = () => {
    const app = useAppContext()
    const intervalId = useRef(null)
    const [readyState] = useState(app.connection && app.connection.readyState)
    useEffect(() => {
        connectToServer(app, intervalId, app.bottomRef)
    }, [])

    useEffect(() => {
        if(app.connection && readyState === app.connection.readyState) {
            return
        }
        app.dispatch({
            type: UPDATE_CONNECTION_STATUS,
            payload: readyState
        })
    }, [app.connection])

    useEffect(() => {
        if(app.username === '') {
            return
        }
        createLocalPeer(app)
    }, [app.username])

    useEffect(() => {
        console.log('enter to update interpretmessage')
        if(Object.keys(app.connection).length === 0) {
            return
        }
        console.log('updating interpretmessage')
        app.connection.onmessage = event => interpretMessage(app, app.dispatch, JSON.parse(event.data))
    }, [app.connection])

    return <div className={'homepage-wrapper'}>
        <Modal />
        <ServerList />
        <UsersTable />
        <Chat />
        <VoRTC />
    </div>
}