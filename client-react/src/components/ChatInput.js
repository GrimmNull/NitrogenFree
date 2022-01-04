import {useRef, useState} from 'react'
import {useAppContext} from '../context/hooks/useAppContext'
import {SCROLL_TO_BOTTOM} from "../context/actions/types"
import {allowMultipleFiles} from "../helpers/config";
import {ImagePreview} from "./ImagePreview";

export const ChatInput = () => {
    const app = useAppContext()
    const [message, setMessage] = useState('')
    const [image, setImage] = useState(null)
    const fileInputRef = useRef(null)
    const handleKeypress = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            if (app.connection && (app.connection.readyState === WebSocket.OPEN)) {
                const messageBody = {
                    type: 'message',
                    content: message,
                    timestamp: new Date()
                }
                if(image !== null) {
                    messageBody['attachment'] = image
                }
                app.sendMessage(JSON.stringify(messageBody))
                setMessage('')
                closeImage()
                app.dispatch({
                    type: SCROLL_TO_BOTTOM
                })
            }
        }

    }
    const onChange = (event) => {
        setMessage(event.target.value)
    }

    const closeImage = () => {
        setImage(null)
        fileInputRef && (fileInputRef.current.value = '')
    }

    const fileUploadHandler = (e) => {
        if(e.target.value === '') {
            return
        }
        // get the files
        let files = e.target.files;

        // Process each file
        let allFiles = [];
        for (let i = 0; i < files.length; i++) {

            let file = files[i];

            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {

                // Make a fileInfo Object
                let fileInfo = {
                    name: file.name,
                    type: file.type,
                    size: Math.round(file.size / 1000) + ' kB',
                    base64: reader.result,
                    file: file,
                };

                allFiles.push(fileInfo);
                if(allFiles.length === files.length){
                    if(allowMultipleFiles)
                        setImage(allFiles)
                    else {
                        setImage(allFiles[0])
                    }
                }
            } // reader.onload

        } // for
    }

    return (<div className='flex-row chat-input-wrapper'>
        <label className='photo-upload-label' htmlFor="upload-photo">+</label>
        <input
            ref={fileInputRef}
            className='hidden'
            type='file'
            onChange={fileUploadHandler}
            id='upload-photo'/>
        <div className='flex-column align-center'>
            <div className={'image-preview-section ' + (image !== null ? 'preview-opened' : '')}>
                <ImagePreview
                    onClose={closeImage}
                    source={image && image.base64}
                />
            </div>
            <input onChange={onChange} onKeyPress={handleKeypress} id="message-input" className="message-input" value={message} placeholder='Send some Christmas vibes...'/>
        </div>
    </div>)
}