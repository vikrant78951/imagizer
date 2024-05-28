import React, { useEffect, useState } from 'react'
import '../assets/styles/mapnreview.css'
import Header from '../component/header/Header'
import { Title } from '../component/typhography/Typography'
import { SectionContainer, ContentWrapper, Head } from '../component/wrapper/Wrapper'
import { SearchKeyword, SingleSearchKeyword } from '../component/forms/FormElements'
import { Loader } from '../component/loader/Loader'
import { logoutHelper, getKeyword } from '../helper/helper'
import { apis } from '../data/data'
import { NoPatternFound } from '../component/noresult/NoResult'
import Toast from '../component/toast/Toast'
import PatternMappingTable from '../component/table/PatternMappingTable'
import { useStateContext } from '../contexts/ContextProvider'


const ManagePattern = () => {

    const initialData = {
        loading: false,
        data: [],
        showTable: false,
        showNoResult: false,
    }
    const [keywords, setKeywords] = useState('')
    const [dataObject, setDataObject] = useState(initialData)
    const [tempObject, setTempObject] = useState({})
    const [copyPattern, setCopyPattern] = useState(false)
    const { setAuthenticate, openToast, closeToast } = useStateContext()

    const onClear = () => {

        setDataObject(prevData => ({ // set loader false and show table true
            ...prevData,
            loading: false,
            showNoResult: false,
            showTable: true,
            data: tempObject
        }));

    }

    // fetch searched pattern 
    const fetchSearchedPattern = async (value) => {
        // console.log('searchPattern')
        setDataObject(prevData => ({ // set loader true and instruction false
            ...prevData,
            loading: true,
            showNoResult: false,
            showTable: false
        }));
        // console.log(value)
        setKeywords(value)
        // const keyword = getKeyword(value);
        const keyword = value;

        let apiUrl = `${apis.viewPattern}?pattern=${encodeURIComponent(keyword)}`

        var requestOptions = {
            method: 'GET',
            credentials: 'include',
        };
        try {
            const response = await fetch(apiUrl, requestOptions);
            const result = await response.json();

            // console.log('payload ', result.payload)
            const arrayOfObjects = Object.values(result.payload).map(obj => ({ ...obj }));

            if (arrayOfObjects.length > 0) {

                setDataObject(prevData => ({ // set loader false and show table true
                    ...prevData,
                    loading: false,
                    showNoResult: false,
                    showTable: true,
                    data: arrayOfObjects
                }));
            } else {

                let fakeRow = {
                    "id": 0,
                    "siteName": '',
                    "keywordPattern": { keyword },
                    "priority": 0,
                    "mappedImages": [
                        {
                            "rank": 1,
                            "reviewFlag": "1",
                            "originalImageId": 0,
                            "path": "",
                            "size": "195x91",
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
                const fakeRowObject = Object.values(fakeRow).map(obj => ({ ...obj }));

                setDataObject(prevData => ({ // set loader false and show no result true
                    ...prevData,
                    loading: false,
                    showNoResult: true,
                    showTable: false,
                    data: [...prevData.data, fakeRowObject]
                }));
            }


        } catch (error) {
            // console.log(error);
            setDataObject(prevData => ({ // set loader false and show no result true
                ...prevData,
                loading: false,
                showNoResult: true,
                showTable: false,
            }));
        }
    }


    // fetch pattern for home page 
    const fetchPattern = async () => {

        setDataObject(prevData => ({ // set loader true and instruction false
            ...prevData,
            loading: true,
            showNoResult: false,
            showTable: false
        }));

        let apiUrl = apis.managePattern + `?page=1&size=10`;
        var requestOptions = {
            method: 'GET',
            headers: {},
            credentials: 'include',
        };
        try {
            const response = await fetch(apiUrl, requestOptions);
            const result = await response.json();

            if (result.errorMessage === "invalid_session") {
                logoutHelper()
                setAuthenticate("false")
                openToast("error", 'Invalid Session');
                closeToast(4000);
            } else {

                const arrayOfObjects = Object.values(result.payload).map(obj => ({ ...obj }));

                if (arrayOfObjects.length > 0) {
                    setDataObject(prevData => ({ // set loader false and show table true
                        ...prevData,
                        loading: false,
                        showNoResult: false,
                        showTable: true,
                        data: arrayOfObjects
                    }));
                    setTempObject(arrayOfObjects)
                } else {

                    setDataObject(prevData => ({ // set loader false and show no result true
                        ...prevData,
                        loading: false,
                        showNoResult: true,
                        showTable: false,
                    }));
                }
            }

        } catch (error) {
            console.log(error);
            setDataObject(prevData => ({ // set loader false and show no result true
                ...prevData,
                loading: false,
                showNoResult: true,
                showTable: false,
            }));
        }
    }


    // fetch patterns initially
    useEffect(() => {
        fetchPattern()
    }, [])

    useEffect(() => {
        if (copyPattern) {
            setDataObject(prevData => ({ // set loader false and show table true
                ...prevData,
                loading: false,
                showNoResult: false,
                showTable: true,
                data: []
            }));
        }
    }, [copyPattern])

    return (
        <>
            <Header />
            <main className='mapNreview'>

                {/* atf  */}
                <SectionContainer additioalClass="atf">
                    <ContentWrapper>
                        <Head>
                            <Title
                                size="ml">Search Pattern to map</Title>
                            {/* <LightParagraph size='l'>Enter pattern mapped or to be mapped to images you want to view.</LightParagraph> */}
                        </Head>
                        <SingleSearchKeyword
                            additionalClass='some'
                            placeHolder='Search Keyword'
                            onSubmit={fetchSearchedPattern}
                            defalultValue={keywords}
                        />
                    </ContentWrapper>
                </SectionContainer>



                {/* data Loader  */}
                {
                    dataObject.loading && <Loader />
                }

                {/* show result  */}
                {
                    dataObject.showNoResult && <NoPatternFound setCopyPattern={setCopyPattern} />
                }

                {/* show table  */}
                {
                    dataObject.showTable && <PatternMappingTable
                        tableDataArray={dataObject.data}
                        copyPattern={copyPattern}
                        keywords={keywords}
                        setCopyPattern={setCopyPattern} />
                }


            </main>
            <Toast />
        </>
    )
}

export default ManagePattern