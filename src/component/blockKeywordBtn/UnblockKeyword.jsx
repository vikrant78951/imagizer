import React, { useEffect, useState } from 'react'
import { apis } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider'
import { OutlineSecondaryButton } from '../button/Button'
import ConfirmationPopup from '../popup/ConfirmationPopup'
import { unblock, block } from '../../assets/icon/Icon'

const UnblockKeyword = ({ keyword, blockStatus, handleBlockStatusChange, confirmation }) => {

    const [showConfirmtionPopup, setShowConfirmtionPopup] = useState(false);
    const { openToast, closeToast } = useStateContext()
    const [keywordState, setKeywordState] = useState(blockStatus)

    // block and unblock keyword after confirm 
    const handleConfirmation = async (confirmed) => {
        if (confirmed) {
            setShowConfirmtionPopup(false);
            openToast('loading', `Please wait! We are Unblocking keyword ${keyword} `);

            // Toggle the block status
            const newBlockStatus = !keywordState;

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 2000);
            })

            handleBlockStatusChange(newBlockStatus);
            openToast('success', `keyword ${keyword} has been Unblocked `)
            closeToast(3000)

            // const apiUrl = `${apis.BlockAndUnblockKeyword}?keyword=${encodeURIComponent(keyword)}&action=UNBLOCK&isQueue=1`;
            // await fetch(apiUrl, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'text/plain;charset=UTF-8',
            //     },
            //     credentials: 'include',
            // }).then(response => response.json())
            //     .then(data => {
            //         if (Number(data.rows_updated) === 1) {
            //             handleBlockStatusChange(newBlockStatus);
            //             openToast('success', `keyword ${keyword} has been Unblocked `)
            //             closeToast(3000)
            //         } else {
            //             console.log('failed')
            //             closeToast(3000)

            //         }

            //     })
            //     .catch(error => {
            //         console.log(error.message);
            //         openToast('error', error.message)
            //         closeToast(3000)
            //     });
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
            <OutlineSecondaryButton //if keyword is unblock we will show green button
                size='xs'
                action={BlockUnblockHandler}
                label='Unblock'
                logo={true}
                logoSrc={unblock}
            />

            {/* confirmation popup for keywod state change  */}
            {
                showConfirmtionPopup &&
                <ConfirmationPopup
                    handleConfirmation={handleConfirmation}
                    closePopup={closeConfirmation}
                    title='Unblock Keyword'
                    description='Are you sure you want to unblock'
                />
            }


        </>
    )
}

export default UnblockKeyword