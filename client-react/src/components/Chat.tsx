import { useAppContext } from '../context/hooks/useAppContext'
import { Message } from './Message'
import { ChatInput } from './ChatInput'
import React, {useEffect, useRef } from 'react'
import { SET_REF_TO_BOTTOM } from "../context/actions/types";
import { IMessage } from "../helpers/Interfaces";


export const Chat: React.FC = () => {
    const app = useAppContext()
    const scrollRef = useRef(null)
    useEffect(() => {
        if(scrollRef === app.bottomRef) {
            return
        }
        app.dispatch({
            type: SET_REF_TO_BOTTOM,
            payload: scrollRef
        })
    }, [scrollRef])
    return (
        <div className="chat-wrapper">
            <div id="message-table" className="message-table">
                {app.history && app.history.map((message : IMessage, index: number) => <Message key={index} data={message}/>)}
                <div ref={scrollRef} />
            </div>
            <ChatInput />
        </div>

    )
}