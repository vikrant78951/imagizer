import React from 'react'
import './Typography.css'



// Title for heading 
export const Title = ({ size, additionalClass, children, type }) => {
    return (
        <h1 className={`title ${type ? type : ''} ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}>{children}</h1>
    )
}


// paragrapn with Black color 
export const DarkParagraph = ({ size, additionalClass, children, type }) => {
    return (
        <p className={`para dark  ${type ? type : ''} ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}>{children}</p>
    )
}

// paragrapn with gray color 
export const LightParagraph = ({ size, additionalClass, children, type, onClick }) => {
    const clickHandler = () => {
        if (onClick) {
            onClick();
        }
    }
    return (
        <p className={`para light ${type ? type : ''}  ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            onClick={clickHandler}>{children}</p>
    )
}





