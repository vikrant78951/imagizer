import React, { useEffect } from 'react'
import './Popup.css'
import { blockSign } from '../../assets/icon/Icon';
import { Title, LightParagraph } from '../typhography/Typography';
import { SecondaryButton, PrimaryButton } from '../button/Button';
import { useState } from 'react';
const ConfirmationPopup = (props) => {


    const handleConfirm = () => {
        props.handleConfirmation(true);
    };

    const handleCancel = () => {
        props.handleConfirmation(false);
        props.closePopup();
    };



    return (
        <div className="popup">
            <div className="popup-content confirmation-box">
                <div className="head">
                    <span className="logo">{blockSign}</span>
                    <Title size='m' type="light"> {props.title}</Title>
                    <LightParagraph size='s'>{props.description}</LightParagraph>
                </div>
                <div className="footer">
                    <SecondaryButton size='l' action={handleCancel} label="Cancel" />
                    <PrimaryButton size='l' action={handleConfirm} label='Confirm' />
                </div>

            </div>
        </div>
    )
}

export default ConfirmationPopup