import { useReducer } from 'react'
import {IAction, IState, TDispatcher} from "../../helpers/Interfaces";


export const useReducerWithMiddleware = (
    reducer: (state: IState , action: IAction) => IState,
    initialState: IState,
    middlewareList: ((state: IState, dispatch: TDispatcher, action: IAction) => IState)[] | any[]
) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const dispatchWithMiddleware = (action: IAction) => {
        middlewareList.map(middleware => middleware(state, dispatch, action))
        dispatch(action)
    }
    return [state, dispatchWithMiddleware]
}