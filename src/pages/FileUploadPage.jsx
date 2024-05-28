import React, { useState, useEffect } from 'react'
import '../assets/styles/fileUpload.css'
import Header from '../component/header/Header'
import Toast from '../component/toast/Toast'
import PageHeader from '../component/pageheader/PageHeader'
import { ReactSelect } from '../component/forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData } from '../component/forms/Validation'
import FileUpload from '../component/fileUpload/FileUpload'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper'
import { ImageSize, apis } from '../data/data'
import { AnchorButton, PrimaryButton, SecondaryButton } from '../component/button/Button'
import FileDemo from '../component/fileDemo/FileDemo'
import { LightParagraph, Title } from '../component/typhography/Typography'
import { filterFile, downloadLink, logoutHelper } from '../helper/helper'
import { useStateContext } from '../contexts/ContextProvider'
import { demoFileIconGray, greenTickSM } from '../assets/icon/Icon'
import file from '../assets/files/keywordDemo.txt';


const FileUploadPage = () => {


    const [field, setInputs] = useState(inputsField);
    const error = errorField;
    const errorMessage = errorMessagefield;
    const [uploadedFilesTemp, setUploadedFilesTemp] = useState([])
    const { openToast, closeToast, setAuthenticate } = useStateContext();
    const [result, setResult] = useState([])
    const [fileError, setFileError] = useState(false)


    // filter size
    const sizeHandeler = (option) => {
        updateData('size', option, setInputs)
    }


    // clear files 
    const clearAll = () => {
        setUploadedFilesTemp([])
        setFileError(false)
        setResult([])
    }


    // submit Handler 
    const submitHandler = async () => {
        if (uploadedFilesTemp.length <= 0) {
            setFileError(true)
        } else {
            openToast('loading', 'Uploading files...')

            let newArray = filterFile(uploadedFilesTemp)

            setUploadedFilesTemp(newArray)

            if (newArray.length > 0) {
                setFileError(false)

                // Create a new FormData object
                const formData = new FormData();

                newArray.forEach((file) => { // Append uploaded files to the formData object
                    formData.append('file', file.file);
                });

                formData.append('size', field.size.value); // Append other form data to the formData object
                // await fetch(apis.fileUpload, {
                //     method: 'POST',
                //     body: formData,
                //     credentials: 'include',
                // }).then(response => response.json())
                //     .then((data) => {
                //         if (data.errorMessage === "invalid_session") {
                //             logoutHelper()
                //             setAuthenticate("false")
                //             openToast("error", 'Invalid Session');
                //             closeToast(4000);
                //         } else if (data.data) {
                //             setResult(data.data);
                //             openToast('success', 'File uploaded');
                //             closeToast(3000);
                //         }
                //     })
                //     .catch((error) => {
                //         console.error(error);
                //         openToast('error', 'File failed');
                //         closeToast(3000);
                //     });

                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, 2000);
                })

                openToast('success', 'File uploaded');
                closeToast(3000);

            } else {
                openToast('error', 'No valid file found');
                closeToast(3000);
            }





        }
    }





    // initial value 
    useEffect(() => {
        updateData('size', ImageSize[0], setInputs);
    }, []);

    useEffect(() => {
        if (uploadedFilesTemp.length > 0) {
            setFileError(false)
        }

    }, [uploadedFilesTemp])


    return (
        <>
            <Header />
            <main className='file-upload-page'>


                {/* page heaer  */}
                <PageHeader title="Image suggestion for keyword" />

                <SectionContainer additioalClass='page-content'>
                    <ContentWrapper additioalClass='big-wrapper'>
                        <WhiteBoard>
                            <form className="form horizontal-gap-layout">

                                <div className="form-row">
                                    <div>
                                        <ReactSelect
                                            additioalClass='not-creatable'
                                            id="size_at"
                                            label={'Select Size'}
                                            required={false}
                                            option={ImageSize}
                                            inputHandler={sizeHandeler}
                                            errorId="size_at-error"
                                            error={error.size}
                                            value={field.size}
                                            errorMessage={errorMessage.size}
                                        />
                                    </div>
                                    <div>
                                    </div>
                                </div>


                                <div className="upload-file-wrapper">
                                    <Title size='s'>Upload and attach Files</Title>
                                    <FileUpload
                                        uploadedFilesTemp={uploadedFilesTemp}
                                        setUploadedFilesTemp={setUploadedFilesTemp}
                                        supportedFile='text/'
                                        multiple={true}
                                    />

                                </div>
                                {/* error  */}

                                {
                                    fileError && <div className="form-row">
                                        <p className='error-txt'>Please select a file</p>
                                    </div>
                                }



                                <div className='button-container'>
                                    <SecondaryButton
                                        size='l'
                                        label='Clear All'
                                        action={clearAll}
                                    />
                                    <PrimaryButton
                                        size='l'
                                        label='Submit File'
                                        action={submitHandler}
                                    />
                                </div>

                            </form>




                            {/* demo file  */}
                            {
                                result.length <= 0 && <FileDemo demoFile={file} />
                            }




                            {/* data table  */}
                            {
                                result.length > 0 &&
                                <div className="uploaded-file-result">
                                    {
                                        result.map((file, index) => {
                                            const { fileName, errorFileName, outputFileName, uploadPath, uploadStatus } = file
                                            const downloadFileLink = downloadLink(outputFileName, uploadPath);
                                            const inputFileLink = downloadLink(fileName, uploadPath);
                                            const errorFileLink = downloadLink(errorFileName, uploadPath);
                                            return <div className="uploaded-file-result-list" key={index}>
                                                <div className='uploaded-file-detail'>
                                                    <div className="icon">
                                                        {demoFileIconGray}
                                                    </div>
                                                    <div>
                                                        <Title size='xs'>{fileName}</Title>
                                                        {
                                                            uploadStatus === 'success' ?
                                                                <LightParagraph additionalClass='success' size='xs'>
                                                                    <span>{greenTickSM}</span> File Uploaded
                                                                </LightParagraph>
                                                                : ''
                                                        }



                                                    </div>
                                                </div>
                                                <div className='action-button-container'>
                                                    <AnchorButton
                                                        size='m'
                                                        additionalClass='white'
                                                        label='Input File'
                                                        link={inputFileLink}
                                                        target="_blank"
                                                    />

                                                    <AnchorButton
                                                        size='m'
                                                        additionalClass='white'
                                                        label='Output File'
                                                        link={downloadFileLink}
                                                        target="_blank"
                                                    />

                                                    <AnchorButton
                                                        size='m'
                                                        additionalClass='white'
                                                        label='Error File'
                                                        link={errorFileLink}
                                                        target="_blank"
                                                    />
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            }


                        </WhiteBoard>
                    </ContentWrapper>
                </SectionContainer>








            </main>
            <Toast />
        </>
    )
}

export default FileUploadPage