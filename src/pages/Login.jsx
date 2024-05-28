import React, { useState } from 'react'
import LoginInstructions from '../component/instructions/LoginInstructions'
import Logo from '../component/logo/Logo'
import LoginWithCredential from '../component/loginForm/LoginWithCredential'
import LoginWithGoogle from '../component/loginForm/LoginWithGoogle'
import SignupWithCredential from '../component/loginForm/SignupWithCredential'
import { Title, LightParagraph } from '../component/typhography/Typography'
import Toast from '../component/toast/Toast'
import { OrSeprator } from '../component/seprator/Seprator'
import '../assets/styles/login.css'
import { AnchorButton, Button } from '../component/button/Button'

const Login = () => {


    const [login, setLogin] = useState(true)
    const loginToggler = () => setLogin((prev) => !prev)

    return (
        <>
            <div className="login-page">
                <div className='wrapper'>
                    {/* login form   */}
                    <div className='left-section'>
                        <Logo type="black" additionalClass='brand-logo' />

                        <div className='login-form-container'>
                            <div className="head">
                                <Title size='l'>{login ? 'Sign in' : 'Sign up'}</Title>
                            </div>

                            {login ?
                                <LoginWithCredential /> :
                                <SignupWithCredential />
                            }

                        </div>
                        <br />
                        {login ? <LightParagraph size="xs" additionalClass='flex'>
                            Need a account. &nbsp;
                            <LightParagraph size="xs" additionalClass='link' onClick={loginToggler}>
                                Sign Up
                            </LightParagraph>

                        </LightParagraph>
                            : <LightParagraph size="xs" additionalClass='flex'>
                                Already have an account. &nbsp;
                                <LightParagraph size="xs" additionalClass='link' onClick={loginToggler}>
                                    Sign In
                                </LightParagraph>
                            </LightParagraph>}



                    </div>

                    {/* instruction  */}
                    <div className="right-seciton">
                        <LoginInstructions />
                    </div>


                </div>
            </div>

            <Toast />
        </>
    )
}

export default Login