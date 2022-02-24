import React, {createContext} from 'react'
import {rootReducer, INITIAL_STATE as initialState} from '../reducers/rootReducer'
import {useReducerWithMiddleware} from '../hooks/useReducerWithMiddleware'
import {IState} from "../../helpers/Interfaces";

export const AppContext = createContext<IState>(initialState)

export const AppContextProvider: React.FC = ({children}) => {
    const [state, dispatch] = useReducerWithMiddleware(rootReducer, initialState, [])

    // @ts-ignore
    return (<AppContext.Provider value={{...state, dispatch}}>
        {children}
    </AppContext.Provider>)
}