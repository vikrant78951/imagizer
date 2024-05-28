import React from 'react'
import logoBlack from '../../assets/img/logo-black.png'
import logoWhite from '../../assets/img/logo-white.png'

const Logo = ({ additionalClass, type }) => {
    return (
        <>
            {
                (type === 'black')
                    ? <img className={`logo ${additionalClass ? additionalClass : ''}`} src={logoBlack} alt="logo" />
                    : <img className={`logo ${additionalClass ? additionalClass : ''}`} src={logoWhite} alt="logo" />
            }
        </>

    )
}

export default Logo