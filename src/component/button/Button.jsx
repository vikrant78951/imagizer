import React from 'react'
import './Button.css'
import Tooltip from '../tooltip/Tooltip'



export const PrimaryButton = ({ additionalClass, type, label, action, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <button
            className={`button primary ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            type={type ? type : 'button'}
            onClick={action}
            disabled={disable ? disable : false}>
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
            <span className='txt'>{label}</span>
        </button>

    )
}

export const SecondaryButton = ({ additionalClass, type, label, action, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <button
            className={`button secondary  ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            type={type ? type : 'button'}
            onClick={action}
            disabled={disable ? disable : false}>
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
            <span className='txt'>{label}</span>
        </button>

    )
}

export const SecondaryCollaplseButton = ({ additionalClass, type, label, action, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <button
            className={`button secondary collapse-btn  ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            type={type ? type : 'button'}
            onClick={action}
            disabled={disable ? disable : false}>
            <span className='txt'>{label}</span>
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
        </button>

    )
}

export const OutlinePrimaryButton = ({ additionalClass, type, label, action, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <button
            className={`button  primary outline ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            type={type ? type : 'button'}
            onClick={action}
            disabled={disable ? disable : false}>
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
            <span className='txt'>{label}</span>
        </button>

    )
}

export const OutlineSecondaryButton = ({ additionalClass, type, label, action, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <button
            className={`button  secondary  outline  ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            type={type ? type : 'button'}
            onClick={action}
            disabled={disable ? disable : false}>
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
            <span className='txt'>{label}</span>
        </button>

    )
}

export const Button = ({ additionalClass, type, label, action, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <button
            className={`button ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            type={type ? type : 'button'}
            onClick={action}
            disabled={disable ? disable : false}>
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
            <span className='txt'>{label}</span>
        </button>

    )
}

export const OutlineButton = ({ additionalClass, type, label, action, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <button
            className={`outline-button ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            type={type ? type : 'button'}
            onClick={action}
            disabled={disable ? disable : false}>
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
            <span className='txt'>{label}</span>
        </button>

    )
}

export const IconButton = ({ additionalClass, action, logoSrc, logoType, disable, size, id, tooltip, tooltipText }) => {
    return (
        <>
            {
                tooltip ?
                    <Tooltip text={tooltipText}>
                        <button
                            className={`icon-button ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
                            id={id ? id : ''}
                            type={'button'}
                            onClick={action}
                            disabled={disable ? disable : false}>
                            <>
                                {
                                    (logoType === 'img')
                                        ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                                        : <span className="logo"> {logoSrc} </span>
                                }
                            </>
                        </button>
                    </Tooltip>
                    : <button
                        className={`icon-button ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
                        id={id ? id : ''}
                        type={'button'}
                        onClick={action}
                        disabled={disable ? disable : false}>
                        <>
                            {
                                (logoType === 'img')
                                    ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                                    : <span className="logo"> {logoSrc} </span>
                            }
                        </>
                    </button>
            }
        </>

    )
}

export const IconButtonWithChildren = ({ additionalClass, action, logoSrc, logoType, disable, size, id, children, tooltip, tooltipText, tooltip_position }) => {
    return (
        <div className={`${additionalClass ? additionalClass : ''}`}>

            {
                tooltip ?
                    <Tooltip text={tooltipText} tooltip_position={tooltip_position ? tooltip_position : 'center'}>
                        <button
                            className={`icon-button ${size ? size : ''}`}
                            id={id ? id : ''}
                            type={'button'}
                            onClick={action}
                            disabled={disable ? disable : false}>
                            <>
                                {
                                    (logoType === 'img')
                                        ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                                        : <span className="logo"> {logoSrc} </span>
                                }
                            </>
                        </button>
                    </Tooltip>

                    : <button
                        className={`icon-button ${size ? size : ''}`}
                        id={id ? id : ''}
                        type={'button'}
                        onClick={action}
                        disabled={disable ? disable : false}>
                        <>
                            {
                                (logoType === 'img')
                                    ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                                    : <span className="logo"> {logoSrc} </span>
                            }
                        </>
                    </button>
            }

            {children}
        </div>


    )
}

export const AnchorButton = ({ additionalClass, type, label, target, link, logo, logoSrc, logoType, disable, size, id }) => {
    return (
        <a
            className={`button anchor ${size ? size : ''} ${additionalClass ? additionalClass : ''}`}
            id={id ? id : ''}
            href={link}
            target={target}
            disabled={disable ? disable : false}
            download={type === 'download' ? true : false}
        >
            {logo &&
                <>
                    {
                        (logoType === 'img')
                            ? <img src={logoSrc} alt="buttonlogo" className="logo" />
                            : <span className="logo"> {logoSrc} </span>
                    }
                </>
            }
            <span className='txt'>{label}</span>
        </a>

    )
}











