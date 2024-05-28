import React, { useState, useEffect } from 'react'
import './MapNReviewTable.css'
import { LightParagraph } from '../typhography/Typography'
import { ContentWrapper, SectionContainer, WhiteBoard } from '../wrapper/Wrapper'
import { Checkbox, ReactSelect } from '../forms/FormElements'
import { shortDataByKeyword } from '../../helper/helper'
import { inputsField, errorField, errorMessagefield, updateData } from '../forms/Validation'
import { ImageSize, reviewedTypeOptions } from '../../data/data'
import { sortByReviewFlag, getArrayCount } from '../../helper/helper'
import MapNReviewTableBody from './MapNReviewTableBody'
import { Loader } from '../loader/Loader'
import { NoData } from '../noresult/NoResult'
import { DropdownMenu } from '../dropdown/Dropdown'
import { menu } from '../../assets/icon/Icon'
import { createCSV, createZip2 } from '../../helper/helper'
import { useStateContext } from '../../contexts/ContextProvider';


const MapNReviewTable = ({ tableDataArray }) => {

    const submenu = [
        {
            id: 2,
            title: 'Export CSV',
            value: 'csv',
            logo: false,
        },
        {
            id: 2,
            title: 'Export Images Zip',
            value: 'zip',
            logo: false,
        },
    ]

    const [tableData, setTableData] = useState(shortDataByKeyword(tableDataArray));
    const [tempdata, setTempData] = useState(shortDataByKeyword(tableDataArray));
    const [field, setInputs] = useState(inputsField);
    const [size, setSize] = useState('250x150');
    const error = errorField;
    const errorMessage = errorMessagefield;
    const [dataCount, setDataCount] = useState(0)
    const [filtering, setFiltering] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const { openToast, closeToast } = useStateContext()
    const [allSelected, setAllSelected] = useState(false)
    const [selectedCard, setSelectedCard] = useState([])


    // initial size and reviewed type 
    useEffect(() => {
        updateData('size', ImageSize[0], setInputs)
        updateData('reviewedType', reviewedTypeOptions[0], setInputs)
    }, []);

    useEffect(() => {
        let count = getArrayCount(tempdata)
        setDataCount(count);
    }, [tempdata])

    useEffect(() => {
        console.log('table data changes with all selected', allSelected)
        if (allSelected) {
            setSelectedCard(tableData.flatMap((group) => group));
        }
    }, [tableData])


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



    // filter review type
    const typeHandler = (option) => {
        setSelectedCard([])
        setAllSelected(false)
        setFiltering(true)
        updateData('reviewedType', option, setInputs)
        sortByReviewFlag(tableData, option.value).then(filteredData => {
            if (filteredData && filteredData.length > 0) {
                setTempData(filteredData)
                setFiltering(false)
                setNoResult(false)
            } else {
                setTempData([])
                setNoResult(true)
                setFiltering(false)
            }
        })
    }

    // filter size
    const sizeHandeler = (option) => {
        updateData('size', option, setInputs)
        setSize(option.value)
    }


    // selections 
    const checkboxHandler = (event) => {
        const checked = event.target.checked;
        if (checked) {
            setAllSelected(true)
            setSelectedCard(tableData.flatMap((group) => group));
        } else {
            setAllSelected(false)
            setSelectedCard([]);
        }
    }

    const handleRowSelect = (row, checked) => {
        if (checked) {
            setSelectedCard([...selectedCard, row]);
        } else {
            setSelectedCard(selectedCard.filter((selectedRow) => selectedRow !== row));
            setAllSelected(false)
        }
    };

    // export functionality 
    const exportCSV = () => { // export card
        createCSV(selectedCard, 'Images').then(blob => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute("download", 'images');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

    const exportImages = () => {
        openToast('loading', 'Exporting Images')
        createZip2(selectedCard, size).then((zip) => { // create zip
            zip.generateAsync({ type: "blob" }).then((content) => {
                const zipLink = document.createElement("a");
                zipLink.href = URL.createObjectURL(content);
                zipLink.setAttribute("download", "images.zip");
                zipLink.innerHTML = "Download Images ZIP";
                document.body.appendChild(zipLink);
                zipLink.click();
                document.body.removeChild(zipLink);
                openToast('success', 'File Exported')
                closeToast(3000)
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    const exportClickHandler = (value) => {
        console.log(selectedCard)
        if (selectedCard.length <= 0) {
            openToast('error', 'Please select file')
            closeToast(2000)
            return
        }

        if (value === 'csv') {
            exportCSV()
            return
        }

        if (value === 'zip') {
            exportImages()
            return
        }
    }

    const updateRow = (index, data, option) => {
        const newData = [...tableData];

        if (option === 'good') {

            newData[index] = newData[index].map(item => {
                if (item.originalImageId === data.originalImageId) {
                    return {
                        ...item,
                        reviewedGood: true,
                        reviewFlag: '1'
                    };
                }
                return item;
            });
        } else if (option === 'bad') {
            newData[index] = newData[index].filter(item => item.originalImageId !== data.originalImageId);
        }
        setTableData(newData);
    };


    return (

        <SectionContainer additioalClass='mapnreview-table'>
            <ContentWrapper>
                <WhiteBoard>

                    {/* filter table head  */}
                    <div className="table-head">

                        {/* total result  */}
                        <LightParagraph size='m'>
                            <span className="bold">{dataCount} </span> results found
                        </LightParagraph>

                        {/* filter */}
                        <div className="filter">
                            <ReactSelect
                                additioalClass='not-creatable'
                                id="reviewedType"
                                label={false}
                                required={false}
                                option={reviewedTypeOptions}
                                inputHandler={typeHandler}
                                errorId="reviewedType-error"
                                error={error.reviewedType}
                                value={field.reviewedType}
                                errorMessage={errorMessage.reviewedType}
                            />
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


                        </div>

                    </div>


                    <table className="table">
                        <thead>
                            <tr>
                                <th>
                                    <form className="form horizontal-gap-layout">
                                        <div className="form-row">
                                            <Checkbox
                                                additionalClass=''
                                                id="uploadedImages_at"
                                                name="uploadedImages"
                                                label={false}
                                                inputHandler={checkboxHandler}
                                                autoFocus={false}
                                                checked={allSelected}
                                            />
                                            <DropdownMenu
                                                additionalClass='left'
                                                submenu={submenu}
                                                logo={menu}
                                                title={false}
                                                type='click'
                                                callback={exportClickHandler}
                                            />
                                        </div>
                                    </form>
                                </th>
                                <th><LightParagraph size='s' type='semiBold'>Keyword</LightParagraph></th>
                                <th><LightParagraph size='s' type='semiBold'>Image</LightParagraph></th>
                                <th><LightParagraph size='s' type='semiBold'>Info</LightParagraph></th>
                                <th><LightParagraph size='s' type='semiBold'>Review Images</LightParagraph></th>
                                <th><LightParagraph size='s' type='semiBold'>Mapping</LightParagraph></th>
                            </tr>
                        </thead>

                        {
                            !filtering && tempdata.map((tableBody, index) => {
                                return (
                                    <MapNReviewTableBody
                                        key={index}
                                        SingleTableData={tableBody}
                                        id={'table' + '-' + index}
                                        bodyId={index}
                                        size={size}
                                        setAllSelected={setAllSelected}
                                        selectedCard={selectedCard}
                                        onRowSelect={handleRowSelect}
                                        incrementDataCount={incrementDataCount}
                                        decrementDataCount={decrementDataCount}
                                        updateRow={updateRow}
                                    />
                                )
                            })
                        }

                        {
                            filtering && <tfoot className="td-loader-container">
                                <tr className="loader-container">
                                    <td colSpan='5'>
                                        <Loader />
                                    </td>
                                </tr>
                            </tfoot>

                        }

                        {
                            noResult &&
                            <tfoot className="td-loader-container">
                                <tr className="loader-container">
                                    <td colSpan='5'>
                                        <NoData />
                                    </td>
                                </tr>
                            </tfoot>
                        }




                    </table>


                </WhiteBoard>
            </ContentWrapper>
        </SectionContainer>


    )
}

export default MapNReviewTable