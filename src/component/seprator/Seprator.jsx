import React from 'react'
import './Seprator.css'
import { DarkParagraph } from '../typhography/Typography'


export const OrSeprator = () => {
    return (
        <div className='seprator or-seprator'>
            <span className="line"></span>
            <DarkParagraph>or</DarkParagraph>
            <span className="line"></span>
        </div>
    )
}

export const SingleLineSeprator = () => {
    return (
        <div className='seprator'>
            <span className="line"></span>
        </div>
    )
}

export const VerticleOrSeprator = () => {
    return (
        <div className='seprator verticle-or-seprator'>
            <span className="line"></span>
            <DarkParagraph>or</DarkParagraph>
            <span className="line"></span>
        </div>
    )
}


