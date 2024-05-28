import React, { useEffect, useState } from 'react'
import '../assets/styles/downloadImage.css'
import Header from '../component/header/Header'
import Toast from '../component/toast/Toast'
import { PageHeaderWithChildren } from '../component/pageheader/PageHeader'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper'
import { ReactSelect, Checkbox, Input } from '../component/forms/FormElements'
import { useStateContext } from '../contexts/ContextProvider'
import { inputsField, errorMessagefield, errorField, validationField, updateData } from '../component/forms/Validation'
import { ImageSize, mappingFrom_option } from '../data/data'
import { getFilter, LocalStorage, getKeyword, logoutHelper } from '../helper/helper'
import { PrimaryButton } from '../component/button/Button'
import { Loader } from '../component/loader/Loader'
import { Title } from '../component/typhography/Typography'
import { NoResult } from '../component/noresult/NoResult'
import { apis } from '../data/data'
import CardContainer from '../component/cards/CardContainer'
import DownloadInstruction from '../component/instructions/DownloadInstruction'
import { Link } from 'react-router-dom'
import { rightArrow } from '../assets/icon/Icon'
import { downloadImge } from '../data/data'

const DownloadImages = () => {

    // initial state 
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
        showInstruction: true,
    }
    const [dataObject, setDataObject] = useState(initialData);
    const [field, setFields] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const [domain, setDomain] = useState('')
    const [domainCheckbox, setDomainCheckbox] = useState(false)
    const [filter, setFilter] = useState(2)
    const [localImageId, setLocalImageId] = useState(false)
    const { openToast, closeToast, team, setAuthenticate, URL } = useStateContext();
    const noOfCard = window.innerHeight > 1200 ? window.innerHeight > 1900 ? 28 : 20 : 12
    const [tab, setTab] = useState('inventory')
    const [status, setStatus] = useState(false)

    const checkboxHandler = ({ target }) => {
        setDomainCheckbox(target.checked)
        setFilter(getFilter(team, target.checked))
    }

    const localImageIdHandler = ({ target }) => {
        setLocalImageId(target.checked)
    }

    //input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value
        switch (field) {
            case 'keyword': updateData('keyword', value, setFields)
                break;
            case 'ssid': updateData('ssid', value, setFields)
                break;
        }
        validationField(field, value, setError, setErrorMessage)
    }



    // react select 
    const sizeHandeler = (option) => {
        updateData('size', option, setFields)
        validationField('size', field.size, setError, setErrorMessage)
    }


    const fetchData = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: downloadImge
                })
            }, 2000);
        })
    }


    // fetch images 
    const fetchInventory = async (cp, dataLength, value, reset) => {

        if (reset) {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: false,
                showNoResult: false,
                isFetchingData: true,
                showInstruction: false,
                currentPage: 0,
            }));
        } else {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: true,
                showNoResult: false,
                isFetchingData: true,

            }));
        }

        // let loKeyword = getKeyword(keyword);
        // let apiCallUrl = `${URL}/getKeyword`;
        // await fetch(apiCallUrl, {
        //     method: 'GET',
        // }).then(response => response.json())
        //     .then((data) => {
        //         // console.log(response.data.response) 
        //         if (data.errorMessage === "invalid_session") {
        //             logoutHelper()
        //             setAuthenticate("false")
        //             openToast("error", 'Invalid Session');
        //             closeToast(4000);
        //         } else if (data.message === 'success' && data.response.length > 0) {

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
        //                 showNoResult: false,
        //                 noMoreData: false,
        //                 isFetchingData: false,
        //             }));

        //         } else {
        //             // console.log('we are in else')

        //             if (reset) {
        //                 setDataObject(prevData => ({
        //                     ...prevData,
        //                     data: [],
        //                     showNoResult: true,
        //                     showCard: false,
        //                     noMoreData: false,
        //                     isFetchingData: false,
        //                     loading: false,
        //                 }));
        //             } else {
        //                 setDataObject(prevData => ({
        //                     ...prevData,
        //                     showNoResult: false,
        //                     showCard: true,
        //                     noMoreData: true,
        //                     isFetchingData: false,
        //                     loading: false,
        //                 }));
        //             }
        //         }
        //     }).catch(error => {
        //         console.log(error)

        //         if (reset) {
        //             setDataObject(prevData => ({
        //                 ...prevData,
        //                 data: [],
        //                 showNoResult: true,
        //                 showCard: false,
        //                 noMoreData: false,
        //                 isFetchingData: false,
        //                 loading: false,
        //             }));
        //         } else {
        //             setDataObject(prevData => ({
        //                 ...prevData,
        //                 showNoResult: false,
        //                 showCard: true,
        //                 noMoreData: true,
        //                 isFetchingData: false,
        //                 loading: false,
        //             }));
        //         }
        //     })

        const response = await fetchData()

        let temp = []
        if (!reset) {
            temp = [
                ...dataObject.data,
                ...response.data
            ]
        } else {
            temp = response.data
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

    }


    // search image 
    const submitHandler = () => {

        validationField('keyword', field.keyword, setError, setErrorMessage)

        if (error.keyword === true || field.keyword.length === 0) {
            console.log('validation failed');
        } else {
            fetchInventory(0, noOfCard, field.keyword, true);
        }

    }


    // map sutterStock  id
    const mapShutterImage = async () => {
        // validate all
        validationField('ssid', field.ssid, setError, setErrorMessage);
        setStatus(false)
        if (error.ssid === true || field.ssid.length === 0) {
            // validation failed
        } else {
            // validation success
            openToast("loading", "Validating ID");

            // let apiCallUrl = `${apis.validateShutterStockId}?ssid=${field.ssid}`;

            // // api call for validating map id 
            // await fetch(apiCallUrl, {
            //     method: 'GET',
            //     credentials: 'include',
            // }).then(response => response.json())
            //     .then(async (data) => {
            //         if (data.errorMessage === "invalid_session") {
            //             logoutHelper()
            //             setAuthenticate("false")
            //             openToast("error", 'Invalid Session');
            //             closeToast(4000);
            //         } else if (data.response) {



            //             let mapFromSSApi = `${apis.mapImageFromShutterStock}?url=${field.ssid}`
            //             openToast("loading", 'Sending Id for Mapping');
            //             // api call for mapping id 
            //             await fetch(mapFromSSApi, {
            //                 method: 'POST',
            //                 credentials: 'include',
            //             }).then(response => response.json())
            //                 .then(data => {
            //                     if (data.status === 'success') {
            //                         openToast("success", 'Your image will be Map soon');
            //                         closeToast(4000);
            //                         setStatus(true)
            //                     } else {
            //                         openToast("error", 'We are facing trouble with your request');
            //                         closeToast(4000);
            //                         setStatus(false)
            //                     }

            //                 }).catch(error => {
            //                     openToast("error", error.message);
            //                     closeToast(4000);
            //                     setStatus(false)
            //                 })


            //         } else {
            //             openToast("error", data.message);
            //             closeToast(4000);
            //             setStatus(false)
            //         }
            //     })
            //     .catch((err) => {
            //         openToast("error", err.message);
            //         closeToast(4000);
            //         setStatus(false)
            //     });

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 2000);
            })
            openToast("loading", 'Sending Id for Mapping');
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 2000);
            })
            openToast("success", 'Your image will be Map soon');
            closeToast(4000);
            setStatus(true)

        }
    };



    //scroll to load functionality
    useEffect(() => {
        const section = document.querySelector('.download-image-content-container');
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
                        // console.log('fetch the data..', dataObject.currentPage)
                        fetchInventory(dataObject.currentPage, noOfCard, field.keyword, false);
                    }

                }
            }

            section.addEventListener('scroll', handleScrollForSection);
            return () => {
                section.removeEventListener('scroll', handleScrollForSection);
            };
        }
    }, [dataObject.currentPage, dataObject.data, field.mappingFrom])


    // useEffects 
    useEffect(() => {
        setDomain(team)
        setFilter(getFilter(team, domainCheckbox))
    }, [team])

    useEffect(() => {
        setDomain(team)
        setFilter(getFilter(team, domainCheckbox))
        updateData('mappingFrom', mappingFrom_option[0], setFields)
        updateData('size', field.size === '' ? ImageSize[0] : field.size, setFields);
    }, [])

    return (
        <>
            {/* header  */}
            <Header />
            <main className='download-image'>

                {/* page heaer  */}
                <PageHeaderWithChildren title="Download Image" >
                    <ul className="tab-container">
                        <li onClick={() => setTab('inventory')} className={`tab-link  ${tab === 'inventory' ? 'active' : ''}`}>Download from Inventory</li>
                        <li onClick={() => setTab('shutterstock')} className={`tab-link  ${tab === 'shutterstock' ? 'active' : ''}`}>Download from ShutterStock</li>
                    </ul>

                    {/* form  1 */}
                    <div className={`tab-content ${tab === 'inventory' ? 'active' : ''}`}>
                        <form className="form horizontal-gap-layout">


                            <div className="form-row">




                                <Input
                                    additionalClass="sm search-input-box"
                                    id="keyword_id"
                                    name="keyword"
                                    label={false}
                                    placeholder="Search Image"
                                    required={true}
                                    value={field.keyword}
                                    inputHandler={inputHandler}
                                    errorId="keyword_id-error"
                                    error={error.keyword}
                                    errorMessage={errorMessage.keyword}
                                    autoFocus={true}
                                    keyPressHandler={submitHandler}
                                />


                                <ReactSelect
                                    type='select'
                                    additionalClass='sm'
                                    id="size_at"
                                    name="size"
                                    label={false}
                                    required={true}
                                    option={ImageSize}
                                    inputHandler={sizeHandeler}
                                    errorId="size_at-error"
                                    error={error.size}
                                    value={field.size}
                                    errorMessage={errorMessage.size}
                                />
                                <PrimaryButton label='Search' size='m' action={submitHandler} />

                            </div>

                            <div className='form-row flex-start'>
                                <Checkbox
                                    additionalClass=''
                                    type='checkbox'
                                    id="local_image_id"
                                    name="localImageId"
                                    label="Local Image ID Search"
                                    inputHandler={localImageIdHandler}
                                    autoFocus={false}
                                    checked={localImageId}
                                    topSpace={false}
                                />

                                {
                                    (domain === 'Titanium' || domain === 'Forbes' || domain === 'GINSU') ?
                                        <Checkbox
                                            additionalClass=''
                                            type='checkbox'
                                            id="uploadedImages_at"
                                            name="uploadedImages"
                                            label={`${domain} Only`}
                                            inputHandler={checkboxHandler}
                                            autoFocus={false}
                                            checked={domainCheckbox}
                                        />
                                        : ''
                                }
                            </div>





                        </form>
                    </div>


                    {/* form  2 */}
                    <div className={`tab-content ${tab === 'shutterstock' ? 'active' : ''}`}>
                        <form className="form horizontal-gap-layout">
                            <div className="form-row ">
                                <Input
                                    additionalClass="mx-full sm download-from-shutterstock"
                                    id="ssid_at"
                                    name="ssid"
                                    label={false}
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
                                    size='m'
                                    label='Download'
                                />
                            </div>
                            {
                                status && <div className="form-row">
                                    <Link to='/eta' className='link link-with-arrow' >Check Status {rightArrow}</Link>
                                </div>
                            }

                        </form>
                    </div>



                </PageHeaderWithChildren>


                {/* page content  */}
                <SectionContainer additioalClass='page-content'>
                    <ContentWrapper additioalClass='big-wrapper'>



                        {
                            dataObject.showNoResult && <NoResult />
                        }


                        {
                            (dataObject.showCard === true) &&
                            <WhiteBoard additioalClass='content'>
                                <div className="download-image-content-container">
                                    <CardContainer
                                        additionalClass="big-card download-images"
                                        type="download-image"
                                        dataArray={dataObject.data}
                                        formData={
                                            {
                                                customerId: field.customerId,
                                                siteName: field.siteName,
                                                purpose: field.purpose,
                                                size: field.size,
                                            }
                                        }
                                    />
                                    {
                                        dataObject.loading && <Loader />
                                    }
                                    {
                                        dataObject.noMoreData && <Title additionalClass='no-more-error'>No More data</Title>
                                    }
                                </div>
                            </WhiteBoard>
                        }


                        {
                            !dataObject.showCard && dataObject.loading && <Loader />
                        }

                        {/*  instructions  */}
                        {
                            dataObject.showInstruction && <DownloadInstruction />
                        }


                    </ContentWrapper>
                </SectionContainer>


            </main>

            {/* toast notification */}
            <Toast />
        </>
    )
}

export default DownloadImages