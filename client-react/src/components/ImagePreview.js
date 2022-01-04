

export const ImagePreview = (props) => {
    const { onClose, source } = props

    return <div className={'flex-row'}>
        <img className={'preview-image ' + (!source ? 'preview-image-closed' : '')} src={source} alt={''}/>
        <span className={'close-preview-button ' + (!source ? 'close-preview-hidden' : '')} onClick={onClose}>x</span>
    </div>
}