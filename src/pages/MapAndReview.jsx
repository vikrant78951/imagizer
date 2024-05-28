import React, { useState } from 'react'
import '../assets/styles/mapnreview.css'
import Header from '../component/header/Header'
import { Title } from '../component/typhography/Typography'
import { SectionContainer, ContentWrapper, Head } from '../component/wrapper/Wrapper'
import { SearchKeyword } from '../component/forms/FormElements'
import MapingInstructions from '../component/instructions/MapingInstructions'
import { Loader } from '../component/loader/Loader'
import { createOption, getKeyword, logoutHelper } from '../helper/helper'
import { apis } from '../data/data'
import { NoResult } from '../component/noresult/NoResult'
import MapNReviewTable from '../component/table/MapNReviewTable'
import Toast from '../component/toast/Toast'
import { keywordsData } from '../data/data'

const MapAndReview = () => {

    const initialData = {
        loading: false,
        data: [],
        showTable: false,
        showInstruction: true,
        showNoResult: false,
    }
    const [keywords, setKeywords] = useState([createOption('Best healthy breakfast')])
    const [dataObject, setDataObject] = useState(initialData)


    const getData = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: keywordsData
                })
            }, 2000)
        })
    }

    // search keyword 
    const searchKeywordSubmitHandler = async (value) => {

        setKeywords(value)
        setDataObject(prevData => ({ // set loader true and instruction false
            ...prevData,
            loading: true,
            showInstruction: false,
            showNoResult: false,
            showTable: false
        }));


        const keyword = getKeyword(value); // get list of keyword value form keywords object

        try {


            let response = await getData()
            console.log(response)
            console.log(response.success, response.data.length)
            if (response.success && response.data.length > 0) {

                setDataObject(prevData => ({
                    // set loader false and show table true
                    ...prevData,
                    loading: false,
                    showNoResult: false,
                    showTable: true,
                    data: response.data
                }));

            } else {
                setDataObject(prevData => ({ // set loader false and show no result true
                    ...prevData,
                    loading: false,
                    showNoResult: true,
                    showTable: false,
                }));

            }

        } catch (error) {
            console.log(error)
            setDataObject(prevData => ({ // set loader false and show no result true
                ...prevData,
                loading: false,
                showNoResult: true,
                showTable: false,
            }));

        }
    }

    // reset the flow if keyword is empty 
    const resetFlow = () => {
        setDataObject(prevData => ({ // set loader true and instruction false
            ...prevData,
            loading: false,
            showInstruction: true,
            showNoResult: false,
            showTable: false
        }));
    }


    return (
        <>
            <Header />
            <main className='mapNreview'>

                {/* atf  */}
                <SectionContainer additioalClass="atf">
                    <ContentWrapper>
                        <Head>
                            <Title size="ml">Enter keywords to review or to map</Title>
                        </Head>

                        <SearchKeyword
                            keyword={keywords}
                            setKeyword={setKeywords}
                            onSubmit={searchKeywordSubmitHandler}
                            multiple={true}
                            clearAll={resetFlow}
                        />
                    </ContentWrapper>
                </SectionContainer>


                {/* man and review instructions  */}
                {
                    dataObject.showInstruction && <MapingInstructions />
                }

                {/* data Loader  */}
                {
                    dataObject.loading && <Loader />
                }

                {/* show result  */}
                {
                    dataObject.showNoResult && <NoResult />
                }

                {/* show table  */}
                {
                    dataObject.showTable && <MapNReviewTable tableDataArray={dataObject.data} />
                }



            </main>
            <Toast />
        </>
    )
}

export default MapAndReview