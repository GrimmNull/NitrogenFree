import {createContext} from 'react'
import {rootReducer, INITIAL_STATE as initialState} from '../reducers/rootReducer'
import {useReducerWithMiddleware} from '../hooks/useReducerWithMiddleware'

export const AppContext = createContext({})

export const AppContextProvider = ({children}) => {
    const [state, dispatch] = useReducerWithMiddleware(rootReducer, initialState, [])
    return (<AppContext.Provider value={{...state, dispatch}}>
        {children}
    </AppContext.Provider>)
}