import { useAppContext } from '../context/hooks/useAppContext'
import { CHANGE_SERVER } from '../context/actions/types'
import React from "react";


export const UsersTable: React.FC = () => {
    const app = useAppContext()

    const leaveChannel = () => {
        app.sendMessage(JSON.stringify({
            type: 'leave-channel',
            content: app.activeServer
        }))
        app.dispatch({
            type: CHANGE_SERVER,
            payload: 'Global'
        })
    }

    return (<div className="user-wrapper">
        <h4>Username:</h4>
        <div id="username" className="username">{app.username}</div>
        <h4>User list:</h4>
        <div id="user-list" className="user-list">{app.onlineUsers.map((user, index) => <h4 key={index}>{user}</h4>)}</div>
        {app.voiceChannels && <div id="voice-channel-list" className="voice-channel-list">
            <h4 className={"voice-channels-label"}>Voice channels:</h4>
            {app.voiceChannels.map((channel, index) => (<div className={"voice-channel-wrapper"} key={index}>
                <h4 className={"voice-channel-name"} onClick={() => console.log("Honk")}>
                    {channel.name}
                </h4>
                <div className={"voice-channel-user-list"}>
                    {channel.connectedUsers.map((user, userIndex) => (
                        <h4 className={"voice-channel-user"} key={userIndex}>
                            {user}
                        </h4>))}
                </div>
            </div>))}
        </div>}
        {app.activeServer !== 'Global' && <button className='leave-channel-button' onClick={leaveChannel}>Leave server</button>}
    </div>)
}