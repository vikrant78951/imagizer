import React, { useEffect, useState } from 'react'
import './MapImage.css'
import { createOption, disableButton, enableButton, getFilter, LocalStorage } from '../../helper/helper'
import { mappingType_option, mappingFrom_option } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider'
import { getKeyword, getCurrentDateTime, logoutHelper } from '../../helper/helper'
import { Loader } from '../loader/Loader'
import { NoResult } from '../noresult/NoResult'
import CardContainer from '../cards/CardContainer'
import { apis } from '../../data/data'
import { Title } from '../typhography/Typography'

// form elements 
import { Input, ReactSelect, SearchKeyword, Checkbox, SingleSearchKeyword } from '../forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../forms/Validation'
import { PrimaryButton } from '../button/Button'
import ShutterStockTable from '../table/ShutterStockTable'
import { keywordsData } from '../../data/data'

const MapImage = ({ tableData, addNewRow }) => {
    const initialData = {
        loading: false,
        data: [],
        sutterStockData: [],
        showCard: false,
        showTable: false,
        showNoCardResult: false,
        showNoTableResult: false,
        isFetchingData: false,
        currentPage: 0,
        noMoreData: false,
    }
    const [dataObject, setDataObject] = useState(initialData);
    const [keywords, setKeywords] = useState('')
    const [field, setFields] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const [domain, setDomain] = useState('')
    const [domainCheckbox, setDomainCheckbox] = useState(false)
    const [localImageId, setLocalImageId] = useState(false)
    const [filter, setFilter] = useState(1)
    const { openToast, closeToast, user, setAuthenticate, team } = useStateContext();


    // input handler 
    const mappingTypeHandler = (option) => { // handle mapping Type
        updateData('mappingType', option, setFields)
    }

    const mappingFromHandler = (option) => { // handle mapping from
        updateData('mappingFrom', option, setFields)
    }

    const inputHandler = (e) => {
        let field = e.target.name;
        let value = e.target.value;
        switch (field) {
            case 'ssid': updateData('ssid', value, setFields)
                break;
        }
        validationField(field, value, setError, setErrorMessage);
    };

    // chekbox handler 
    const domainCheckboxHandler = ({ target }) => {
        setDomainCheckbox(target.checked)
        setFilter(getFilter(team, target.checked))

    }

    const localImageIdHandler = ({ target }) => {
        setLocalImageId(target.checked)
    }


    // keyword  submit handler
    const searchKeywordSubmitHandler = (value) => {
        setKeywords(value)
        setDataObject(prevData => ({ //resting data
            ...prevData,
            data: [],
            currentPage: 0,
        }));

        // console.log('value =', value)
        fetchInventory(0, 12, value, true)
    }

    //fetch inventory
    const fetchInventory = async (cp, length, searchText, reset) => {

        if (reset) {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: false,
                showNoCardResult: false,
                noMoreData: false,
                isFetchingData: true,
                currentPage: 0,
            }));
        } else {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: true,
                showNoCardResult: false,
                noMoreData: false,
                isFetchingData: true,
            }));
        }



        setDataObject(prevData => ({
            ...prevData,
            loading: false,
            data: keywordsData,
            showCard: true,
            showNoCardResult: false,
            noMoreData: false,
            isFetchingData: false,
        }));


        // await fetch(apiCallUrl, {
        //     method: 'GET',
        //     credentials: 'include',
        // }).then(response => response.json())
        //     .then((data) => {
        //         if (data.message === 'success' && data.response.length > 0) {
        //             let temp = []
        //             if (!reset) {
        //                 temp = [
        //                     ...dataObject.data,
        //                     ...data.response
        //                 ]
        //             } else {
        //                 temp = data.response
        //             }

        //             setDataObject(prevData => ({
        //                 ...prevData,
        //                 loading: false,
        //                 data: temp,
        //                 showCard: true,
        //                 showNoCardResult: false,
        //                 noMoreData: false,
        //                 isFetchingData: false,
        //             }));

        //         } else if (data.errorMessage === "invalid_session") {
        //             logoutHelper()
        //             setAuthenticate("false")
        //         } else {

        //             if (reset) {
        //                 setDataObject(prevData => ({
        //                     ...prevData,
        //                     data: [],
        //                     showNoCardResult: true,
        //                     showCard: false,
        //                     noMoreData: false,
        //                     isFetchingData: false,
        //                     loading: false,
        //                 }));
        //             } else {
        //                 setDataObject(prevData => ({
        //                     ...prevData,
        //                     showNoCardResult: false,
        //                     showCard: true,
        //                     noMoreData: true,
        //                     isFetchingData: false,
        //                     loading: false,
        //                 }));
        //             }
        //         }
        //     }).catch(error => {

        //         if (reset) {
        //             setDataObject(prevData => ({
        //                 ...prevData,
        //                 data: [],
        //                 showNoCardResult: true,
        //                 showCard: false,
        //                 noMoreData: false,
        //                 isFetchingData: false,
        //                 loading: false,
        //             }));
        //         } else {
        //             setDataObject(prevData => ({
        //                 ...prevData,
        //                 showNoCardResult: true,
        //                 showCard: true,
        //                 noMoreData: true,
        //                 isFetchingData: false,
        //                 loading: false,
        //             }));
        //         }
        //     })
    }

    // fetch sutterstock 
    const fetchShutterStockRecommendations = async (mappingTerm) => {
        setDataObject(prevData => ({ //update state
            ...prevData,
            loading: true,
            showTable: false,
            showNoTableResult: false,
            isFetchingData: true,
        }));
        let apiCallUrl = `${apis.sutterStockImageRecommendation}?keyword=${encodeURIComponent(mappingTerm)}`;
        await fetch(apiCallUrl, {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json())
            .then((data) => {
                if (data) {
                    if (data.statusCode === 200) {
                        if (data.payload.length > 0) {
                            setDataObject(prevData => ({ //update state
                                ...prevData,
                                loading: false,
                                showTable: true,
                                showNoTableResult: false,
                                isFetchingData: false,
                                sutterStockData: data.payload
                            }));
                        } else if (data.errorMessage === "invalid_session") {
                            logoutHelper()
                            setAuthenticate("false")
                        }
                    } else if (data.statusCode === 500) {
                        setDataObject(prevData => ({ //update state
                            ...prevData,
                            loading: false,
                            showTable: false,
                            showNoTableResult: true,
                            isFetchingData: false,
                            sutterStockData: []
                        }));
                    }
                }
            }).catch(error => {
                setDataObject(prevData => ({ //update state
                    ...prevData,
                    loading: false,
                    showTable: false,
                    showNoTableResult: true,
                    isFetchingData: false,
                    sutterStockData: []
                }));
            })
    }


    const newMapping = () => {
        return new Promise((res) => [
            setTimeout(() => {
                res()
            }, 2000)
        ])
    }
    // map Image on click
    const mapImageClickHandeler = async (id, image) => {
        let mappingTerm = tableData[0].keyword;
        openToast('loading', 'Maping Image');
        disableButton('map-images')


        // if (props.bulkReviewOrigin) {
        //     apiCall = apiCall + '&bulkReviewOrigin=true' + '&isBulkReview=1&size=' + props.imageSize.value + '&type=-1'
        // }
        // console.log('mapping term',mappingTerm)
        // let apiCall = `${apis.mapImageWithInventory}?id=${id}&changeId=-1&keyword=${encodeURIComponent(mappingTerm)}&mapType=${field.mappingType.value}&siteName=All&delPreviousMapping=0`
        // await fetch(apiCall, {
        //     method: 'POST',
        //     credentials: 'include',
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.errorMessage === "invalid_session") {
        //             logoutHelper()
        //             setAuthenticate("false")
        //             openToast('error', 'Invalid Session');
        //             closeToast(4000)
        //         } else if (data.statusCode && data.payload.mapStatus) {
        //             openToast('success', 'Your image has been maped');
        //             closeToast(6000)

        //             let row = {
        //                 rank: 1,
        //                 reviewFlag: "0",
        //                 originalImageId: id,
        //                 path: image,
        //                 size: "250x150",
        //                 adminId: 0,
        //                 keyword: mappingTerm,
        //                 type: "manualImage",
        //                 adminEmail: user,
        //                 author: "",
        //                 isBlockedKeyword: false,
        //                 domain: "",
        //                 mappingType: "MANUAL",
        //                 mappingDate: getCurrentDateTime(),
        //                 originalImageType: "MANUAL",
        //                 reviewedGood: true,
        //                 isTaxonomy: false,
        //                 suggestedBy: user,
        //                 displaySiteName: "All",
        //                 imageTypeDisplay: "SUGGESTED",
        //                 newdata: true,
        //             }
        //             addNewRow(row)

        //         } else {
        //             openToast('error', 'Your image has failed to map');
        //             closeToast(6000)
        //         }
        //     }).catch(err => {
        //         openToast('error', err.message);
        //         closeToast(6000)
        //     })

        await newMapping()

        openToast('success', 'Your image has been maped');
        closeToast(6000)

        let row = {
            rank: 1,
            reviewFlag: "0",
            originalImageId: id,
            path: image,
            size: "250x150",
            adminId: 0,
            keyword: mappingTerm,
            type: "manualImage",
            adminEmail: user,
            author: "",
            isBlockedKeyword: false,
            domain: "",
            mappingType: "MANUAL",
            mappingDate: getCurrentDateTime(),
            originalImageType: "MANUAL",
            reviewedGood: true,
            isTaxonomy: false,
            suggestedBy: user,
            displaySiteName: "All",
            imageTypeDisplay: "SUGGESTED",
            newdata: true,
        }
        addNewRow(row)

        enableButton('map-images')
    }


    // map sutterStock  id
    const mapShutterImage = async () => {
        // validate all
        validationField('ssid', field.ssid, setError, setErrorMessage);

        if (error.ssid === true || field.ssid.length === 0) {
            // validation failed
        } else {
            // validation success
            openToast("loading", "Validating ID");

            let apiCallUrl = `${apis.validateShutterStockId}?ssid=${field.ssid}`;

            // api call for validating map id 
            await fetch(apiCallUrl, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.json())
                .then(async (data) => {
                    if (data.errorMessage === "invalid_session") {
                        logoutHelper()
                        setAuthenticate("false")
                        openToast("error", 'Invalid Session');
                        closeToast(4000);
                    } else if (data.response) {



                        let mapFromSSApi = `${apis.mapImageFromShutterStock}?keyword=${encodeURIComponent(tableData[0].keyword)}&url=${field.ssid}`
                        openToast("loading", 'Sending Id for Mapping');
                        // api call for mapping id 
                        await fetch(mapFromSSApi, {
                            method: 'POST',
                            credentials: 'include',
                        }).then(response => response.json())
                            .then(data => {
                                if (data.status === 'success') {
                                    openToast("success", 'Your image will be Map soon');
                                    closeToast(4000);
                                } else {
                                    openToast("error", 'We are facing trouble with your request');
                                    closeToast(4000);
                                }

                            }).catch(error => {
                                openToast("error", error.message);
                                closeToast(4000);
                            })


                    } else {
                        openToast("error", data.message);
                        closeToast(4000);
                    }
                })
                .catch((err) => {
                    openToast("error", err.message);
                    closeToast(4000);
                });
        }
    };


    // useEffects 
    // form default selected options and domain
    useEffect(() => {
        updateData('mappingType', mappingType_option[0], setFields)
        updateData('mappingFrom', mappingFrom_option[0], setFields)
        let d = LocalStorage.get('domain')
        if (d) {
            setFilter(getFilter(d, domainCheckbox))
            setDomain(team)
        }

        if (tableData) {
            // let k = [createOption(tableData[0].keyword)]
            // console.log('default keyword', k.value)
            setKeywords(tableData[0].keyword);
            setDataObject(prevData => ({ //resting data
                ...prevData,
                data: [],
                showCard: true,
                currentPage: 0
            }));
            fetchInventory(0, 12, tableData[0].keyword, true)
        }

    }, [])

    useEffect(() => {
        let d = LocalStorage.get('domain')
        if (d) {
            setFilter(getFilter(d, domainCheckbox))
            setDomain(team)
        }

    }, [team])

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
                        // let searchText = getKeyword(keywords);
                        // console.log('fetch the data..', dataObject.currentPage)
                        fetchInventory(dataObject.currentPage + 1, 12, keywords, false);
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
                    additionalClass='some'
                    placeHolder='Search Keyword'
                    onSubmit={searchKeywordSubmitHandler}
                    defalultValue={keywords}
                />

                <div className="form-row">

                    <ReactSelect
                        additioalClass='not-creatable'
                        id="mappingType"
                        // label="Mapping Type"
                        label='Mapping Type'
                        required={false}
                        option={mappingType_option}
                        inputHandler={mappingTypeHandler}
                        errorId="mappingType-error"
                        error={error.mappingType}
                        value={field.mappingType}
                        errorMessage={errorMessage.mappingType}
                    />




                    <ReactSelect
                        additioalClass='not-creatable'
                        id="mappingFrom"
                        // label="Mapping From"
                        label='Image Sources'
                        required={false}
                        option={mappingFrom_option}
                        inputHandler={mappingFromHandler}
                        errorId="mappingFrom-error"
                        error={error.mappingFrom}
                        value={field.mappingFrom}
                        errorMessage={errorMessage.mappingFrom}
                    />

                    <Checkbox
                        additionalClass=''
                        type='checkbox'
                        id="local_image_id"
                        name="localImageId"
                        label="Local Image ID Search"
                        inputHandler={localImageIdHandler}
                        autoFocus={false}
                        checked={localImageId}
                        topSpace={true}
                    />

                    {
                        (domain === 'Titanium' || domain === 'Forbes' || domain === 'GINSU') ?
                            <Checkbox
                                additionalClass=''
                                type='checkbox'
                                id="domain_images"
                                name="uploadedImages"
                                label={`${domain} Only`}
                                inputHandler={domainCheckboxHandler}
                                autoFocus={false}
                                checked={domainCheckbox}
                                topSpace={true}
                            />
                            : ''
                    }


                </div>

            </div>

            {
                field.mappingFrom.value === 'Inventory' && <div className='map-from-inventory'>

                    {
                        dataObject.showNoCardResult && <NoResult />
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

            }




            {
                (field.mappingFrom.value === 'Shutterstock') &&
                <div className='map-from-sutterstock'>


                    {
                        (dataObject.showTable === true) &&
                        <div className='map-from-sutterstock-content'>
                            <div className="form">
                                <div className="form-row">
                                    <Input
                                        additionalClass=""
                                        id="ssid_at"
                                        name="ssid"
                                        label="Shutterstock id"
                                        placeholder="Enter Shutterstock Id"
                                        required={true}
                                        value={field.ssid}
                                        inputHandler={inputHandler}
                                        errorId="ssid_at-error"
                                        error={error.ssid}
                                        errorMessage={errorMessage.ssid}
                                        autoFocus={false}
                                        tooltip={true}
                                        tooltipText="To include multiple IDs, simply separate them using a comma ','"
                                        disable={false}
                                    />
                                    <PrimaryButton
                                        action={mapShutterImage}
                                        size='l'
                                        label='Map Image'
                                    />
                                </div>
                            </div>
                            <ShutterStockTable data={dataObject.sutterStockData} />
                        </div>
                    }

                    {
                        dataObject.showNoTableResult && <NoResult />
                    }


                    {
                        dataObject.loading && <Loader />
                    }




                </div>
            }







        </div>
    )
}

export default MapImage