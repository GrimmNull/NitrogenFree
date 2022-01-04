import {useEffect, useRef, useState} from 'react'
import {useAppContext} from '../context/hooks/useAppContext'
import {CHANGE_SERVER, RESET_HISTORY, SET_MODAL} from '../context/actions/types'


export const Modal = () => {
    const data = useAppContext()
    const [visible, setVisible] = useState(false)
    const [title,setTitle] = useState('Global')
    const modalTopRef = useRef(null)
    const hideModal = () => {
        setTimeout(() => {
            setVisible(false)
            document.body.classList.remove('overflow-hidden')
        }, 150)
    }
    const showModal = (server) => {
        title && setTitle(server)
        setVisible(true)
        document.body.classList.add('overflow-hidden')
    }
    const joinServer = () => {
        data.sendMessage(JSON.stringify({
            type: 'join-channel',
            content: {
                name: title
            }
        }))
        data.dispatch({
            type: RESET_HISTORY
        })
        data.dispatch({
            type: CHANGE_SERVER,
            payload: title
        })
        hideModal()
    }
    useEffect(() => {
        data.dispatch({
            type: SET_MODAL,
            payload: showModal
        })
    }, [])

    useEffect(() => {
        modalTopRef.current.scrollTop = 0
    }, [visible])
    return (
        <div className={"modal question " + (visible ? 'modal-show' : '')}>
            <div className="modal-wrapper">
                <div className="modal-header">
                    <p>Join {title}?</p>
                    <div className="modal-close" onClick={hideModal}>×</div>
                </div>
                <div/>
                <div ref={modalTopRef} className="modal-body">
                    <button className='modal-join-button' onClick={joinServer}>Yes</button>
                    <button className='modal-cancel-button' onClick={hideModal}>Cancel</button>
                </div>
            </div>
        </div>)
}