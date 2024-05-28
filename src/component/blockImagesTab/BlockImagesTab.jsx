import React, { useEffect, useState } from 'react'
import './BlockImagesTab.css'
import { Input } from '../forms/FormElements';
import { apis } from '../../data/data';
import { NoResult } from '../noresult/NoResult';
import { Loader } from '../loader/Loader';
import { Title } from '../typhography/Typography';
import { useStateContext } from '../../contexts/ContextProvider'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../forms/Validation';
import { PrimaryButton } from '../button/Button';
import CardContainer from '../cards/CardContainer';
import { blockedImageResult } from '../../data/data';

const BlockImagesTab = ({ additionalClass }) => {


    const initialData = {
        loading: false,
        data: [],
        showCard: false,
        showNoResult: false,
        isFetchingData: false,
        currentPage: 1,
        noMoreData: false,
        showTable: false,
    }

    // state 
    const [dataObject, setDataObject] = useState(initialData);
    const { openToast, closeToast } = useStateContext();
    const [field, setInputs] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const [slicedData, setSlicedData] = useState([])
    const noOfCard = window.innerHeight > 1200 ? window.innerHeight > 1600 ? 32 : 20 : 16


    // input handler
    const inputHandler = (e) => {
        let field = e.target.name;
        let value = e.target.value;
        switch (field) {
            case 'url':
                updateData('url', value, setInputs);
                break;
        }
        validationField(field, value, setError, setErrorMessage);
    };

    // fetch block keywords 
    const FetchBlockImages = async (reset) => {
        if (reset) {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: false,
                showNoResult: false,
                isFetchingData: true,
                currentPage: 1,
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
        let blockTableApi = `${apis.blockImages}`;
        // await fetch(blockTableApi, {
        //     method: 'GET',
        //     credentials: 'include',
        // })
        //     .then(response => response.json())
        //     .then((data) => {
        //         // Request was successful
        //         if (data.status === 'success' && data.data.length > 0) {

        //             let temp = []
        //             if (reset) {
        //                 temp = data.data
        //             } else {
        //                 temp = [
        //                     ...dataObject.data,
        //                     ...data.data
        //                 ]
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
        //     })
        //     .catch((error) => {
        //         console.log(error);
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
        //     });

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 2000);
        })

        setDataObject(prevData => ({
            ...prevData,
            loading: false,
            data: blockedImageResult,
            showCard: true,
            showNoResult: false,
            noMoreData: false,
            isFetchingData: false,
        }));



    };

    // Block image 
    const blockImageHelper = async (imageUrl, action) => {
        openToast('loading', action === 'block' ? "Blocking Image" : "Unblocking Image")
        let blockThisImage
        const urlPattern = /\.(jpeg|jpg|gif|png|svg)$/i;
        const isURL = urlPattern.test(imageUrl);
        if (isURL) {
            console.log('is url')
            blockThisImage = `${apis.blockImages}?url=${imageUrl}&block=${action === 'block' ? 1 : 0}`
        }
        else {
            console.log('is number')
            blockThisImage = `${apis.blockImages}?original_image_id=${imageUrl}&block=${action === 'block' ? 1 : 0}`
        }


        // await fetch(blockThisImage, {
        //     method: 'POST',
        //     credentials: 'include',
        // })
        //     .then(response => response.json())
        //     .then((data) => {
        //         // console.log(response)
        //         if (data.status === 'success') {
        //             openToast('success', action === 'block' ? "Image Blocked" : "Image Unblocked")
        //             closeToast(3000)
        //             updateData('url', '', setInputs)
        //             FetchBlockImages(1, true)
        //         } else {
        //             openToast('error', data.message)
        //             closeToast(3000)
        //         }
        //     }).catch(error => {
        //         openToast('error', error.message)
        //         closeToast(3000)
        //     })

        openToast('success', action === 'block' ? "Image Blocked" : "Image Unblocked")
        closeToast(3000)
        updateData('url', '', setInputs)
        FetchBlockImages(1, true)


        openToast('success', action === 'block' ? "Image Blocked" : "Image Unblocked")
        closeToast(3000)
        updateData('url', '', setInputs)
        FetchBlockImages(1, true)


    }

    // block image click handler 
    const blockImageHandeler = () => {
        validationField('url', field.url, setError, setErrorMessage);
        if (error.url === true || field.url.length === 0) {
            console.log('validation failed');
        } else {
            blockImageHelper(field.url, 'block');
        }
    };


    // block button in image click handler 
    const blockImageButtonHandeler = (imagesrc, imageid) => {
        console.log(imagesrc, imageid)
        blockImageHelper(imageid, 'unblock');
    };


    // pagination 
    const addData = () => {
        setSlicedData(prev => [
            ...prev,
            ...dataObject.data.slice(prev.length, prev.length + noOfCard)
        ])
    }

    const addScrollToDataload = () => {
        const section = document.querySelector('.image-data-container');
        if (section && dataObject.data && dataObject.data.length > 0) {

            function handleScrollForSection() {
                const scrollTop = section.scrollTop;
                const scrollHeight = section.scrollHeight;
                const clientHeight = section.clientHeight;
                // console.log('scroling ', scrollTop, '>=', scrollHeight - clientHeight)

                if (scrollTop + 1 >= scrollHeight - clientHeight) {
                    addData()
                }
            }

            section.addEventListener('scroll', handleScrollForSection);

        }
    }

    // use effects 
    useEffect(() => {
        FetchBlockImages(1, true).then(() => {
        })
        addData()
    }, [])


    useEffect(() => {
        addData()
        addScrollToDataload()
    }, [dataObject.data])



    return (

        <div className={`block-image-page ${additionalClass ? additionalClass : ''} `}>

            <form className="form horizontal-layout" onSubmit={(e)=> e.preventDefault()}>
                <div className='form-row'>

                    <div className='singular-input-container'>
                        <div className='singular-input'>


                            <Input
                                additionalClass=""
                                id="url_id"
                                name="url"
                                errorId="url_id"
                                error={error.url}
                                errorMessage={errorMessage.url}
                                type="text"
                                label={false}
                                placeholder="Image Id or URL"
                                required={true}
                                value={field.url}
                                inputHandler={inputHandler}
                                disable={false}
                            />

                            <PrimaryButton
                                size='s'
                                action={blockImageHandeler}
                                label="Block Image"
                            />
                        </div>


                    </div>


                </div>
            </form>


            <div className="block-image-container">
                {
                    (dataObject.showCard === true) &&
                    <CardContainer
                        additionalClass="big-card block-images image-data-container"
                        type="block-image"
                        dataArray={slicedData}
                        action={blockImageButtonHandeler}
                    />
                }

                {
                    dataObject.showNoResult && <NoResult />
                }


                {
                    dataObject.loading && <Loader />
                }

                {
                    dataObject.noMoreData && <Title>No Data Found</Title>
                }
            </div>









        </div>

    )
}

export default BlockImagesTab