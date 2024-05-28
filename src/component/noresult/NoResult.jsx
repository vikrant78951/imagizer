import React from 'react'
import './NoResult.css'
import { noResult } from '../../assets/icon/Icon'
import { LightParagraph, Title } from '../typhography/Typography'
import { SecondaryButton } from '../button/Button'





export const NoResult = () => {
    return (
        <div className='no-result'>
            <div className="icons"> {noResult} </div>
            <Title size='m' type='light'>Sorry we couldn’t find any matches</Title>
            <LightParagraph size='m'>Please try searching with another keyword</LightParagraph>
        </div>
    )
}


export const NoData = () => {
    return (
        <div className='no-data'>
            <Title size='m' type='light'>No Data</Title>
        </div>
    )
}



export const NoPatternFound = ({ setCopyPattern }) => {

    const clickHandler = () => {
        setCopyPattern(true)
    }

    return (
        <div className='no-result'>
            <div className="icons"> {noResult} </div>
            <Title size='m' type='light'>Sorry we couldn’t find any Pattern</Title>
            <SecondaryButton
                size='s'
                label='Create New Pattern'
                action={clickHandler}

            />

        </div>
    )
}


export const NoProcessFound = () => {

    return (
        <div className='no-result'>
            <div className="icons"> {noResult} </div>
            <Title size='m' type='light'>Sorry couldn't find any process</Title>
        </div>
    )
}





export const Error = () => {
    return (
        <div>Error</div>
    )
}