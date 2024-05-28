import React, { useState } from 'react'
import '../assets/styles/blockImage.css'
import Header from '../component/header/Header'
import Toast from '../component/toast/Toast'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper'
import PageHeaderWithTab from '../component/pageheader/PageHeaderWithTab'

import BlockKeyword from '../component/blockKeyword/BlockKeyword'
import BlockImages from '../component/blockImagesTab/BlockImagesTab'

const BlockImage = () => {

    const tabData = [
        {
            label: 'Block Keyword',
            value: 'block-keyword'
        },
        {
            label: 'Block Images',
            value: 'block-images'
        }
    ]

    const [selectedTab, setSelectedTab] = useState(tabData[0])



    return (
        <>
            {/* header  */}
            <Header />
            <main className='block-images'>

                {/* page heaer  */}
                <PageHeaderWithTab
                    title="Block Keyword and Images"
                    selectedTab={selectedTab}
                    updateTab={setSelectedTab}
                    tabdata={tabData}
                />


                {/* page content  */}
                <SectionContainer additioalClass='page-content'>
                    <ContentWrapper additioalClass='big-wrapper'>
                        <WhiteBoard>

                            <BlockKeyword
                                additionalClass={`tab-content ${selectedTab.value === 'block-keyword' ? 'active' : ""}`} />

                            <BlockImages
                                additionalClass={`tab-content ${selectedTab.value === 'block-images' ? 'active' : ""}`} />

                        </WhiteBoard>
                    </ContentWrapper>
                </SectionContainer>


            </main>

            {/* toast notification */}
            <Toast />
        </>
    )
}

export default BlockImage