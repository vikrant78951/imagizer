import React, { useState, useEffect } from 'react'
import './MapNReviewTable.css'
import PatternMappingTableRow from './PatternMappingTableRow';
import Popup from '../popup/Popup';
import MapPattern from '../mapImage/MapPattern';
import { dropUpBox } from '../../assets/icon/Icon';
import { DarkParagraph } from '../typhography/Typography';

const PatternMappingBody = ({ SingleTableData, bodyId, size, addInnerRow, deleteInnerRow, deleteRow }) => {

    // states and variables 
    const [visibleRows, setVisibleRows] = useState(1); // update initial state to 1
    const [mappedImages, setMappedImages] = useState([]);
    const [pattern, setpattern] = useState([]);
    const [tempSize, setTempSize] = useState(size)
    const [mapKeywordPopup, setMapKeywordPopup] = useState(false)


    // udpate temp size when size changed
    useEffect(() => {
        setTempSize(size)
    }, [size])

    // udpate temp tabledata when data changed
    useEffect(() => {
        setMappedImages(SingleTableData.mappedImages)
        setpattern(SingleTableData)
    }, [SingleTableData])

    useEffect(()=>{
        if (visibleRows !== 1) {
            setVisibleRows(mappedImages.length);
        }
    },[mappedImages])
      


    // show more click handeler
    function handleShowMoreClick() {
        if (visibleRows === 1) {
            setVisibleRows(mappedImages.length);
        } else {
            setVisibleRows(1);
        }
    }


    // collapse click  handeler
    function handleCollapseClick() {
        if (mappedImages.length > 1) {
            setVisibleRows(1);
        }
    }


    // popup close click handeler
    const handleMapMore = () => {
        setMapKeywordPopup(true)
    }
    const closeMapKeywordPopup = () => {
        setMapKeywordPopup(false)
    }





    return (
        <>
            <tbody data-table_row={bodyId}>


                {mappedImages && mappedImages.length > 0 && mappedImages.map((tableRow, index) => {
                    const isHidden = (index >= visibleRows) ? 'row-hidden' : 'row-visible';
                    return (
                        <PatternMappingTableRow
                            id={pattern.id ? pattern.id : ''}
                            keywordPattern={pattern.keywordPattern ? pattern.keywordPattern : ''}
                            siteName={pattern.siteName ? pattern.siteName : ''}
                            priority={pattern.priority ? pattern.priority : ''}
                            path={tableRow.path ? tableRow.path : ''}
                            tableData={tableRow}
                            key={index}
                            deleteRow={deleteRow}
                            deleteInnerRow={deleteInnerRow}
                            rowId={bodyId + '-row-' + index}
                            additionalClass={isHidden}
                            customSize={tempSize}
                            dataLength={mappedImages.length}
                            handleShowMoreClick={handleShowMoreClick}
                            visibleRows={visibleRows}
                            handleMapMore={handleMapMore}
                        />
                    );
                })}

                {/* show more and collapse button  */}
                {mappedImages.length > 1 && (
                    <tr className='collapse-tr'>
                        {visibleRows > 1 &&
                            <td colSpan={5}
                                onClick={handleCollapseClick}>
                                <div className="collapse-all">
                                    <DarkParagraph size='xs'>Collapse All</DarkParagraph>
                                    <span className="show-all-icon">{dropUpBox} </span>
                                </div>
                            </td>
                        }
                    </tr>
                )}


                {/* map more popups  */}
                {
                    mapKeywordPopup && <tr>
                        <td>
                            <Popup
                                title={<>Map Pattern '<span className='bold'>{pattern.keywordPattern}</span>'</>}
                                additionalClass="full-size map-pattern"
                                closePopup={closeMapKeywordPopup}
                            >
                                <MapPattern
                                    tableData={pattern}
                                    bodyId={bodyId}
                                    addNewRow={addInnerRow}
                                    siteName={pattern.siteName ? pattern.siteName : ''}
                                />
                            </Popup>
                        </td>
                    </tr>
                }



            </tbody>



        </>

    )
}

export default PatternMappingBody