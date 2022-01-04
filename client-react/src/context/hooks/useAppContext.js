import {useContext} from 'react'
import {AppContext} from '../provider/AppContextProvider'


export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useAppContext should only be used inside AppContextProvider')
    }
    return context
}