import React from 'react'
import './Wrapper.css'

export const ContentWrapper = ({ additioalClass, children }) => {
    return (
        <div className={`contentWrapper ${additioalClass ? additioalClass : ''}`}>
            {children}
        </div>
    )
}

export const SectionContainer = ({ additioalClass, children }) => {
    return (
        <section className={`section ${additioalClass ? additioalClass : ''}`}>
            {children}
        </section>
    )
}

export const WhiteBoard = ({ additioalClass, children }) => {
    return (
        <div className={`whiteBoard ${additioalClass ? additioalClass : ''}`}>
            {children}
        </div>
    )
}

export const Head = ({ additioalClass, children }) => {
    return (
        <div className={`head ${additioalClass ? additioalClass : ''}`}>
            {children}
        </div>
    )
}



