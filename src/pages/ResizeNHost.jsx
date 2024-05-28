import React, { useEffect, useState } from 'react'
import '../assets/styles/resize.css'
import Header from '../component/header/Header'
import Toast from '../component/toast/Toast'
import PageHeader from '../component/pageheader/PageHeader'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper'
import { LightParagraph, Title } from '../component/typhography/Typography'
import { useStateContext } from '../contexts/ContextProvider'
import { Input, Checkbox } from '../component/forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../component/forms/Validation'
import { VerticleOrSeprator } from '../component/seprator/Seprator'
import FileUpload from '../component/fileUpload/FileUpload'
import { PrimaryButton, AnchorButton } from '../component/button/Button'
import { apis } from '../data/data'
import { logoutHelper } from '../helper/helper'


const ResizeNHost = () => {


    const [field, setFields] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const [uploadedFilesTemp, setUploadedFilesTemp] = useState('');
    const [getLinkCheckbox, setGetLinkCheckbox] = useState(true)
    const [downloadLink, setDownloadLink] = useState('')
    const [imageLink, setImageLink] = useState('')
    const { openToast, closeToast, setAuthenticate } = useStateContext();


    //input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value
        switch (field) {
            case 'imageUrl': {
                updateData('imageUrl', value, setFields)
                setUploadedFilesTemp('')
            }
                break;
            case 'width': {
                updateData('width', value, setFields)
            }
                break;
            case 'height': {
                updateData('height', value, setFields)
            }
                break;
            default: { console.log('unknown field') }
        }
        validationField(field, value, setError, setErrorMessage)
    }


    const getLinkCheckboxHandler = ({ target }) => {
        setGetLinkCheckbox(target.checked)
    }


    // form validations
    const validate = () => {
        return new Promise((resolve, reject) => {
            let formValidation = false;
            validationField('width', field.width, setError, setErrorMessage);
            validationField('height', field.height, setError, setErrorMessage);

            if (uploadedFilesTemp && uploadedFilesTemp.length > 0) {
                // we have files 
                if ((error.width === true || error.height === true)) {
                    formValidation = false;
                } else {
                    formValidation = true;
                }
                updateData('imageUrl', false, setError);
                updateData('imageUrl', '', setErrorMessage);

            } else if (field.imageUrl !== '') {
                // we have s3link 
                validationField('imageUrl', field.imageUrl, setError, setErrorMessage);
                if ((error.width === true || error.height === true || error.imageUrl === true)) {
                    formValidation = false;
                } else {
                    formValidation = true;
                }
            } else {
                formValidation = false;
                validationField('imageUrl', field.imageUrl, setError, setErrorMessage);
            }

            resolve(formValidation)
        })
    }


    // submit handler 
    const submitHandler = async (event) => {
        event.preventDefault();

        console.log('submit')
        openToast('loading', 'Uploading Data');
        const formData = new FormData();
        if (uploadedFilesTemp[0]) {
            formData.append('fileName', uploadedFilesTemp[0].file);
        } else {
            formData.append('fileName', '');
        }
        formData.append('imageUrl', field.imageUrl);
        formData.append('width', field.width)
        formData.append('height', field.height)
        if (getLinkCheckbox) {
            formData.append('rsync', true);
        }

        // await fetch(apis.uploadDownload, {
        //     method: 'POST',
        //     body: formData,
        //     credentials: 'include',
        // }).then(response => response.json())
        //     .then((data) => {
        //         console.log(data);
        //         if (data.errorMessage === "invalid_session") {
        //             logoutHelper()
        //             setAuthenticate("false")
        //             openToast("error", 'Invalid Session');
        //             closeToast(4000);
        //         } else if (data.errMessage) {
        //             openToast('error', data.errMessage);
        //             closeToast(4000);
        //         } else if (data.croppedPath) {
        //             setImageLink(data.croppedImageLink);
        //             setDownloadLink(data.croppedPath);
        //             openToast('success', 'image cropped successfully');
        //             closeToast(4000);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         openToast('error', error.message);
        //         closeToast(4000);
        //     });


        setImageLink('https://vision.media.net/new/250x150/11/129/234/86/b369f1be-a63c-4f1c-a0f5-21e02b00d64d.jpg');
        setDownloadLink('https://vision.media.net/new/250x150/11/129/234/86/b369f1be-a63c-4f1c-a0f5-21e02b00d64d.jpg');
        openToast('success', 'image cropped successfully');
        closeToast(4000);

    }


    useEffect(() => {
        if (uploadedFilesTemp && uploadedFilesTemp.length > 0) {
            updateData('imageUrl', '', setFields)
        }
    }, [uploadedFilesTemp])


    const downloadImage = async () => {
        let filePath = 'https://vision.media.net/new/250x150/11/129/234/86/b369f1be-a63c-4f1c-a0f5-21e02b00d64d.jpg'
        if (openToast && closeToast) {
            openToast('loading', 'Image downloading')
        }
        // let url = filePath
        // await fetch(url, {
        //     method: 'GET',
        //     credentials: 'include',
        // })
        //     .then(response => response.blob())
        //     .then(blob => {
        //         if (blob.size === 0 && blob.type === '') {
        //             if (openToast && closeToast) {
        //                 openToast('error', 'Image Failed to download')
        //                 closeToast(4000)
        //             }
        //         } else {
        //             const url = URL.createObjectURL(blob);
        //             const a = document.createElement('a');
        //             a.href = url;
        //             a.download = 'image.jpg';
        //             document.body.appendChild(a);
        //             a.click();
        //             document.body.removeChild(a);
        //             URL.revokeObjectURL(url);

        //             if (openToast && closeToast) {
        //                 openToast('success', 'Image Downloaded')
        //                 closeToast(2000)
        //             }
        //         }
        //     });
        
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 1000);
        })
        openToast('success', 'Your image will download soon')
        closeToast(2000)

    }

    return (
        <>
            {/* header  */}
            <Header />
            <main className='resize-n-host'>

                {/* page heaer  */}
                <PageHeader title="Resize and Host Images" />


                {/* page content  */}
                <SectionContainer additioalClass='page-content'>
                    <ContentWrapper additioalClass='big-wrapper'>
                        <WhiteBoard>

                            <form className="form horizontal-gap-layout">
                                <div className="form-row">

                                    <div>
                                        <Title size="sm">
                                            Image URL
                                        </Title>

                                        <Input
                                            additionalClass=""
                                            id="imageUrl_id"
                                            name="imageUrl"
                                            label="Image URL "
                                            placeholder="Enter Image URL here"
                                            required={true}
                                            value={field.imageUrl}
                                            inputHandler={inputHandler}
                                            errorId="imageUrl_id-error"
                                            error={error.imageUrl}
                                            errorMessage={errorMessage.imageUrl}
                                            autoFocus={true}
                                        />

                                    </div>

                                    <VerticleOrSeprator />


                                    <div className='file-upload-container'>
                                        <Title size="sm">
                                            Upload and attach Image
                                        </Title>
                                        <FileUpload
                                            uploadedFilesTemp={uploadedFilesTemp}
                                            setUploadedFilesTemp={setUploadedFilesTemp}
                                            supportedFile='image/'
                                            multiple={false}
                                        />



                                    </div>


                                </div>

                                <div className='form-row '>
                                    <div className='size-container'>
                                        <Title size="sm">
                                            Resize to
                                        </Title>
                                        <div className="input-container ">
                                            <label>
                                                <LightParagraph size='s'>Select size in pixels</LightParagraph>
                                            </label>
                                        </div>
                                        <div className="form-row">
                                            <Input
                                                additionalClass=""
                                                id="width_id"
                                                name="width"
                                                errorId="width_id"
                                                error={error.width}
                                                errorMessage={errorMessage.width}
                                                type="text"
                                                label={false}
                                                placeholder="Width"
                                                required={true}
                                                value={field.width}
                                                inputHandler={inputHandler}
                                                disable={false}
                                            />
                                            <Input
                                                additionalClass=""
                                                id="height_id"
                                                name="height"
                                                errorId="height_id"
                                                error={error.height}
                                                errorMessage={errorMessage.height}
                                                type="text"
                                                label={false}
                                                placeholder="Height"
                                                required={true}
                                                value={field.height}
                                                inputHandler={inputHandler}
                                                disable={false}
                                            />
                                        </div>
                                        <Checkbox
                                            additionalClass=''
                                            type='checkbox'
                                            id="downloadLink"
                                            name="downloadLink"
                                            label={`Get Image Link`}
                                            inputHandler={getLinkCheckboxHandler}
                                            autoFocus={false}
                                            checked={getLinkCheckbox}
                                        />
                                        <div className='input-container image-link'>
                                            {
                                                (getLinkCheckbox && imageLink !== '') && <AnchorButton additionalClass='blue ' label={imageLink} size='s' link={imageLink} target='_blank' />
                                            }
                                        </div>
                                    </div>
                                    <div></div>
                                </div>

                                <div className='form-row button-container'>
                                    {
                                        (downloadLink !== '') && <span className='link blue' onClick={downloadImage} >Download Image</span>
                                    }
                                    <PrimaryButton label='Crop Images' size='l' action={submitHandler} />


                                </div>

                            </form>



                        </WhiteBoard>
                    </ContentWrapper>
                </SectionContainer>


            </main>

            {/* toast notification */}
            <Toast />
        </>
    )
}

export default ResizeNHost