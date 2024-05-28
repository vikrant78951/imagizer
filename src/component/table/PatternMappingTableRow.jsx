import React, { useState, useEffect } from 'react'
import './MapNReviewTable.css'
import { LightParagraph } from '../typhography/Typography';
import mapMoreImage from '../../assets/img/mapMoreImage.png'
import { IconButton, PrimaryButton } from '../button/Button';
import { mapMore, dropDownBox, dropUpBox } from '../../assets/icon/Icon';
import { getPathBySize, logoutHelper } from '../../helper/helper';
import { ImagesWithLink } from '../image/ImageWithLInk';
import { apis } from '../../data/data';
import { useStateContext } from '../../contexts/ContextProvider'
import DeletePattern from '../deletePattern/DeletePattern';
import Tooltip from '../tooltip/Tooltip';
import { ClickableImages } from '../image/ImageWithLInk';

const MapNReviewTableRow = (props) => {

    const {
        rowId,
        deleteRow,
        deleteInnerRow,
        visibleRows,
        additionalClass,
        handleMapMore,
        customSize,
        handleShowMoreClick,
        dataLength,
        keywordPattern,
        siteName,
        priority
    } = props

    const {
        adminEmail,
        adminId,
        author,
        domain,
        isBlockedKeyword,
        mappingDate,
        mappingType,
        originalImageId,
        originalImageType,
        rank,
        reviewFlag,
        path,
    } = props.tableData;



    const [tempSize, setTempSize] = useState(customSize)
    const rowNumber = parseInt(rowId.split("-")[3]);
    const [visibleRow, setVisibleRow] = useState(visibleRows);
    const { openToast, closeToast, setAuthenticate } = useStateContext();


    // initialize temp size and visible row 
    useEffect(() => {
        setTempSize(customSize)
        setVisibleRow(visibleRows)
    }, [customSize, visibleRows])


    const deleteMapedImage = async (keywordPattern, siteName, originalImageId) => {
        openToast('loading', 'Deleting Image')

        const apiUrl = `${apis.removePatternImage}?pattern=${encodeURIComponent(keywordPattern)}&siteName=${encodeURIComponent(siteName)}&original_image_id=${originalImageId}`
        const requestOptions = {
            method: 'GET',
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
                } else if (data.status = 'success') {
                    deleteInnerRow(rowId)
                    openToast('success', 'Image Delated')
                    closeToast(3000)
                }
            })
            .catch(error => {
                console.error('Error:', error);
                openToast('error', error.message)
                closeToast(3000)
            });

    }

    return (
        <>
            <tr className={additionalClass ? additionalClass : ''}>
                <td>
                    <Tooltip text='Delete pattern'>
                        <DeletePattern
                            pattern={keywordPattern}
                            siteName={siteName}
                            rowId={rowId}
                            deleteRow={deleteRow}
                            confirmation={true}
                        />
                    </Tooltip>
                </td>
                <td>


                    {
                        path ?
                            <ImagesWithLink
                                className=''
                                path={path ? getPathBySize(path ? path : mapMoreImage, tempSize) : mapMoreImage}
                                alt={''}
                                alterPath={getPathBySize(path ? path : mapMoreImage, tempSize)}
                            />
                            :
                            <ClickableImages
                                path={mapMoreImage}
                                alt={''}
                                action={handleMapMore}
                                alterPath={mapMoreImage}
                            />
                    }

                </td>
                <td>
                    <div className="info">
                        {originalImageId !== '' || originalImageId == 0  && <LightParagraph size='xxs'><span className='data'>Image Id  </span> <span className='value bold'>{originalImageId === '' ? 'N/A' : originalImageId}</span>  </LightParagraph>}
                        {author && <LightParagraph size='xxs'><span className='data'>Admin  </span> <span className='value bold'>{author === '' ? 'N/A' : author}</span>  </LightParagraph>}
                        {adminEmail && <LightParagraph size='xxs'><span className='data'>Email  </span> <span className='value bold'>{adminEmail === '' ? 'N/A' : adminEmail}</span>  </LightParagraph>}
                        {siteName && <LightParagraph size='xxs'><span className='data'>Site Name  </span> <span className='value bold'>{siteName === '' ? 'N/A' : siteName}</span>  </LightParagraph>}
                        {priority && <LightParagraph size='xxs'><span className='data'>Priority  </span> <span className='value bold'>{priority === '' ? 'N/A' : priority}</span>  </LightParagraph>}
                    </div>
                </td>
                <td>
                    <div className="review-container">
                        {
                            originalImageId ? <Tooltip text='Delete image'>
                                <PrimaryButton
                                    size='s'
                                    label='Delete'
                                    action={() => deleteMapedImage(keywordPattern, siteName, originalImageId)}
                                />
                            </Tooltip> : null
                        }

                    </div>
                </td>
                <td>


                    <div className="action-container">

                        <Tooltip text='Map more pattern '>
                            <IconButton
                                logoSrc={mapMore}
                                action={handleMapMore}
                            />
                        </Tooltip>


                        {/* dorpdown button  */}
                        {
                            (dataLength > 1 && rowNumber === 0) &&

                            <span className='showMore'
                                onClick={handleShowMoreClick
                                }>
                                <Tooltip text='Click to Show More'
                                    tooltip_position='left'
                                >
                                    {visibleRow > 1 ? dropUpBox : dropDownBox}
                                </Tooltip>
                            </span>

                        }


                    </div>



                </td>
            </tr>



        </>
    )
}

export default MapNReviewTableRow