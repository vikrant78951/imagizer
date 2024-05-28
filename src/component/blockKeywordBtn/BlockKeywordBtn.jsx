import React, { useEffect, useState } from 'react'
import { apis } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider'
import { IconButton } from '../button/Button'
import ConfirmationPopup from '../popup/ConfirmationPopup'
import { blockKeywordRed, unBlockKeywordGreen } from '../../assets/icon/Icon'
import { logoutHelper } from '../../helper/helper'
import Tooltip from '../tooltip/Tooltip'

const BlockKeywordBtn = ({ keyword, blockStatus, handleBlockStatusChange, confirmation, tooltip_position }) => {

    const [showConfirmtionPopup, setShowConfirmtionPopup] = useState(false);
    const { openToast, closeToast, setAuthenticate } = useStateContext()
    const [keywordState, setKeywordState] = useState(blockStatus)


    const blockKeyword = () => {
        return new Promise((res => {
            setTimeout(() => {
                res()
            }, 2000);
        }))
    }

    // block and unblock keyword after confirm 
    const handleConfirmation = async (confirmed) => {
        if (confirmed) {
            setShowConfirmtionPopup(false);
            openToast('loading', `Please wait! We are ${keywordState ? 'Unblocking' : 'Blocking'} keyword ${keyword} `);

            // Toggle the block status
            const newBlockStatus = !keywordState;


            await blockKeyword()

            handleBlockStatusChange(newBlockStatus);
            openToast('success', `keyword ${keyword} has been  ${keywordState ? 'Unblocked' : 'Blocked'} `)
            closeToast(3000)

        }
    };


    // close confirmation box 
    const closeConfirmation = () => {
        setShowConfirmtionPopup(false);
    };


    // block and unblock handler 
    const BlockUnblockHandler = () => {
        confirmation ? setShowConfirmtionPopup(true) : handleConfirmation(true)
    }

    // initialise block state 
    useEffect(() => {
        setKeywordState(blockStatus)
    }, [blockStatus])


    return (
        <>

            {/* block and unblock keyword button  */}
            {
                keywordState
                    ? <Tooltip text='Unblock Keyword'
                        tooltip_position={tooltip_position ? tooltip_position : 'center'}
                    >
                        <IconButton // unblock
                            size='xs'
                            action={BlockUnblockHandler}
                            label={keyword}
                            logo={true}
                            logoSrc={unBlockKeywordGreen}
                        />
                    </Tooltip>


                    : <Tooltip text='Block keyword'
                        tooltip_position={tooltip_position ? tooltip_position : 'center'}
                    >
                        <IconButton // block
                            size='xs'
                            action={BlockUnblockHandler}
                            label={keyword}
                            logo={true}
                            logoSrc={blockKeywordRed}
                        />
                    </Tooltip>
            }


            {/* confirmation popup for keywod state change  */}
            {
                showConfirmtionPopup &&
                <ConfirmationPopup
                    handleConfirmation={handleConfirmation}
                    closePopup={closeConfirmation}
                    title={`${keywordState ? 'Unblock' : 'block'} Keyword`}
                    description={`Are you sure you want to ${keywordState ? 'unblock' : 'block'} this keyword?`}
                />
            }


        </>
    )
}

export default BlockKeywordBtn