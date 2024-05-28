import React, { useEffect, useState } from 'react'
import './Card.css'
import { IconButton, OutlineButton, SecondaryButton, SecondaryCollaplseButton } from '../button/Button'
import { LightParagraph, Title } from '../typhography/Typography'
import { useStateContext } from '../../contexts/ContextProvider'
import { copyImage, unblockInnerLogo } from '../../assets/icon/Icon'
import { RadioButton, ReactSelectCreatable } from '../forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, singleInputHandleKeyDown, singleInputHandleBlur, handleBlur, validationField, handlePaste } from '../forms/Validation'
import { downloadIconWhite, copyIcon, editIcon } from '../../assets/icon/Icon'
import { apis, ImageSize } from '../../data/data'
import { downloadImage, preventFormSubmit } from '../../helper/helper'
import { getPathBySize } from '../../helper/helper'
import { ImagesWithLink } from '../image/ImageWithLInk';
import { convertSizesToList, convertSizesToListOriginal } from '../../helper/helper'

// normal card images 
export const CardImage = ({ imageSrc, imageName }) => {
    return (
        <div className="image-container">
            <img src={imageSrc} alt={imageName} />
        </div>
    )
}


// card image with copy link functionality 
export const CardImageWithCopyLink = ({ imageSrc, imageName, alterPath, additionalClass }) => {
    const { openToast, closeToast } = useStateContext()

    const handleClick = (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(alterPath);
        openToast('success', 'Linked copied successfully');
        closeToast(2000);

    };

    return (
        <div className="image-container">
            <img src={imageSrc} alt={imageName} className={`${additionalClass ? additionalClass : ''}`} />
            <span className="copy-button" onClick={handleClick}>{copyImage}</span>
        </div>
    )
}

// card image block image functionality
export const CardImageWithBlockUnBlock = ({ imageSrc, imageId, action }) => {
    const { openToast, closeToast } = useStateContext()

    const handleClick = (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(imageSrc);
        openToast('success', 'Linked copied successfully');
        closeToast(2000);
    };

    return (
        <div className="image-container">
            <img src={imageSrc} alt={imageId} onClick={handleClick} />
            <SecondaryCollaplseButton
                additionalClass='absolute-button'
                size='s'
                logo={true}
                logoType='svg'
                logoSrc={unblockInnerLogo}
                label="Unblock"
                action={() => action(imageSrc, imageId)}
            />
        </div>
    )
}



// map image cards 
export const MappingCards = ({ title, imageId, imageSrc, mappingFunction, btnId }) => {
    return (
        <div className='card mapping-card'>
            <CardImage imageSrc={imageSrc} imageName={imageId} />
            <Title size='xxs'>{title ? title : 'N/A'}</Title>
            <LightParagraph size='xxs'>Map Id {imageId}</LightParagraph>
            <SecondaryButton
                additionalClass='dark-text'
                label='Map Images'
                size='s'
                action={mappingFunction}
                id={btnId}
            />
        </div>
    )

}


// download image cards 
export const BlockImageCard = ({ imageId, imageSrc, action }) => {
    return (
        <div className='card block-image-card'>
            <CardImageWithBlockUnBlock imageSrc={imageSrc} imageId={imageId} action={action} />
        </div>
    )
}




// download image cards 
export const DownloadCard = ({ selectionMode, selectedCard, title, imageId, imageSrc, formData, addCard, removeCard, data }) => {

    const [field, setFields] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const [selectedOption, setSelectedOption] = useState('rescale')
    const [tempSize, setTempSize] = React.useState('');
    const { openToast, closeToast } = useStateContext()
    const [selected, setSelected] = useState(false);
    const [allSelectedCard, setAllSelectedCard] = useState([])
    const [selection, setSelection] = useState(selectionMode)
    const imageSize = [...convertSizesToListOriginal(data.original_size), ...convertSizesToList(data.sizes_avail)]






    // react input handler
    const handleOption = (event) => {
        setSelectedOption(event.target.value);
        validationField('customSize', field.customSize.value, setError, setErrorMessage)
    }

    const handleCustomSize = (inputValue) => {
        // console.log('handle custom size call ')
        setTempSize(inputValue);
    };

    const handleCustomSizeChange = (selectedOptions) => {
        console.log('selected option', selectedOptions)
        if (selectedOptions) {
            updateData('customSize', selectedOptions, setFields)
            validationField('customSize', selectedOptions.value, setError, setErrorMessage)
        }
    };




    // download click handler 
    const downloadClickHandler = async () => {
        let option = selectedOption
        switch (option) {
            case "crop": cropImageHandeler();
                break;
            case "rescale": rescalehandeler();
                break;
        }
    }



    // crop click handeler 
    const cropImageHandeler = () => {
        console.log('crop')
        let downloadApi = `${apis.downloadImageFromInventory}?imageId=${imageId}&size=${field.customSize.value}&type=2`
        if (formData.customerId.length > 0) {
            downloadApi += `& customerId=${formData.customerId}`;
        }
        if (formData.siteName.length > 0) {
            downloadApi += `& siteName=${formData.siteName}`;
        }
        if (formData.purpose.length > 0) {
            downloadApi += `& purpose=${formData.purpose}`;
        }
        let imageName = 'id_' + imageId + '_' + field.customSize.value + '.jpg'
        downloadImage(downloadApi, imageName, openToast, closeToast)

    }

    // rescale click handeler 
    const rescalehandeler = () => {
        console.log('rescalling')

        let downloadApi = `${apis.downloadImageFromInventory}?imageId=${imageId}&size=${field.customSize.value}&type=1`
        if (formData.customerId.length > 0) {
            downloadApi += `& customerId=${formData.customerId}`;
        }
        if (formData.siteName.length > 0) {
            downloadApi += `& siteName=${formData.siteName}`;
        }
        if (formData.purpose.length > 0) {
            downloadApi += `& purpose=${formData.purpose}`;
        }
        let imageName = 'id_' + imageId + '_' + field.customSize.value + '.jpg'
        downloadImage(downloadApi, imageName, openToast, closeToast)


    }



    // copy text to the clipboard 
    const copytext = (imageId) => {
        navigator.clipboard.writeText(imageId);
        openToast('success', 'Image Id copied successfully');
        closeToast(2000);
    }

    // check if this card is present in the list

    const checkPresence = (data, id) => {
        return new Promise((res, rej) => {
            let filterData = data.filter((d) => {
                // console.log(d.imageId, id)
                if (d.imageId === id) {
                    return d
                }
            })
            if (filterData.length > 0) {
                return res(true)
            } else {
                return res(false)
            }
        })
    }



    // Click handler for selection
    const handleCardClick = (e) => {
        // console.log(allSelectedCard)
        checkPresence(allSelectedCard, imageId).then((present) => {
            if (present) {
                setSelected(false)
                removeCard(imageId)
            } else {
                setSelected(true)
                let url = getPathBySize(imageSrc, field.customSize.value)
                addCard({ title, imageId, url })
            }
        })
    };


    useEffect(() => {
        if (formData.size.label === 'Original') {
            updateData('customSize', ...convertSizesToListOriginal(data.original_size), setFields)

        } else {
            updateData('customSize', formData.size, setFields)
        }
    }, [formData.size])

    useEffect(() => {
        setAllSelectedCard(selectedCard)
        if (selectedCard.length <= 0) {
            setSelected(false)
        }
    }, [selectedCard])


    useEffect(() => {
        setSelection(selectionMode)
    }, [selectionMode])




    return (
        <div className={`card download-card ${selected ? 'selected' : ''}`} onClick={handleCardClick}>

            <ImagesWithLink
                className=''
                path={getPathBySize(imageSrc, formData.size.value)}
                alt={imageId}
                alterPath={getPathBySize(imageSrc, formData.size.value)}
            />


            <Title additionalClass='light' size='xxs' >{title ? title : 'N/A'}</Title>

            <div className='copy-button-container'>
                <LightParagraph size='xxs' >Image Id {imageId}</LightParagraph>
                {
                    !selection && <IconButton
                        additionalClass='gray-btn'
                        logoSrc={copyIcon}
                        action={() => copytext(imageId)}
                    />
                }

            </div>

            {
                !selection && <>


                    <form className="form" onSubmit={preventFormSubmit}>
                        <div className="form-row">
                            <RadioButton
                                additionalClass='radio-button'
                                // id="rescale_id"
                                id={`rescale_id-${imageId}`}
                                name={`dOption-${imageId}`}
                                label={`Rescale Image`}
                                inputHandler={handleOption}
                                selectedOption={selectedOption}
                                autoFocus={false}
                                value="rescale"
                            />

                            <RadioButton
                                additionalClass='radio-button'
                                // id="crop_id"
                                id={`crop_id-${imageId}`}
                                name={`dOption-${imageId}`}
                                label={`Crop Image`}
                                inputHandler={handleOption}
                                selectedOption={selectedOption}
                                autoFocus={false}
                                value="crop"
                            />
                        </div>
                        <div className="form-row">
                            <ReactSelectCreatable
                                additionalClass=""
                                id="customSize_id"
                                name="customSize"
                                errorId="customSize_id"
                                error={error.customSize}
                                errorMessage={errorMessage.customSize}
                                type="text"
                                placeholder="Enter Size"
                                label={false}
                                required={true}
                                value={field.customSize}
                                options={imageSize}
                                tempKeyword={tempSize}
                                tempKeywordHandeler={handleCustomSize}
                                onChangeHandeler={handleCustomSizeChange}
                                onKeyHandler={(event) => singleInputHandleKeyDown(event, 'customSize', setTempSize, field, setFields, setError, setErrorMessage)}
                                onBlur={(event) => singleInputHandleBlur(event, 'customSize', setTempSize, field, setFields, setError, setErrorMessage)}
                                disable={false}
                            />

                            <IconButton
                                logoType='svg'
                                logoSrc={downloadIconWhite}
                                action={downloadClickHandler}
                            />

                        </div>
                    </form>
                </>
            }




        </div>
    )

}



// download image cards 
export const EditCard = ({ selectionMode, selectedCard, title, imageId, imageSrc, formData, addCard, removeCard, setShowEditImageOverLay, setImageId }) => {

    const [field, setFields] = useState(inputsField);
    const { openToast, closeToast } = useStateContext()
    const [selected, setSelected] = useState(false);
    const [allSelectedCard, setAllSelectedCard] = useState([])
    const [selection, setSelection] = useState(false)








    // copy text to the clipboard 
    const copytext = (imageId) => {
        navigator.clipboard.writeText(imageId);
        openToast('success', 'Image Id copied successfully');
        closeToast(2000);
    }

    // check if this card is present in the list

    const checkPresence = (data, id) => {
        return new Promise((res, rej) => {
            let filterData = data.filter((d) => {
                // console.log(d.imageId, id)
                if (d.imageId === id) {
                    return d
                }
            })
            if (filterData.length > 0) {
                return res(true)
            } else {
                return res(false)
            }
        })
    }



    // Click handler for selection
    const handleCardClick = (e) => {
        if (selection) {
            checkPresence(allSelectedCard, imageId).then((present) => {
                if (present) {
                    setSelected(false)
                    removeCard(imageId)
                } else {
                    setSelected(true)
                    let url = getPathBySize(imageSrc, field.customSize.value)
                    addCard({ title, imageId, url })
                }
            })
        }

    };


    useEffect(() => {
        updateData('customSize', formData.size, setFields)
    }, [formData])

    useEffect(() => {
        setAllSelectedCard(selectedCard)
        if (selectedCard.length <= 0) {
            setSelected(false)
        }
    }, [selectedCard])


    useEffect(() => {
        setSelection(selectionMode)
    }, [selectionMode])


    const showEditOverlay = () => {
        setShowEditImageOverLay(true) // open overlay
        setImageId(imageId) // set image id
    }


    return (
        <div className={`card download-card edit-card ${selected ? 'selected' : ''}`} onClick={handleCardClick}>

            <ImagesWithLink
                className=''
                path={getPathBySize(imageSrc, formData.size.value)}
                alt={imageId}
                alterPath={getPathBySize(imageSrc, formData.size.value)}
            />

            <div className="content-container">
                <div className="left">
                    <Title additionalClass='light' size='xxs' >{title ? title : 'N/A'}</Title>
                    <div className='copy-button-container'>
                        <LightParagraph size='xxs' >Image Id {imageId}</LightParagraph>
                        {
                            !selection && <IconButton
                                additionalClass='gray-btn '
                                logoSrc={copyIcon}
                                action={() => copytext(imageId)}
                            />
                        }

                    </div>
                </div>
                {/* 
                 <div className="right">
                    <IconButton
                        additionalClass='black-btn'
                        logoType='svg'
                        logoSrc={editIcon}
                        action={showEditOverlay}
                    /> 
                </div>
                */}
                <OutlineButton
                    size='s'
                    label='Edit & Download'
                    action={showEditOverlay}
                />
            </div>




        </div>
    )

}

