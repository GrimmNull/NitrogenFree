import {useReducer} from 'react'


export const useReducerWithMiddleware = (
    reducer,
    initialState,
    middlewareList
) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const dispatchWithMiddleware = (action) => {
        middlewareList.map(middleware => middleware(state, dispatch, action))
        dispatch(action)
    }
    return [state, dispatchWithMiddleware]
}