import React, { useEffect, useState } from 'react'
import { apis } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider'
import { OutlinePrimaryButton } from '../button/Button'
import ConfirmationPopup from '../popup/ConfirmationPopup'
import { unblock } from '../../assets/icon/Icon'
import { logoutHelper } from '../../helper/helper'


const DeletePattern = ({ pattern, siteName, rowId, confirmation, deleteRow }) => {

    const [showConfirmtionPopup, setShowConfirmtionPopup] = useState(false);
    const { openToast, closeToast, setAuthenticate } = useStateContext()

    const [selectedPattern, setSelectedPattern] = useState('')
    const [selectedSiteName, setSelectedSiteName] = useState('')

    useEffect(() => {
        setSelectedPattern(pattern)
        setSelectedSiteName(siteName)
    }, [pattern, siteName])

    // block and unblock keyword after confirm 
    const handleConfirmation = async (confirmed) => {
        if (confirmed) {
            deletePattern()
        }
    };


    const deletePattern = async () => {
        openToast('loading', 'Deleting Pattern')

        const apiUrl = `${apis.removePatternImage}?pattern=${encodeURIComponent(selectedPattern)}&siteName=${encodeURIComponent(selectedSiteName)}`
        const requestOptions = {
            method: 'DELETE',
            credentials: 'include'
        };

        // Perform the fetch request
        await fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => {

                if (data.errorMessage === "invalid_session") {
                    logoutHelper()
                    setAuthenticate("false")
                    openToast("error", 'Invalid Session');
                    closeToast(4000);
                } else if (data.response && data.status === 'success') {
                    openToast('success', "Pattern Deleted")
                    closeToast(3000)
                    setShowConfirmtionPopup(false)
                    deleteRow(rowId)
                } else {
                    openToast('error', 'Someting went wrong pleae try again')
                    closeToast(3000)
                    setShowConfirmtionPopup(false)

                }
            })
            .catch(error => {
                console.error('Error:', error);
                openToast('error', error.message)
                closeToast(3000)
                setShowConfirmtionPopup(false)

            });


    }



    // close confirmation box 
    const closeConfirmation = () => {
        setShowConfirmtionPopup(false);
    };


    // block and unblock handler 
    const deletePatternHandler = () => {
        confirmation ? setShowConfirmtionPopup(true) : deletePattern()
    }



    return (
        <>

            <OutlinePrimaryButton
                size='xs'
                action={deletePatternHandler}
                label={pattern}
                logo={true}
                logoSrc={unblock}
            />


            {/* confirmation popup for keywod state change  */}
            {
                showConfirmtionPopup &&
                <ConfirmationPopup
                    title={'Delete pattern'}
                    description={'Are you sure you want to delete this pattern'}
                    handleConfirmation={handleConfirmation}
                    closePopup={closeConfirmation}
                />
            }


        </>
    )
}

export default DeletePattern