import React from 'react'
import './Toast.css'

import { DarkParagraph, Title } from '../typhography/Typography'
import { cross, greenCircleCheckBold, errorIcon, warningIcon, loadingIcon } from '../../assets/icon/Icon'


const ToastCard = ({ type, text, position, display, closeToast }) => {

    let icon;
    let loading = false;


    if (type === 'warning') {
        icon = warningIcon;
    } else if (type === 'error') {
        icon = errorIcon;
    } else if (type === 'success') {
        icon = greenCircleCheckBold;
    } else if (type === 'loading') {
        icon = loadingIcon;
    }

    loading = (type === 'loading') ? true : false


    return (<>

        <div className={`toast ${type}  ${display ? 'show' : 'hide'}`}>
            <span className={`icon ${loading && 'spin'}`}>{icon}</span>
            <span className="details">
                <Title size='sm'>{type}</Title>
                <DarkParagraph size='s'>{text}</DarkParagraph>
            </span>
            <span className="cross" onClick={closeToast}>{cross}</span>
        </div>
    </>
    )
}

export default ToastCard