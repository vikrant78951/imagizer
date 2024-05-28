import React from 'react'
import './Instruction.css'

import { SectionContainer, ContentWrapper, Head, WhiteBoard } from '../wrapper/Wrapper'
import { Title } from '../typhography/Typography'
import { downloadInstruction } from '../../data/data'
import { ListWithTitle } from '../List/List'
import { greenCircleCheck } from '../../assets/icon/Icon'



const DownloadInstruction = () => {
    return (
        <SectionContainer additioalClass="map-n-review-instruction">
            <ContentWrapper additioalClass="big-wrapper">
                <Head>
                    <Title size="ml">Instructions</Title>
                </Head>
                <WhiteBoard>
                    <ListWithTitle
                        list={downloadInstruction}
                        icon={greenCircleCheck}
                        additionalClass=''
                        color='green'
                    />
                </WhiteBoard>
            </ContentWrapper>
        </SectionContainer>
    )
}

export default DownloadInstruction