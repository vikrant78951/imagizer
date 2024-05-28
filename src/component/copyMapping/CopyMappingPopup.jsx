import React, { useState } from 'react'
import './CopyMapping.css'
import { PrimaryButton } from '../button/Button';
import { apis } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider'
import axios from 'axios';
import { cross } from '../../assets/icon/Icon';
import { closeAllDropdown, logoutHelper } from '../../helper/helper';
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../forms/Validation'
import { Input } from '../forms/FormElements'

const CopyMappingPopup = ({ sourceKeyword }) => {

    const { setAuthenticate, openToast, closeToast } = useStateContext()
    const [field, setFields] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);




    //input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value
        switch (field) {
            case 'keyword': updateData('keyword', value, setFields)
                break;
        }
        validationField(field, value, setError, setErrorMessage)
    }


    const updateCopymapping = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 200);
        })
    }


    // close modal  
    const closePopup = () => {
        closeAllDropdown();
    }

    const submitForm = async () => {
        let targetKeyword = field.keyword
        openToast('loading', 'Sending request');
        const apiUrl = `${apis.copyMapping}?sourceKeyword=${sourceKeyword}&targetKeywordsList=${targetKeyword}`;
        const apiCallBody = {}
        const apiCallheader = {
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
            },
            withCredentials: true,
        }

        await updateCopymapping()
        openToast('success', 'your Keyword will map soon');
        closeToast(4000);
        closePopup();
    }

    // submit 
    const sumbitHandler = () => {
        console.log(field.keyword)

        validationField('keyword', field.keyword, setError, setErrorMessage)

        if (error.keyword === true || field.keyword.length === 0) {
            console.log('validation failed');
        } else {
            submitForm();
        }

    }



    return (
        <div className='dropdown-content copy-mapping'>
            <div className="dropdown-box">
                <span className="close" onClick={closePopup}>{cross}</span>

                <div className="form horizontal-layout">
                    <div className='form-row'>

                        <Input
                            additionalClass="sm"
                            id="keyword_id"
                            name="keyword"
                            label={`Copy “${sourceKeyword}” mappings to more keywords`}
                            placeholder="Enter Keyword"
                            required={true}
                            value={field.keyword}
                            inputHandler={inputHandler}
                            errorId="keyword_id-error"
                            error={error.keyword}
                            errorMessage={errorMessage.keyword}
                            autoFocus={true}
                        />

                        <PrimaryButton
                            size='m'
                            action={sumbitHandler}
                            label="Copy Mapping"
                        />
                    </div>
                </div>
            </div>
        </div>
    )


}

export default CopyMappingPopup