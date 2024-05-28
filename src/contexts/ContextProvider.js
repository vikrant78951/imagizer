import React, { createContext, useContext, useState } from 'react'
import { LocalStorage } from '../helper/helper';
import { updateStateObject } from '../helper/helper';
const StateContext = createContext();

export const ContextProvider = ({ children }) => {

    // initial value 
    let loginUser = LocalStorage.get('user') || '';
    let authCheck = LocalStorage.get('authentication');
    let initToast = {
        type: '',
        text: '',
        display: false,
    }

    // states 
    const [authenticate, setAuthenticate] = useState(authCheck);
    const [user, setUser] = useState(loginUser);
    const [team, setTeam] = useState(LocalStorage.get('domain') || 'All')
    const [toast, setToast] = useState(initToast)
    const [URL, setURL] = useState('http://localhost:8000')

    // global functions 
    function openToast(type, text) {
        updateStateObject("type", type, setToast)
        updateStateObject("text", text, setToast)
        updateStateObject("display", true, setToast)
    }

    function closeToast(time) {
        setTimeout(() => {
            updateStateObject("type", '', setToast)
            updateStateObject("text", '', setToast)
            updateStateObject("display", false, setToast)
        }, time);

    }



    //provider 
    return (
        <StateContext.Provider value={{
            authenticate, setAuthenticate,
            toast, openToast, closeToast,
            user, setUser,
            team, setTeam,
            URL
        }}>
            {children}
        </StateContext.Provider >
    )

}


export const useStateContext = () => useContext(StateContext)