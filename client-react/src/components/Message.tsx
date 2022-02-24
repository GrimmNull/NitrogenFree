import { useAppContext } from '../context/hooks/useAppContext'
import 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { IMessage } from "../helpers/Interfaces";
import { FunctionComponent } from "react";

interface IProps {
    data: IMessage
}

export const Message: FunctionComponent<IProps> = (props: IProps) => {
    const app = useAppContext()
    dayjs.extend(relativeTime)
    const { data } = props
    return (<div className={'message ' + (data.sender === 'SERVER' ? 'server' : (data.sender !== app.username ? 'friend' : 'client'))}>{data.attachment && data.attachment.type.includes('image') && <img className='message-photo' src={data.attachment.base64} alt={''}/> }<h4 className='message-text'>{data.sender}: {data.content}</h4> <h5 className='message-timestamp'>{dayjs(data.timestamp).fromNow()}</h5></div>)
}