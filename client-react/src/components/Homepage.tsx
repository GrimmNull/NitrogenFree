import React, { useEffect, useRef, useState } from 'react'
import { connectToServer, interpretMessage } from '../context/actions/userActions'
import { useAppContext } from '../context/hooks/useAppContext'
import { Chat } from './Chat'
import { UsersTable } from './UsersTable'
import { ServerList } from './ServerList'
import { UPDATE_CONNECTION_STATUS } from "../context/actions/types";
import { Modal } from './Modal'
import { IState } from "../helpers/Interfaces";

export const Homepage: React.FC = () => {
    const app : IState = useAppContext()
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
    }, [app.username])

    useEffect(() => {
        if(!app.connection) {
            return
        }

        app.connection.onmessage = event => interpretMessage(app, app.dispatch, JSON.parse(event.data))
    }, [app.connection])

    return <div className={'homepage-wrapper'}>
        <Modal />
        <ServerList />
        <UsersTable />
        <Chat />
    </div>
}