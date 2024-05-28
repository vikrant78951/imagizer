import React, { useEffect, useState } from 'react'
import './CreatePattern.css'
import { Input } from '../forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../forms/Validation'
import { PrimaryButton } from '../button/Button'
import { apis } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider'
import { logoutHelper } from '../../helper/helper'

const CreatePattern = ({ closePopup, addNewRow, keyword, defaultPattern }) => {


    const [field, setFields] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const { openToast, closeToast, setAuthenticate } = useStateContext();


    //input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value
        switch (field) {
            case 'siteName_r': {
                updateData('siteName_r', value, setFields)
            }
                break;
            case 'pattern': {
                updateData('pattern', value, setFields)
            }
                break;
            case 'priority': {
                updateData('priority', value, setFields)
            }
                break;
            default: { console.log('unknown field') }
        }
        validationField(field, value, setError, setErrorMessage)
    }


    // validate form 
    const validate = () => {
        validationField('siteName_r', field.siteName_r, setError, setErrorMessage)
        validationField('pattern', field.pattern, setError, setErrorMessage)
        validationField('priority', field.priority, setError, setErrorMessage)

        if ((error.pattern === true || error.priority === true) ||
            (field.pattern.length === 0 || field.priority.length === 0)) {
            return false;
        } else {
            return true;
        }

    }

    useEffect(() => {
        if (defaultPattern) {
            updateData('pattern', keyword, setFields)
        }
    }, [])

    

    // submit form 
    const submitHandler = async () => {
        if (validate()) {

            console.log('submit')
            openToast('loading', 'Creating Pattern ');

            let apiUrl = `${apis.managePattern}?site_name=${field.siteName_r}&keyword_pattern=${encodeURIComponent(field.pattern)}&priority=${field.priority}`

            await fetch(apiUrl, {
                method: 'POST',
                credentials: 'include',
            }).then(response => response.json())
                .then(result => {
                    console.log(result)

                    if (result.errorMessage === "invalid_session") {
                        logoutHelper()
                        setAuthenticate("false")
                        openToast("error", 'Invalid Session');
                        closeToast(4000);
                    } else if (result.payload.status === "success") {
                        openToast('success', 'Pattern Created');
                        closeToast(4000);
                        closePopup()


                        let newrow = {
                            "id": 0,
                            "siteName": field.siteName_r,
                            "keywordPattern": field.pattern,
                            "priority": field.priority,
                            "mappedImages": [
                                {
                                    "rank": 1,
                                    "reviewFlag": "1",
                                    "originalImageId": 0,
                                    "path": "",
                                    "size": "425x282",
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

                        addNewRow(newrow)

                    } else {
                        openToast('error', result.errorMessage);
                        closeToast(4000)
                        // closePopup()

                    }

                })
                .catch(error => {
                    console.log(error)
                    openToast('error', error.message);
                    closeToast(4000)
                    // closePopup()

                })

        } else {
            console.log('failed submission')
            openToast('error', 'Please fill the form properly')
            closeToast(3000)
        }

    }

    return (
        <form className='form create-pattern-form'>

            <Input
                id="pattern"
                name="pattern"
                label="Pattern "
                placeholder="Enter pattern "
                required={true}
                value={field.pattern}
                inputHandler={inputHandler}
                errorId="pattern-error"
                error={error.pattern}
                errorMessage={errorMessage.pattern}
                autoFocus={!defaultPattern}
                autoComplete={false}

            />

            <Input
                type='text'
                id="siteName_r_at"
                name="siteName_r"
                label={'Site Name'}
                placeholder='Enter site name'
                required={false}
                value={field.siteName_r}
                inputHandler={inputHandler}
                errorId="siteName_r_at-error"
                error={error.siteName_r}
                errorMessage={errorMessage.siteName_r}
                autoFocus={defaultPattern}
                autoComplete={false}
            />

            <Input
                id="priority"
                name="priority"
                label="Priority "
                placeholder="Enter priority "
                required={true}
                value={field.priority}
                inputHandler={inputHandler}
                errorId="priority-error"
                error={error.priority}
                errorMessage={errorMessage.priority}
                autoFocus={false}
                autoComplete={false}

            />

            <PrimaryButton
                size='m'
                label='Create Pattern'
                action={submitHandler}
            />

        </form>
    )
}

export default CreatePattern