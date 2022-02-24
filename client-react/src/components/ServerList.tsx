import { useAppContext } from '../context/hooks/useAppContext'
import React, { useEffect, useState } from 'react'
import { CHANGE_SERVER, RESET_HISTORY } from '../context/actions/types'
import ReactTooltip from "react-tooltip";
import { invoke } from '@tauri-apps/api/tauri'

export const ServerList: React.FC = () => {
    const app = useAppContext()
    const [adding, setAdding] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')


    const changeServer = (name: string) => {
        if (name === app.activeServer || (app.connection && (app.connection.readyState !== WebSocket.OPEN))) {
            return
        }
        if (!app.connectedServers.includes(name)) {
            app.openModal(name)
            return
        }
        app.sendMessage(JSON.stringify({
            type: 'change-channel',
            name: name
        }))
        app.dispatch({
            type: RESET_HISTORY
        })
        app.dispatch({
            type: CHANGE_SERVER,
            payload: name
        })
    }

    const handleKeypress = (e: { key: string, preventDefault: () => void }) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (app.connection && (app.connection.readyState !== WebSocket.OPEN)) {
                return
            }
            if (message !== '') {
                app.sendMessage(JSON.stringify({
                    type: 'add-channel',
                    name: message
                }))
                setMessage('')
                setAdding(false)
                app.dispatch({
                    type: RESET_HISTORY
                })
                app.dispatch({
                    type: CHANGE_SERVER,
                    payload: message
                })
            } else {
                setAdding(false)
            }
        }

    }

    useEffect(() => {
        invoke && invoke('close_splashscreen')
    }, [])

    const onChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setMessage(event.target.value)
    }

    return (<div className={'server-list'}>
        {app.serverList.map((server, index) => <>
            <ReactTooltip
                id={`server-tooltip-${index}`}
                className={'server-tooltip'}
                place={'top'}
                type={'info'}
            >
                {server}
            </ReactTooltip>
            <h3 data-tip={''} data-for={`server-tooltip-${index}`} key={index} onClick={() => changeServer(server)}
                className={'server-button ' + (!app.connectedServers.includes(server) ? 'unconnected-server ' : '') + (server === app.activeServer ? 'active-server' : '')}>{server.substring(0, 2)}</h3>
        </>)}
        {!adding && <h3 onClick={() => setAdding(true)} className="server-button">+</h3>}
        {adding && <input onChange={onChange} onKeyPress={handleKeypress} value={message} className='server-input'/>}
    </div>)

}