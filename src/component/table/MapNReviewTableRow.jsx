import React, { useState, useEffect } from 'react'
import './MapNReviewTable.css'
import BlockKeywordBtn from '../blockKeywordBtn/BlockKeywordBtn';
import { DarkParagraph, LightParagraph } from '../typhography/Typography';
import mapMoreImage from '../../assets/img/mapMoreImage.png'
import ChangeReview from '../changeReview/ChangeReview';
import { IconButton } from '../button/Button';
import { mapMore, copyMapping, dropDownBox, dropUpBox } from '../../assets/icon/Icon';
import { getPathBySize } from '../../helper/helper';
import { ImagesWithLink, ClickableImages } from '../image/ImageWithLInk';
import CopyMappingPopup from '../copyMapping/CopyMappingPopup';
import { IconButtonWithChildren } from '../button/Button';
import Tooltip from '../tooltip/Tooltip';
import { textShortner } from '../../helper/helper';
import { closeAllDropdown } from '../../helper/helper';
import { Checkbox } from '../forms/FormElements';


const MapNReviewTableRow = ({ selectedCard, onRowSelect, rowId, tableData, blockStatus, handleBlockStatusChange, updateRowReview, visibleRows, additionalClass, handleMapMore, handleCopyMapping, size, handleShowMoreClick, dataLength, }) => {

    const { adminEmail, author, keyword, mappingDate, path, displaySiteName, imageTypeDisplay, isTaxonomy, reviewedGood, reviewFlag, originalImageId } = tableData;
    const review = reviewedGood && !isTaxonomy ? 'good' : reviewFlag === '10' ? 'bad' : 'unreviewed'
    const [tempSize, setTempSize] = useState(size)
    const rowNumber = parseInt(rowId.split("-")[3]);
    const [visibleRow, setVisibleRow] = useState(visibleRows);
    const isChecked = selectedCard.some((selectedRow) => selectedRow === tableData);

    // initialize temp size and visible row 
    useEffect(() => {
        setTempSize(size)
        setVisibleRow(visibleRows)
    }, [size, visibleRows])

    // pass row id to remove row 
    const changeReview = (option) => {
        updateRowReview(rowNumber, option)
    }

    // Handle dropdown
    const dropdownClick = (e) => {
        closeAllDropdown();
        const currentDropdown = e.target.closest('.dropdown');
        if (currentDropdown) {
            currentDropdown.classList.add('active');
        }
    };


    // Add click event listener to the dropdown content
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-content')) {
            e.stopPropagation(); // Stop event propagation to prevent closing the dropdown
        }
    });


    // handle checkbox click 
    const checkboxHandler = (event) => {
        onRowSelect(tableData, event.target.checked);
    }

    return (
        <>
            <tr className={additionalClass ? additionalClass : ''} data-rowid={`${rowId}`}>
                <td>
                    <form className="form horizontal-gap-layout">
                        <div className="form-row">
                            <Checkbox
                                id={`uploadedImages_at-${rowId}`}
                                name={`uploadedImages-${rowId}`}
                                label={false}
                                inputHandler={checkboxHandler}
                                autoFocus={false}
                                checked={isChecked}
                            />
                        </div>
                    </form>
                </td>
                <td>
                    {/* <Tooltip text={`${keyword}`}> */}
                    <DarkParagraph size="xs" additionalClass='value '>{keyword}</DarkParagraph>
                    {/* </Tooltip> */}
                </td>
                <td>

                    {
                        imageTypeDisplay !== "NO_IMAGE" ?
                            <ImagesWithLink
                                className=''
                                path={imageTypeDisplay !== "" ? getPathBySize(path, tempSize) : mapMoreImage}
                                alt={author}
                                alterPath={getPathBySize(path, tempSize)}
                            />
                            :
                            <ClickableImages
                                path={mapMoreImage}
                                alt={author}
                                action={handleMapMore}
                                alterPath={getPathBySize(path, tempSize)}
                            />
                    }
                </td>
                <td>
                    <div className="info">
                        {originalImageId && <div className='info-detail'>
                            <LightParagraph size="xxs" additionalClass='data'>ID  </LightParagraph>
                            <LightParagraph size="xxs" additionalClass='value bold'>{originalImageId === -1 ? 'N/A' : originalImageId}</LightParagraph>
                        </div>}
                        {imageTypeDisplay &&
                            <div className='info-detail'>
                                <LightParagraph size="xxs" additionalClass='data'>Type </LightParagraph>
                                <Tooltip text={`${imageTypeDisplay} ${adminEmail}`}>
                                    <LightParagraph size="xxs" additionalClass='value bold'>{textShortner(`${imageTypeDisplay}  ${adminEmail && `(${adminEmail})`}`, 15)}</LightParagraph>
                                </Tooltip>
                            </div>
                        }
                        {mappingDate && <div className='info-detail'>
                            <LightParagraph size="xxs" additionalClass='data'>Mapping Date  </LightParagraph>
                            <Tooltip text={mappingDate}>
                                <LightParagraph size="xxs" additionalClass='value bold'>{textShortner(mappingDate, 10)}</LightParagraph>
                            </Tooltip>

                        </div>}
                        {displaySiteName && <div className='info-detail'>
                            <LightParagraph size="xxs" additionalClass='data'>Site Name  </LightParagraph>
                            <LightParagraph size="xxs" additionalClass='value bold'>{displaySiteName}</LightParagraph>
                        </div>}
                    </div>
                </td>
                <td>
                    <div className="review-container">
                        {imageTypeDisplay !== "NO_IMAGE" ?
                            <ChangeReview
                                reviewState={review}
                                imageId={originalImageId}
                                keyword={keyword}
                                reveiwHandler={changeReview}
                                mapping_type_id='1'
                            />
                            : <LightParagraph size='xxs'> N/A</LightParagraph>
                        }
                    </div>
                </td>
                <td>


                    <div className="action-container">
                        {/* map more button  */}
                        <IconButton
                            logoSrc={mapMore}
                            action={handleMapMore}
                            tooltip={true}
                            tooltip_position='left'
                            tooltipText='Map more images'
                        />

                        {/* copy mapping button  */}
                        {
                            <IconButtonWithChildren
                                additionalClass={`dropdown`}
                                logoSrc={copyMapping}
                                action={dropdownClick}
                                tooltip={true}
                                tooltip_position='left'
                                tooltipText='Copy mappings to more keywords'
                                disable={imageTypeDisplay === "NO_IMAGE" ? true : false}
                            >
                                <CopyMappingPopup
                                    sourceKeyword={keyword}
                                />
                            </IconButtonWithChildren>

                        }

                        {/* block and unblock keyword  */}
                        <BlockKeywordBtn
                            keyword={keyword}
                            blockStatus={blockStatus}
                            handleBlockStatusChange={handleBlockStatusChange}
                            confirmation={true}
                            tooltip_position='left'
                        />
                    </div>
                    {/* dropdown button  */}
                    {
                        (dataLength > 1 && rowNumber === 0) &&

                        <span className='showMore'
                            onClick={handleShowMoreClick
                            }>
                            <Tooltip
                                text='Click to Show More'
                                tooltip_position='left'
                            >
                                {visibleRow > 1 ? dropUpBox : dropDownBox}
                            </Tooltip>
                        </span>

                    }

                </td>
            </tr>
        </>
    )
}

export default MapNReviewTableRow