import React, { useState, useEffect } from 'react'
import './MapNReviewTable.css'
import MapNReviewTableRow from './MapNReviewTableRow';
import { dropUpBox } from '../../assets/icon/Icon';
import { DarkParagraph } from '../typhography/Typography';
import Popup from '../popup/Popup';
import MapImage from '../mapImage/MapImage';

const MapNReviewTableBody = ({ selectedCard, onRowSelect, SingleTableData, bodyId, id, size, incrementDataCount, decrementDataCount, updateRow }) => {

    // states and variables 
    const [visibleRows, setVisibleRows] = useState(1); // update initial state to 1
    const [data, setData] = useState(SingleTableData);
    const [tempSize, setTempSize] = useState(size)
    const [mapKeywordPopup, setMapKeywordPopup] = useState(false)



    useEffect(() => { // udpate temp size when size changed
        setTempSize(size)
    }, [size])

    useEffect(() => { // udpate temp tabledata when data changed
        setData(SingleTableData)
    }, [SingleTableData])

    useEffect(() => {
        if (visibleRows !== 1) {
            setVisibleRows(data.length);
        }
    }, [data])



    // remove row when marked as bad remove data  
    const updateRowReview = (index, option) => {
        if (option === 'bad') {
            setData(prevState => {
                const newData = [...prevState.slice(0, index), ...prevState.slice(index + 1)];
                decrementDataCount()
                return newData;
            });
        }
        if (option === 'good') {
            setData(prevState => {
                const newData = [...prevState];
                newData[index] = { ...newData[index], 'reviewedGood': true, "reviewFlag": "1", };
                console.log(newData[index])
                decrementDataCount()
                return newData;
            });
        }

        updateRow(bodyId, data[index], option)

    };

 
      


    // Function to toggle the visibility of rows
    const toggleRowVisibility = () => {
        if (visibleRows === 1) {
            setVisibleRows(data.length);
        } else {
            setVisibleRows(1);
        }
    };

    // block status of a keywords
    const [blockStatus, setBlockStatus] = useState(data[0] ? data[0].isBlockedKeyword : false);

    // update button color when clicked on block keywords
    const handleBlockStatusChange = (newStatus) => {
        setBlockStatus(newStatus);
    };


    // popup close click handeler
    const handleMapMore = () => {
        setMapKeywordPopup(true)
    }
    const closeMapKeywordPopup = () => {
        setMapKeywordPopup(false)
    }



    // add new row when map more images
    const addNewRow = (rowData) => {
        setData((prevState) => {
            const filterData = prevState.filter(item => item.type !== "noImage")
            const hasNoImage = prevState.filter(item => item.type === "noImage")
            if (hasNoImage.length === 0) {
                incrementDataCount()
            }
            const newData = [rowData, ...filterData];
            return newData;
        });
    };


    return (
        <>


            <tbody data-tableid={id}>

                {data && data.map((tableRow, index) => {
                    const isHidden = index >= visibleRows ? 'row-hidden' : 'row-visible';

                    return (
                        <MapNReviewTableRow
                            index={index}
                            tableData={tableRow}
                            key={index}
                            blockStatus={blockStatus}
                            handleBlockStatusChange={handleBlockStatusChange}
                            rowId={id + '-row-' + index}
                            updateRowReview={updateRowReview}
                            additionalClass={isHidden}
                            size={tempSize}
                            dataLength={data.length}
                            handleShowMoreClick={toggleRowVisibility}
                            visibleRows={visibleRows}
                            handleMapMore={handleMapMore}
                            selectedCard={selectedCard}
                            onRowSelect={onRowSelect}

                        />
                    );
                })}


                {/* show more and collapse button  */}
                {data.length > 1 && (
                    <tr className='collapse-tr'>
                        {visibleRows > 1 && (
                            <td colSpan={6}
                                onClick={toggleRowVisibility}>
                                <div className="collapse-all">
                                    <DarkParagraph size='xs'>Collapse All</DarkParagraph>
                                    <span className="show-all-icon">{dropUpBox} </span>
                                </div>
                            </td>
                        )}
                    </tr>
                )}

                {/* map more popups  */}
                {
                    mapKeywordPopup &&
                    <tr>
                        <td>
                            <Popup
                                // title="Map from Inventory"
                                title={<>Map more images for '<span className='bold'>{data[0].keyword}</span>'</>}
                                additionalClass="full-size"
                                closePopup={closeMapKeywordPopup}
                            >
                                <MapImage
                                    tableData={data}
                                    addNewRow={addNewRow}
                                />
                            </Popup>
                        </td>
                    </tr>
                }

            </tbody>
        </>

    )
}

export default MapNReviewTableBody

