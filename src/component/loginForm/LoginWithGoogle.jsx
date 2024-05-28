import React from 'react'
import { GoogleLogin } from '../../auth/Auth'
import googleLogo from '../../assets/img/googleLogo.png'
import { useStateContext } from '../../contexts/ContextProvider'
import { SecondaryButton } from '../button/Button'

const LoginWithGoogle = () => {

    const { authenticate, setAuthenticate, openToast, closeToast, setUser } = useStateContext();

    // console.log('login LoginWithGoogle component authenticate',authenticate)

    // Login with Google handeler
    const Loginhandeler = GoogleLogin(setAuthenticate, setUser, openToast, closeToast);
    const LoginWithGoogleHandler = () => {
        openToast('loading', 'Signing in with Google')
        Loginhandeler()
        
    }

    return (
        <div className='login-width-google'>

            <SecondaryButton
                label='Sign in with Google'
                size='l'
                logo={true}
                logoSrc={googleLogo}
                logoType='img'
                additionalClass='dark-text'
                action={LoginWithGoogleHandler}
            />


        </div>
    )
}

export default LoginWithGoogle