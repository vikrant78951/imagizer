import React, { useEffect, useState } from 'react'
import '../assets/styles/imageUpload.css'
import Header from '../component/header/Header'
import Toast from '../component/toast/Toast'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper'
import PageHeader from '../component/pageheader/PageHeader'
import { LightParagraph } from '../component/typhography/Typography'
import { Input, Checkbox, MultiInputs } from '../component/forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../component/forms/Validation'
import ImageUploadWithPreview from '../component/fileUpload/ImageUploadWithPreview'
import { apis } from '../data/data'
import { useStateContext } from '../contexts/ContextProvider'
import { PrimaryButton } from '../component/button/Button'
import { OrSeprator } from '../component/seprator/Seprator'
import { getKeywordByComma, logoutHelper } from '../helper/helper'
import API from '../service/api'


const ImageUpload = () => {


    const { openToast, closeToast } = useStateContext();
    const [field, setFields] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const [uploadedFilesTemp, setUploadedFilesTemp] = useState([])
    const [fileError, setFileError] = useState(false)
    const [expiry, setExpiry] = useState(false)
    const [relatedTag, setRelatedTag] = useState([])
    const [relatedTagError, setRelatedTagError] = useState([])
    const { team } = useStateContext()
    const [activeIndex, setActiveIndex] = useState(0);
    const [topPartError, setTopPartError] = useState(false)
    const [bottomPartError, setBottomPartError] = useState(false)
    const today = new Date().toISOString().split('T')[0];


    // toggle according 
    const toggleAccordion = (index) => {
        setTopPartError(false)
        setBottomPartError(false)
        setActiveIndex(activeIndex === index ? null : index);
    };

    //input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value
        switch (field) {
            case 'imageUrl': {
                updateData('imageUrl', value, setFields)
                setUploadedFilesTemp([]);
            }
                break;
            case 'expiryDate': updateData('expiryDate', value, setFields)
                break;
            case 'sourceUrl': updateData('sourceUrl', value, setFields)
                break;
            case 'keyword': updateData('keyword', value, setFields)
                break;
        }
        validationField(field, value, setError, setErrorMessage)
    }

    // handle expiry 
    const handleExpiry = (event) => {
        setExpiry(event.target.checked)
        updateData('expiryDate', false, setError);
        updateData('expiryDate', '', setErrorMessage);
    };

    // keyword change handler 
    const relatedTagChangeHandler = (value) => {
        setRelatedTag(value)
        setRelatedTagError(false)
    }

    // Form validate after submit
    const validate = () => {
        return new Promise((res, rej) => {
            let formValidation = false;


            if (!expiry) {
                validationField('expiryDate', field.expiryDate, setError, setErrorMessage);
            } else {
                updateData('expiryDate', false, setError);
                updateData('expiryDate', '', setErrorMessage);
            }

            if (uploadedFilesTemp.length > 0 && uploadedFilesTemp[0].validType) {
                // we have files 
                if ((error.sourceUrl === true)) {
                    formValidation = false;
                    setTopPartError(true)
                } else {
                    formValidation = true;
                    setTopPartError(false)
                }
                updateData('imageUrl', false, setError);
                updateData('imageUrl', '', setErrorMessage);

            } else if (uploadedFilesTemp.length > 0 && !uploadedFilesTemp[0].validType) {
                openToast('error', 'Uploaded image format is not valid');
                closeToast(6000);
                formValidation = false;
                setTopPartError(true)
            } else if (field.imageUrl !== '') {

                // we have s3link 
                validationField('imageUrl', field.imageUrl, setError, setErrorMessage);
                if ((error.sourceUrl === true || error.imageUrl === true)) {
                    formValidation = false;
                    setTopPartError(true)
                } else {
                    formValidation = true;
                    setTopPartError(false)
                }
            } else {
                validationField('imageUrl', field.imageUrl, setError, setErrorMessage);
                if ((error.sourceUrl === true || error.imageUrl === true)) {
                    formValidation = false;
                    setTopPartError(true)
                } else {
                    formValidation = true;
                    setTopPartError(false)
                }
            }

            if (relatedTag.length <= 0) {
                setRelatedTagError(true)
                formValidation = false;
                setBottomPartError(true)
            } else {
                setRelatedTagError(false)
                setBottomPartError(false)
            }

            res(formValidation);
        })
    }

    // form submit 
    const submitHandler = async (event) => {
        event.preventDefault();

        let validity = await validate();
        if (validity) {
            const formData = new FormData();
            let tags = getKeywordByComma(relatedTag) || "";

            if (uploadedFilesTemp.length > 0) {
                uploadedFilesTemp.forEach(file => {
                    formData.append('files', file.file);
                });
            } else {
                formData.append('imageUrl', field.imageUrl);
            }

            formData.append('sourceUrl', field.sourceUrl);
            formData.append('tags', field.keyword);
            formData.append('keywords', tags);
            if (expiry) {
                formData.append('lifeTimeLicense', 'on');
            } else {
                formData.append('expiryDate', field.expiryDate);
            }

            openToast("loading", 'Uploading form');


            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 2000);
            })
            setUploadedFilesTemp([])
            openToast("success", 'image uploaded');
            closeToast(4000);

        } else {
            console.log('failed');
        }
    };



    useEffect(() => {
        if (uploadedFilesTemp.length > 0) {
            updateData('imageUrl', '', setFields)
        }
    }, [uploadedFilesTemp])

    return (
        <>
            <Header />
            <main className='image-upload-page'>


                {/* page heaer  */}
                <PageHeader title="Image Upload" />

                <SectionContainer additioalClass='page-content'>
                    <ContentWrapper additioalClass='big-wrapper'>
                        <WhiteBoard>

                            {
                                (team === 'Titanium' || team === 'Forbes' || team === 'GINSU') ?
                                    <>
                                        {/* description */}
                                        <div className="description">
                                            <LightParagraph size='s'>
                                                Please ensure that you exclusively upload licensed images. Your email ID will be associated with the image and you may be requested to provide license information when necessary. For further details, please refer to the following link: <a className='link' target='_blank' href="https://docs.google.com/document/d/1TTOyebNJpqeoJw4_a_RpDcTa1fA58UB-i1tOldu9Lrs/edit?usp=sharing">click here</a>.
                                            </LightParagraph>
                                        </div>



                                        {/* form  */}
                                        <form className="form horizontal-gap-layout" encType="multipart/form-data">
                                            <div className="accordian">

                                                <div className={`accordion-item ${activeIndex === 0 || topPartError ? 'active' : ''} `}>
                                                    <div className="accordion-item-header" onClick={() => toggleAccordion(0)}>
                                                        <h4>Upload and Attach Files</h4>
                                                        <span className={`icon ${activeIndex === 0 ? 'active' : ''}`}>
                                                            <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M24 2L13 13L2 2" stroke="#1A202E" strokeWidth="3"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="accordion-item-body"  >
                                                        <div className=' accordion-item-body-content'>
                                                            <div className="upload-file-wrapper">

                                                                <ImageUploadWithPreview
                                                                    uploadedFilesTemp={uploadedFilesTemp}
                                                                    setUploadedFilesTemp={setUploadedFilesTemp}
                                                                    supportedFile='image/'
                                                                    multiple={true}
                                                                    maxFile='10'
                                                                />
                                                                <div className="support-details">
                                                                    <ul>
                                                                        <LightParagraph size='xs'> Supported format :  JPEG</LightParagraph>
                                                                        <LightParagraph size='xs'> Min Dimensions : 1200x800  </LightParagraph>
                                                                        <LightParagraph size='xs'> Max Height and Width : 6000  </LightParagraph>
                                                                        <LightParagraph size='xs'> Max File : 10 Images</LightParagraph>
                                                                    </ul>
                                                                </div>
                                                                {
                                                                    fileError && <div className="form-row">
                                                                        <p className='error-txt'>Please select a file</p>
                                                                    </div>
                                                                }
                                                            </div>

                                                            <OrSeprator />


                                                            <div className="form-row single-cell">

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
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`accordion-item ${activeIndex === 1 || bottomPartError ? 'active' : ''}`}>
                                                    <div className="accordion-item-header" onClick={() => toggleAccordion(1)}>
                                                        <h4> Image Details</h4>
                                                        <span className={`icon ${activeIndex === 1 ? 'active' : ''}`}>
                                                            <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M24 2L13 13L2 2" stroke="#1A202E" strokeWidth="3"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="accordion-item-body" >
                                                        <div className="accordion-item-body-content">
                                                            <div className="form-row">

                                                                <div>
                                                                    <Input
                                                                        additionalClass=""
                                                                        id="expiryDate_id"
                                                                        name="expiryDate"
                                                                        label="Expiry Date"
                                                                        type="date"
                                                                        placeholder="Enter Expiry Date"
                                                                        required={true}
                                                                        value={field.expiryDate}
                                                                        inputHandler={inputHandler}
                                                                        errorId="expiryDate_id-error"
                                                                        error={error.expiryDate}
                                                                        errorMessage={errorMessage.expiryDate}
                                                                        disable={expiry}
                                                                        min={today}
                                                                    />

                                                                    <Checkbox
                                                                        additionalClass=''
                                                                        type='checkbox'
                                                                        id="expiryDateCheckbox_id"
                                                                        name="expiryDateCheckbox"
                                                                        label={`License Never Expires`}
                                                                        inputHandler={handleExpiry}
                                                                        autoFocus={false}
                                                                        checked={expiry}
                                                                    />
                                                                </div>
                                                                <Input
                                                                    additionalClass=""
                                                                    id="sourceUrl_id"
                                                                    name="sourceUrl"
                                                                    label="Source URL"
                                                                    placeholder="Enter sources Link"
                                                                    required={false}
                                                                    value={field.sourceUrl}
                                                                    inputHandler={inputHandler}
                                                                    errorId="sourceUrl_id-error"
                                                                    error={error.sourceUrl}
                                                                    errorMessage={errorMessage.sourceUrl}
                                                                />

                                                            </div>


                                                            <div className="form-row">


                                                                <div>
                                                                    <div className="input-container">
                                                                        <label htmlFor="relatedTag">
                                                                            <LightParagraph size='s'>keywords to map <span className="imp">*</span></LightParagraph>
                                                                        </label>
                                                                    </div>
                                                                    <MultiInputs
                                                                        additionalClass='lg'
                                                                        callback={relatedTagChangeHandler}
                                                                        placeholder="Keywords"
                                                                        inputError={relatedTagError}
                                                                        errorHandler={true}
                                                                        resetValue={false}
                                                                        multiple={true}
                                                                    />
                                                                </div>

                                                                <Input
                                                                    additionalClass=""
                                                                    id="keyword_id"
                                                                    name="keyword"
                                                                    label="tags to map (Optional)"
                                                                    placeholder="Enter tag"
                                                                    required={false}
                                                                    value={field.keyword}
                                                                    inputHandler={inputHandler}
                                                                    errorId="keyword_id-error"
                                                                    error={error.keyword}
                                                                    errorMessage={errorMessage.keyword}
                                                                    autoFocus={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='button-container'>
                                                <PrimaryButton
                                                    size=''
                                                    label='Upload'
                                                    action={submitHandler}
                                                />
                                            </div>
                                        </form>

                                    </> :
                                    <div className="description">
                                        <LightParagraph size='s'>
                                            Image Upload feature is only available for Ginsu, Titanium and Forbes.
                                        </LightParagraph>
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

export default ImageUpload