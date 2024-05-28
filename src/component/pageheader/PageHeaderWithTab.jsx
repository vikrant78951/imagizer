import React, { useState, useEffect } from 'react'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../wrapper/Wrapper'
import { Title } from '../typhography/Typography'
import './PageHeader.css'

const PageHeaderWithTab = ({ title, selectedTab, updateTab, tabdata, additioalClass }) => {

    const [selected, setSelected] = useState('')

    useEffect(() => {
        setSelected(selectedTab)
    }, [selectedTab])

    const tabHandler = (item) => {
        updateTab(item)
    }

    return (
        <SectionContainer additioalClass='page-header header-with-tab'>
            <WhiteBoard>
                <ContentWrapper additioalClass={additioalClass ? additioalClass : ''}>
                    <Title size="ml">{title}</Title>

                    <ul className="tab-container">
                        {
                            tabdata.map((item, index) => (
                                <li key={index} onClick={() => tabHandler(item)} className={`tab-link ${item.value === selected.value ? 'active' : ''} `}>
                                    {item.label}
                                </li>
                            ))
                        }
                    </ul>
                </ContentWrapper>
            </WhiteBoard>
        </SectionContainer>
    )
}

export default PageHeaderWithTab