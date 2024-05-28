import React, { useState, useEffect } from 'react'
import './MapNReviewTable.css'
import { LightParagraph } from '../typhography/Typography'
import { ContentWrapper, SectionContainer, WhiteBoard } from '../wrapper/Wrapper'
import { ReactSelect } from '../forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData } from '../forms/Validation'
import { ImageSize, reviewedTypeOptions } from '../../data/data'
import PatternMappingBody from './PatternMappingBody'
import { SecondaryButton } from '../button/Button'
import CreatePattern from '../createPattern/CreatePattern'
import Popup from '../popup/Popup';


const PatternMappingTable = ({ tableDataArray, copyPattern, setCopyPattern, keywords }) => {
    const [tempdata, setTempData] = useState(tableDataArray);
    const [field, setInputs] = useState(inputsField);
    const [size, setSize] = useState('250x150');
    const error = errorField;
    const errorMessage = errorMessagefield;
    const [dataCount, setDataCount] = useState((tempdata) ? [...tempdata].length : 0)
    const [createPatternPopup, setCreatePatternPopup] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [defaultPattern, setDefaultPattern] = useState(true)

    // initial size and reviewed type 
    useEffect(() => {
        updateData('size', ImageSize[0], setInputs)
        updateData('reviewedType', reviewedTypeOptions[0], setInputs)
        setCreatePatternPopup(copyPattern)
        setKeyword(keywords)
    }, []);

    // initial size and reviewed type 
    useEffect(() => {
        setCreatePatternPopup(copyPattern)
    }, [copyPattern]);


    // init data
    useEffect(() => {
        setDataCount(tempdata.length)
    }, [tempdata])

    // update when data change
    useEffect(() => {
        setKeyword(keywords)
    }, [keywords])


    // open and close pattern mapping popup 
    const openPatternMapingPopup = () => {
        setDefaultPattern(false)
        setCopyPattern(true)
    }

    const closePatternMapingPopup = () => {
        setDefaultPattern(true)
        setCopyPattern(false);
    }


    const incrementDataCount = () => setDataCount(prev => {
        return ++prev
    })
    const decrementDataCount = () => setDataCount(prev => {
        if (prev !== 0) {
            return --prev
        } else {
            return prev
        }

    })


    // filter size
    const sizeHandeler = (option) => {
        updateData('size', option, setInputs)
        setSize(option.value)
    }

    // add pattern 
    const addNewRow = (rowData) => {
        setTempData((prevState) => {
            console.log('adding row ', rowData)
            const newData = [rowData, ...prevState];
            return newData;
        });
    };

    // add data to pattern 
    const addInnerRow = (row, id) => {
        console.log('add inner row in', id, row)

        let rowId = Number(id.slice(6))
        setTempData(prevState => {
            const updatedData = prevState.map((data, index) => {
                if (index === rowId) {
                    let oldDataSet = data.mappedImages.filter(e => e.originalImageId !== 0)
                    if (oldDataSet.length <= 0) {
                        incrementDataCount()
                    }
                    return {
                        ...data,
                        mappedImages: [row, ...oldDataSet],
                    };
                }
                console.log('after adding row ', data)
                return data;
            });

            return updatedData;
        });

    }

    // delete Row
    const deleteRow = (tableId) => {
        const regex = /(\d+)/g;
        const numbers = tableId.match(regex);
        const tableNumber = parseInt(numbers[0]);
        const rowNumber = parseInt(numbers[1]);
        console.log('delete Row', tableNumber, 'rowid', rowNumber)
        setTempData(prevState => prevState.filter((element, index) => index !== tableNumber))
    }

    // delete inner  Row
    const deleteInnerRow = (tableId) => {
        const regex = /(\d+)/g;
        const numbers = tableId.match(regex);
        const tableNumber = parseInt(numbers[0]);
        const rowNumber = parseInt(numbers[1]);
        console.log('delete Inner Row', tableNumber, 'rowid', rowNumber)
        setTempData(prevState => {
            const updatedData = prevState.map((data, index) => {
                if (index === tableNumber) {
                    let newDataSet = data.mappedImages.filter((element, index) => index !== rowNumber)
                    if (!newDataSet.length > 0) {
                        newDataSet = [{
                            "0": {
                                "id": 0,
                                "siteName": "testingPattern",
                                "keywordPattern": "testingPattern",
                                "priority": 1,
                                "mappedImages": [
                                    {
                                        "rank": 1,
                                        "reviewFlag": "1",
                                        "originalImageId": 0,
                                        "adminId": 0,
                                        "adminEmail": "",
                                        "author": "",
                                        "isBlockedKeyword": false,
                                        "domain": "",
                                        "mappingType": "",
                                        "mappingDate": "",
                                        "originalImageType": ""
                                    }
                                ]
                            }
                        }]
                    } else {
                        decrementDataCount()
                    }
                    return {
                        ...data,
                        mappedImages: [...newDataSet],
                    };
                }
                console.log('after removing row ', data)

                return data;
            });

            return updatedData;
        });
    }


    return (

        <SectionContainer additioalClass='mapnreview-table pattern-mapping'>
            <ContentWrapper>
                {tempdata && tempdata.length > 0 ?
                    <WhiteBoard>
                        <div className="table-head">

                            <LightParagraph size='m'>
                                <span className="bold">{dataCount}</span> results found
                            </LightParagraph>

                            <div className="filter">
                                <ReactSelect
                                    additioalClass='not-creatable'
                                    id="size_at"
                                    label={false}
                                    required={false}
                                    option={ImageSize}
                                    inputHandler={sizeHandeler}
                                    errorId="size_at-error"
                                    error={error.size}
                                    value={field.size}
                                    errorMessage={errorMessage.size}
                                />
                                <div className="input-container">
                                    <SecondaryButton
                                        size='m'
                                        label='Create Mapping'
                                        action={openPatternMapingPopup}
                                    />
                                </div>

                            </div>

                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th><LightParagraph size='s' type='semiBold'>Keyword</LightParagraph></th>
                                    <th><LightParagraph size='s' type='semiBold'>Image</LightParagraph></th>
                                    <th><LightParagraph size='s' type='semiBold'>Info</LightParagraph></th>
                                    <th><LightParagraph size='s' type='semiBold'>Delete image</LightParagraph></th>
                                    <th><LightParagraph size='s' type='semiBold'>Mapping</LightParagraph></th>
                                </tr>
                            </thead>
                            {
                                tempdata.map((tableBody, index) => {
                                    return (
                                        <PatternMappingBody
                                            key={index}
                                            SingleTableData={tableBody}
                                            bodyId={'table' + '-' + index}
                                            size={size}
                                            addInnerRow={addInnerRow}
                                            deleteRow={deleteRow}
                                            deleteInnerRow={deleteInnerRow}
                                            incrementDataCount={incrementDataCount}
                                            decrementDataCount={decrementDataCount}
                                        />)
                                })
                            }
                        </table>
                    </WhiteBoard>
                    : ''
                }


                {/* map more popups  */}
                {
                    createPatternPopup &&
                    <Popup
                        additionalClass='create-pattern-popup'
                        title={`Create Pattern`}
                        closePopup={closePatternMapingPopup}
                    >
                        <CreatePattern
                            keyword={keyword}
                            defaultPattern={defaultPattern}
                            closePopup={closePatternMapingPopup}
                            addNewRow={addNewRow}
                        />
                    </Popup>
                }

            </ContentWrapper>
        </SectionContainer >


    )
}

export default PatternMappingTable