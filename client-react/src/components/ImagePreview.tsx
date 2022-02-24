import { FunctionComponent } from "react";


interface IProps {
    onClose: () => void;
    source: string;
}

export const ImagePreview: FunctionComponent<IProps> = (props: IProps) => {
    const { onClose, source } = props

    return <div className={'flex-row'}>
        <img className={'preview-image ' + (!source ? 'preview-image-closed' : '')} src={source} alt={''}/>
        <span className={'close-preview-button ' + (!source ? 'close-preview-hidden' : '')} onClick={onClose}>x</span>
    </div>
}