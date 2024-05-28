import React, { useEffect, useState } from 'react'
import './BlockKeyword.css'
import { MultiInputs, Input } from '../forms/FormElements';
import { LightParagraph } from '../typhography/Typography'
import { tootip } from '../../assets/icon/Icon'
import { PrimaryButton } from '../button/Button';
import BlockkeywordTable from '../table/BlockedKeywordTable';
import { getKeywordByForwordSlash, logoutHelper } from '../../helper/helper';
import { apis } from '../../data/data';
import { NoResult } from '../noresult/NoResult';
import { Loader } from '../loader/Loader';
import { Title } from '../typhography/Typography';
import { useStateContext } from '../../contexts/ContextProvider'
import { inputsField, errorField, errorMessagefield, updateData, validationField, handleKeyDown, handleBlur, handlePaste, handleFormSubmit } from '../forms/Validation';
import { blockedKeywordResult } from '../../data/data';

const BlockKeyword = ({ additionalClass }) => {


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
    const [keyword, setKeyword] = useState([])
    const [keywordError, setKeywordError] = useState(false)
    const { openToast, closeToast, setAuthenticate } = useStateContext();
    const [shouldReset, setShouldReset] = useState(false);
    const [field, setInputs] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);


    // input handler
    const inputHandler = (e) => {
        let field = e.target.name;
        let value = e.target.value;
        switch (field) {
            case 'keyword':
                updateData('keyword', value, setInputs);
                break;
        }
        validationField(field, value, setError, setErrorMessage);
    };

    // update state 
    const valueChangehandler = (value) => {
        setKeyword(value)
    }


    const fetchData = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: blockedKeywordResult
                })
            }, 2000);
        })
    }

    // fetch blocked keywords 
    const fetchBlockedKeyword = async (cp, reset) => {
        if (reset) {
            setDataObject(prevData => ({ //update state
                ...prevData,
                loading: true,
                showCard: false,
                noMoreData: false,
                showNoResult: false,
                isFetchingData: true,
                noMoreData: false,
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

        // let blockTableApi = `${apis.viewBlockKeyword}?page=${cp}&keyword=${encodeURIComponent(field.keyword)}`;
        // await fetch(blockTableApi, {
        //     method: 'GET',
        //     credentials: 'include',
        // }).then(response => response.json())
        //     .then((data) => {
        //         if (data.errorMessage === "invalid_session") {
        //             logoutHelper()
        //             setAuthenticate("false")
        //             openToast("error", 'Invalid Session');
        //             closeToast(4000);
        //         } else if (data.status === 'success' && data.data && data.data?.keywordAdminMapList.length !== 0) {
        //             let temp = []
        //             if (reset) {
        //                 temp = data.data?.keywordAdminMapList
        //             } else {
        //                 temp = [
        //                     ...dataObject.data,
        //                     ...data.data?.keywordAdminMapList
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
        //                     isFetchingData: true,
        //                     loading: false,
        //                 }));
        //             } else {
        //                 setDataObject(prevData => ({
        //                     ...prevData,
        //                     showNoResult: false,
        //                     showCard: true,
        //                     noMoreData: true,
        //                     isFetchingData: true,
        //                     loading: false,
        //                 }));
        //             }
        //         }
        //     })
        //     .catch((error) => {
        //         // Request failed
        //         console.error(error);
        //         if (reset) {
        //             setDataObject(prevData => ({
        //                 ...prevData,
        //                 data: [],
        //                 showNoResult: true,
        //                 showCard: false,
        //                 noMoreData: false,
        //                 isFetchingData: true,
        //                 loading: false,
        //             }));
        //         } else {
        //             setDataObject(prevData => ({
        //                 ...prevData,
        //                 showNoResult: true,
        //                 showCard: true,
        //                 noMoreData: true,
        //                 isFetchingData: true,
        //                 loading: false,
        //             }));
        //         }
        //     });



        const response = await fetchData()

        let temp = []
        if (reset) {
            temp = response.data
        } else {
            temp = [
                ...dataObject.data,
                ...response.data
            ]
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




    };

    const handleBlockStatusChange = (newStatus) => {
        fetchBlockedKeyword(1, true)
    }


    // block keyword 
    const blockKeywordSubmithandler = async () => {
        if (keyword.length > 0) {
            console.log(keyword)
            setKeywordError(false)
            // let keywordList = getKeywordByForwordSlash(keyword);
            // let blockKeywordApi = `${apis.BlockAndUnblockKeyword}?action=BLOCK&keyword=${keywordList}`;
            // openToast('loading', 'Unblocking keyword');

            // await fetch(blockKeywordApi, {
            //     method: 'POST',
            //     credentials: 'include',
            // }).then(response => response.json())
            //     .then((data) => {
            //         // Request was successful
            //         if (data.errorMessage === "invalid_session") {
            //             setKeyword([])
            //             setShouldReset(true)
            //             logoutHelper()
            //             setAuthenticate("false")
            //             openToast("error", 'Invalid Session');
            //             closeToast(4000);

            //         } else if (Number(data.rows_updated) >= 1) {
            //             openToast('success', 'Keyword Blocked');
            //             closeToast(3000);
            //             setKeyword('')
            //             setShouldReset(true)
            //         } else {
            //             openToast('error', 'Failed to block keyword');
            //             closeToast(3000);
            //         }
            //     })
            //     .catch((error) => {
            //         // Request failed
            //         console.log(error);
            //         openToast('error', error.message);
            //         closeToast(3000);
            //     });


            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 2000);
            })

            openToast('success', 'Keyword Blocked');
            closeToast(3000);
            setKeyword('')
            setShouldReset(true)

        } else {
            setKeywordError(true)
        }
    }


    // search keyword 
    const searchKeywordSubmithandler = () => {

        validationField('keyword', field.keyword, setError, setErrorMessage);

        if (error.keyword === true || field.keyword.length === 0) {
            console.log('validation failed');
        } else {
            fetchBlockedKeyword(1, true);
        }

    }

    const keyPressHandler = (a) => {
        if (a) {
            searchKeywordSubmithandler()
        }
    }

    // use effects 
    useEffect(() => {
        fetchBlockedKeyword(1, true)
    }, [])


    // add scroll function to table 
    useEffect(() => {
        const section = document.querySelector('.table-container');
        // console.log(dataObject.showCard)
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
                            noMoreData: false
                        }));
                        // console.log('fetch the data..', dataObject.currentPage)
                        fetchBlockedKeyword(dataObject.currentPage, false);
                    }

                }
            }

            section.addEventListener('scroll', handleScrollForSection);
            return () => {
                section.removeEventListener('scroll', handleScrollForSection);
            };
        }
    }, [dataObject.data])

    return (
        <div className={`block-keyword-page ${additionalClass ? additionalClass : ''} `}>

            <form className="form horizontal-layout">
                <div className='form-row'>


                    {/* block keyword  */}
                    <div className='singular-input-container'>
                        <div className='singular-input'>
                            <MultiInputs
                                keyword={keyword}
                                callback={valueChangehandler}
                                placeholder="Enter Keyword"
                                multiple={true}
                                inputError={keywordError}
                                errorHandler={keywordError}

                            />

                            <PrimaryButton
                                size='s'
                                action={blockKeywordSubmithandler}
                                label="Block"
                            />
                        </div>

                        <LightParagraph size='s'>
                            <span className="icon"> {tootip}</span>
                            You can add multiple keywords here
                        </LightParagraph>
                    </div>

                    <div className='singular-input-container'>
                        <div className='singular-input'>
                            <Input
                                additionalClass=""
                                id="keyword_id"
                                name="keyword"
                                errorId="keyword_id"
                                error={error.keyword}
                                errorMessage={errorMessage.keyword}
                                type="text"
                                label={false}
                                placeholder="Search keyword"
                                required={true}
                                value={field.keyword}
                                inputHandler={inputHandler}
                                keyPressHandler={keyPressHandler}
                                disable={false}
                            />

                            <PrimaryButton
                                size='s'
                                action={searchKeywordSubmithandler}
                                label="Search"
                            />
                        </div>


                    </div>


                </div>
            </form>


            <div className="table-container">
                {
                    (dataObject.showCard === true) &&
                    <BlockkeywordTable
                        tableData={dataObject.data}
                        handleBlockStatusChange={handleBlockStatusChange}
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

export default BlockKeyword