import React, { useState } from 'react'
import { useStateContext } from '../../contexts/ContextProvider'
import { PrimaryButton } from '../button/Button';
import { Input } from '../forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../forms/Validation';
import { credSignup } from '../../auth/Auth'

const SignupWithCredential = () => {


    // states
    const [field, setInputs] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const { authenticate, setAuthenticate, openToast, closeToast, setUser } = useStateContext();



    // input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value

        switch (field) {
            case 'userName': updateData('userName', value, setInputs)
                break;
            case 'password': updateData('password', value, setInputs)
                break;
            default: console.log('unknown field')
        }
        validationField(field, value, setError, setErrorMessage)
    }


    // Form validate after submit
    const validate = () => {
        validationField('userName', field.userName, setError, setErrorMessage)
        validationField('password', field.password, setError, setErrorMessage)
        if ((error.userName === true || error.password === true) || (field.userName.length === 0 || field.password.length === 0)) {
            return false;
        } else {
            return true;
        }
    }



    // login with credential 
    const signupWithCredentialHandler = async () => {
        if (validate()) {
            // validation passed 
            await credSignup(field.userName, field.password, setAuthenticate, setUser, openToast, closeToast)

        } else {
            // validation failed 
            updateData('formIsValid', false, setError);
            openToast('error', 'Please fill the form properly')
            closeToast(6000)
        }
    }

    return (
        <div className='login-with-credential'>

            <form className="form">

                {/* user name input */}
                <Input
                    additionalClass=''
                    id="userName_at"
                    name="userName"
                    label="Username"
                    placeholder='Enter username'
                    type='text'
                    required={true}
                    value={field.userName}
                    inputHandler={inputHandler}
                    errorId="userName_at-error"
                    error={error.userName}
                    errorMessage={errorMessage.userName}
                    autoFocus={true}
                    autoComplete={true}
                />

                <Input
                    additionalClass=''
                    id="password_at"
                    name="password"
                    label="Password"
                    placeholder='Enter password'
                    type='password'
                    required={true}
                    value={field.password}
                    inputHandler={inputHandler}
                    errorId="password_at-error"
                    error={error.password}
                    errorMessage={errorMessage.password}
                    autoFocus={false}
                    autoComplete={true}
                />

                <PrimaryButton
                    size='l'
                    label='Sign Up'
                    logo={false}
                    action={signupWithCredentialHandler}
                />


            </form>



        </div>
    )
}

export default SignupWithCredential