import React from 'react'
import { useStateContext } from '../../contexts/ContextProvider'

import './Toast.css'
import ToastCard from './ToastCard'
const Toast = () => {

    const { toast, closeToast } = useStateContext();

    return (
        <ToastCard type={toast.type} text={toast.text} position={toast.position} display={toast.display} closeToast={closeToast} />
    )

}

export default Toast