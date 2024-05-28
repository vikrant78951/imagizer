import React from 'react';
import './Images.css';
import { useStateContext } from '../../contexts/ContextProvider';

export const Images = ({ path, alt, aditionalClass }) => {
    return (
        <img
            className={`clickableImage ${aditionalClass ? aditionalClass : ''}`}
            src={path}
            alt={alt ? alt : 'image'}
        />
    )
}

export const ClickableImages = ({ path, alt, aditionalClass, action }) => {
    return (
        <div className="image-container">
            <img
                onClick={action}
                className={`clickableImage ${aditionalClass ? aditionalClass : ''}`}
                src={path}
                alt={alt ? alt : 'image'}
            />
         </div>
    )
}


export const ImagesWithLink = ({ path, alt, aditionalClass, alterPath, copyBtn }) => {

    const { openToast, closeToast } = useStateContext()
    const handleClick = (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(alterPath);
        openToast('success', 'Image Link Copied');
        closeToast(2000);
        // setTimeout(() => {
        //     window.open(alterPath, '_blank');
        // }, 1000);

    };


    return (
        <div className="image-container">

            <img
                className={`clickableImage ${aditionalClass ? aditionalClass : ''}`}
                src={path}
                alt={alt ? alt : 'image'}
                onClick={handleClick}
            />


        </div>

    )
}







