import React, { useEffect, useState } from 'react'
import './MapImage.css'
import { createOption, disableButton, enableButton, getFilter, LocalStorage } from '../../helper/helper'
import { mappingType_option, mappingFrom_option } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider'
import { getKeyword, logoutHelper } from '../../helper/helper'
import { Loader } from '../loader/Loader'
import { NoResult } from '../noresult/NoResult'
import CardContainer from '../cards/CardContainer'
import { apis } from '../../data/data'
import { Title } from '../typhography/Typography'

// form elements 
import { SearchKeyword, SingleSearchKeyword } from '../forms/FormElements'
import { inputsField, updateData } from '../forms/Validation'

const MapPattern = ({ tableData, addNewRow, siteName, bodyId }) => {
    const initialData = {
        loading: false,
        data: [],
        sutterStockData: [],
        showCard: false,
        showNoResult: false,
        isFetchingData: false,
        currentPage: 0,
        noMoreData: false,
        showTable: false,
    }
    const [dataObject, setDataObject] = useState(initialData);
    const [keywords, setKeywords] = useState([])
    const [field, setFields] = useState(inputsField);
    const [domain, setDomain] = useState('')
    const [domainCheckbox, setDomainCheckbox] = useState(false)
    const [filter, setFilter] = useState(1)
    const { openToast, closeToast, user, setAuthenticate } = useStateContext();



    // search image 
    const searchKeywordSubmitHandler = (value) => { // keyword  submit handler
        setKeywords(value)
        // let searchText = getKeyword(value);
        let searchText = value;
        setDataObject(prevData => ({ //resting data
            ...prevData,
            data: [],
            currentPage: 0,
        }));

        fetchInventory(0, 12, searchText, true)

    }

    //fetch inventory
    const fetchInventory = async (cp, length, searchText, reset) => {

        if (reset) {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: false,
                showNoResult: false,
                noMoreData: false,
                isFetchingData: true,
                currentPage: 0,
            }));
        } else {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: true,
                showNoResult: false,
                noMoreData: false,
                isFetchingData: true,
            }));
        }

        let apiCallUrl = `${apis.inventoryImage}?start=${cp}&len=${length}&searchText=${encodeURIComponent(searchText)}&size=250x150&filter=${filter}`;

        await fetch(apiCallUrl, {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json())
            .then((data) => {
                if (data.errorMessage === "invalid_session") {
                    logoutHelper()
                    setAuthenticate("false")
                    openToast("error", 'Invalid Session');
                    closeToast(4000);
                } else if (data.message === 'success' && data.response.length > 0) {
                    let temp = []
                    if (!reset) {
                        temp = [
                            ...dataObject.data,
                            ...data.response
                        ]
                    } else {
                        temp = data.response
                    }

                    setDataObject(prevData => ({
                        ...prevData,
                        loading: false,
                        data: temp,
                        showCard: true,
                        showNoResult: false,
                        noMoreData: false,
                        isFetchingData: false,
                    }));

                } else {

                    if (reset) {
                        setDataObject(prevData => ({
                            ...prevData,
                            data: [],
                            showNoResult: true,
                            showCard: false,
                            noMoreData: false,
                            isFetchingData: false,
                            loading: false,
                        }));
                    } else {
                        setDataObject(prevData => ({
                            ...prevData,
                            showNoResult: false,
                            showCard: true,
                            noMoreData: true,
                            isFetchingData: false,
                            loading: false,
                        }));
                    }
                }
            }).catch(error => {

                if (reset) {
                    setDataObject(prevData => ({
                        ...prevData,
                        data: [],
                        showNoResult: true,
                        showCard: false,
                        noMoreData: false,
                        isFetchingData: false,
                        loading: false,
                    }));
                } else {
                    setDataObject(prevData => ({
                        ...prevData,
                        showNoResult: false,
                        showCard: true,
                        noMoreData: true,
                        isFetchingData: false,
                        loading: false,
                    }));
                }
            })
    }

    // map Image on click
    const mapImageClickHandeler = async (id, image) => {
        let mappingTerm = tableData.keywordPattern;
        openToast('loading', 'Maping Pattern');
        disableButton('map-images')

        let apiCall = `${apis.mapPattern}?id=${id}&changeId=-1&keyword=${encodeURIComponent(mappingTerm)}&mapType=2&siteName=${encodeURIComponent(siteName)}`

        await fetch(apiCall, {
            method: 'POST',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                if (data.errorMessage === "invalid_session") {
                    logoutHelper()
                    setAuthenticate("false")
                    openToast("error", 'Invalid Session');
                    closeToast(4000);
                } else if (data.payload.mapStatus) {
                    openToast('success', 'Your image has been maped');
                    closeToast(6000)

                    let newrow = {
                        "rank": 1,
                        "reviewFlag": "1",
                        "originalImageId": id,
                        "path": image,
                        "size": "425x282",
                        "adminId": 0,
                        "adminEmail": user,
                        "author": "",
                        "isBlockedKeyword": false,
                        "domain": "",
                        "mappingType": "PATTERN_IMAGE",
                        "mappingDate": "",
                        "originalImageType": ""
                    }

                    addNewRow(newrow, bodyId)

                } else {
                    openToast('error', 'Your image has failed to map');
                    closeToast(6000)
                }
            }).catch(err => {
                openToast('error', err.message);
                closeToast(6000)
            })

        enableButton('map-images')
    }

    // useEffects 
    useEffect(() => {
        let d = LocalStorage.get('domain')
        if (d) {
            setFilter(getFilter(d, domainCheckbox))
            setDomain(d)
        }
        if (tableData) {
            // let k = [createOption(tableData.keywordPattern)]
            // console.log(tableData.keywordPattern)
            setKeywords(tableData.keywordPattern);
          
            fetchInventory(0, 12, tableData.keywordPattern, true);

        }
    }, [])


    //scroll to load functionality
    useEffect(() => {
        const section = document.querySelector('.map-from-inventory');
        if (section && dataObject.showCard) {
            function handleScrollForSection() {
                const scrollTop = section.scrollTop;
                const scrollHeight = section.scrollHeight;
                const clientHeight = section.clientHeight;
                // console.log('scroling ', scrollTop, '>=', scrollHeight - clientHeight)

                if (scrollTop + 1 >= scrollHeight - clientHeight) {
                    if (!dataObject.isFetchingData) {
                        setDataObject(prevData => ({
                            ...prevData,
                            currentPage: ++dataObject.currentPage,
                        }));
                        let searchText = keywords;
                        fetchInventory(dataObject.currentPage + 1, 12, searchText, false);
                    }

                }
            }

            section.addEventListener('scroll', handleScrollForSection);
            return () => {
                section.removeEventListener('scroll', handleScrollForSection);
            };
        }
    }, [dataObject.currentPage, dataObject.data, field.mappingFrom])


    return (
        <div className='map-images'>

            <div className="form vertical-gap-layout">

                <SingleSearchKeyword
                    additionalClass=''
                    placeHolder='Search Keyword'
                    onSubmit={searchKeywordSubmitHandler}
                    defalultValue={keywords}
                />

            </div>

            <div className='map-from-inventory'>

                {
                    dataObject.showNoResult && <NoResult />
                }

                {
                    (dataObject.showCard === true) &&
                    <CardContainer
                        additionalClass=""
                        type="map-images"
                        dataArray={dataObject.data}
                        action={mapImageClickHandeler}
                        btnId='map-images'
                    />
                }

                {
                    dataObject.loading && <Loader />
                }

                {
                    dataObject.noMoreData && <Title additionalClass='no-more-error'>No More data</Title>
                }

            </div>











        </div>
    )
}

export default MapPattern