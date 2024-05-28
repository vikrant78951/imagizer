import React, { useState } from 'react'
import { useStateContext } from '../../contexts/ContextProvider'
import { PrimaryButton } from '../button/Button';
import { Input } from '../forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../forms/Validation';
import { credLogin } from '../../auth/Auth'

const LoginWithCredential = () => {


    // states
    const [field, setInputs] = useState(inputsField);
    const [error, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);
    const { setAuthenticate, openToast, closeToast, setUser } = useStateContext();



    // input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value

        switch (field) {
            case 'username': updateData('username', value, setInputs)
                break;
            case 'password': updateData('password', value, setInputs)
                break;
            default: console.log('unknown field')
        }
        validationField(field, value, setError, setErrorMessage)
    }


    // Form validate after submit
    const validate = () => {
        validationField('username', field.username, setError, setErrorMessage)
        validationField('password', field.password, setError, setErrorMessage)
        if ((error.username === true || error.password === true) || (field.username.length === 0 || field.password.length === 0)) {
            return false;
        } else {
            return true;
        }
    }



    // login with credential 
    const loginWithCredentialHandler = async () => {
        if (validate()) {
            // validation passed 
            await credLogin(field.username, field.password, setAuthenticate, setUser, openToast, closeToast)

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
                    id="username_at"
                    name="username"
                    label="username"
                    placeholder='Enter username'
                    type='text'
                    required={true}
                    value={field.username}
                    inputHandler={inputHandler}
                    errorId="username_at-error"
                    error={error.username}
                    errorMessage={errorMessage.username}
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
                    label='Sign in'
                    logo={false}
                    action={loginWithCredentialHandler}
                />


            </form>



        </div>
    )
}

export default LoginWithCredential