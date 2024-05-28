import React from 'react'
import { Title } from '../typhography/Typography'
import { IconButton } from '../button/Button'
import { cross } from '../../assets/icon/Icon'

const Popup = ({ additionalClass, closePopup, children, title }) => {


    const close = () => closePopup(); // close popup when click on crosshair

    return (
        <div className={`popup ${additionalClass ? additionalClass : ''}`}>
            <div className="popup-content ">
                <div className="popup-header">
                    <Title size='m'>{title}</Title>
                    <IconButton
                        logoType='svg'
                        logoSrc={cross}
                        action={close}
                    />
                </div>
                {children}
            </div>
        </div>
    )
}

export default Popup