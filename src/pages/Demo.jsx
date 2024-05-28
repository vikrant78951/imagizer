import React, { useEffect, useState } from 'react'
import '../assets/styles/downloadImage.css'
import Header from '../component/header/Header'
import Toast from '../component/toast/Toast'
import { PageHeaderWithChildren } from '../component/pageheader/PageHeader'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper'
import { ReactSelect, Checkbox, SingleTextInput } from '../component/forms/FormElements'
import { useStateContext } from '../contexts/ContextProvider'
import { inputsField, errorMessagefield, errorField, validationField, updateData } from '../component/forms/Validation'
import { ImageSize, downloadImge, mappingFrom_option } from '../data/data'
import { getFilter, LocalStorage, getKeyword, logoutHelper } from '../helper/helper'
import { PrimaryButton } from '../component/button/Button'
import { Loader } from '../component/loader/Loader'
import { Title } from '../component/typhography/Typography'
import { NoResult } from '../component/noresult/NoResult'
import { apis } from '../data/data'
import CardContainer from '../component/cards/CardContainer'
import DownloadInstruction from '../component/instructions/DownloadInstruction'

const Demo = () => {


    // initial state 
    const initialData = {
        loading: false,
        data: [],
        sutterStockData: [],
        showCard: false,
        showNoResult: false,
        isFetchingData: false,
        currentPage: 1,
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
    const [filter, setFilter] = useState(1)
    const { openToast, closeToast, team, setAuthenticate } = useStateContext();
    const [showError, setShowError] = useState(false)
    const [keywords, setKeywords] = useState('')
    const noOfCard = window.innerHeight > 1200 ? window.innerHeight > 1900 ? 28 : 20 : 12



    const checkboxHandler = ({ target }) => {
        setDomainCheckbox(target.checked)
        setFilter(getFilter(team, target.checked))
    }

    useEffect(() => {
        setDomain(team)
    }, [team])

    useEffect(() => {
        updateData('mappingFrom', mappingFrom_option[0], setFields)
    }, [])

    // useEffect(() => {
    //     if (keywords && keywords.length > 0) {
    //         fetchInventory(1, noOfCard, true);
    //     }
    // }, [keywords])



    // keyword change handler 
    // const valueChangehandler = async (value) => {
    //     setKeyword(value)
    //     setKeywordError(false)
    // }

    // react select 
    const sizeHandeler = (option) => {
        updateData('size', option, setFields)
        validationField('size', field.size, setError, setErrorMessage)
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
        // let apiCallUrl = `${apis.inventoryImage}?start=${cp}&len=${dataLength}&searchText=${value}&size=${field.size.value}&filter=${filter}`;
        // await fetch(apiCallUrl, {
        //     method: 'GET',
        //     credentials: 'include',
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


        setDataObject(prevData => ({
            ...prevData,
            loading: false,
            data: downloadImge,
            showCard: true,
            showNoResult: false,
            noMoreData: false,
            isFetchingData: false,
        }));




    }



    // search image 
    const searchKeywordSubmitHandler = (value) => { // keyword  submit handler
        setKeywords(value)
        // console.log('value =', value)
        fetchInventory(0, noOfCard, value, true);
    }


    const submitHandler = () => {
        console.log('keywords', keywords)
        if (keywords && keywords.length > 0) {
            fetchInventory(0, noOfCard, keywords, true);
        } else {
            setShowError(true)
        }
    }


    useEffect(() => {
        let d = LocalStorage.get('domain')
        if (d) {
            setFilter(getFilter(d, domainCheckbox))
            setDomain(d)
        }
        updateData('size', field.size === '' ? ImageSize[0] : field.size, setFields);
        setDomain(team)
    }, [])



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
                        fetchInventory(dataObject.currentPage, noOfCard, keywords, false);
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
        <>
            {/* header  */}
            <Header />
            <main className='download-image'>

                {/* page heaer  */}
                <PageHeaderWithChildren title="Download Image" >
                    {/* form   */}
                    <form className="form horizontal-gap-layout">


                        <div className="form-row">


                            <SingleTextInput
                                additionalClass='sm search-input-box'
                                placeHolder='Search Keyword'
                                onSubmit={searchKeywordSubmitHandler}
                                callback={setKeywords}
                                showError={showError}
                            />


                            {/* </div> */}

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

                            {
                                (domain === 'Titanium' || domain === 'Forbes' || domain === 'GINSU') ?
                                    <Checkbox
                                        additionalClass=''
                                        type='checkbox'
                                        id="uploadedImages_at"
                                        name="uploadedImages"
                                        label={`Uploaded Image`}
                                        inputHandler={checkboxHandler}
                                        autoFocus={false}
                                        checked={domainCheckbox}
                                    />
                                    : ''
                            }
                            <PrimaryButton label='Search' size='m' action={submitHandler} />

                        </div>

                    </form>

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
                                        type="edit-image"
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

export default Demo