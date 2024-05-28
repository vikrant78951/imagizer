import React from 'react'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../wrapper/Wrapper'
import { Title } from '../typhography/Typography'
import './PageHeader.css'

const PageHeader = ({ title, para, additioalClass }) => {
    return (
        <SectionContainer additioalClass='page-header'>
            <WhiteBoard>
                <ContentWrapper additioalClass={additioalClass ? additioalClass : ''}>
                    <Title size="ml">{title}</Title>
                </ContentWrapper>
            </WhiteBoard>
        </SectionContainer>
    )
}

export const PageHeaderWithChildren = ({ title, para, children, additioalClass }) => {
    return (
        <SectionContainer additioalClass={`page-header ${additioalClass ? additioalClass : ''}`}>
            <WhiteBoard>
                <ContentWrapper additioalClass=''>
                    <Title size="ml">{title}</Title>
                    {children}
                </ContentWrapper>
            </WhiteBoard>
        </SectionContainer>
    )
}


export default PageHeader