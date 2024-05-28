import { googleLogout } from '@react-oauth/google';
import { LocalStorage } from '../helper/helper'
import { apis } from '../data/data';
import { useGoogleLogin } from '@react-oauth/google';
import { logoutHelper } from '../helper/helper';
import axios from 'axios';
import API from '../service/api';

// login with Credential 
export const credLogin = async (username, password, setAuthenticate, setUser, openToast, closeToast) => {
    openToast('loading', 'Signing In')


    const data = {
        username: username,
        password: password
    }

    try {
        // const response = await API.login(data)
        // const message = await response.data.message

        openToast('success', 'sign in sucessfully')
        closeToast(4000)

        setAuthenticate("true") //constent api set authentication true
        LocalStorage.set('authentication', "true")

        // console.log('user Email', userEmail)
        setUser(username)
        LocalStorage.set('user', username)


    } catch (error) {
        console.log(error)
        if (error.response) {
            openToast('error', error.response.data.message)
            closeToast(4000)
        } else {
            openToast('error', error.message)
            closeToast(4000)
        }

        // set authentication
        setAuthenticate("false") //constent api set authentication false
        LocalStorage.set('authentication', "false")

        // setUser 
        setUser('')
        LocalStorage.set('user', '')

    }



}

export const credSignup = async (username, password, setAuthenticate, setUser, openToast, closeToast) => {
    openToast('loading', 'Signing In')

    const data = new FormData()
    data.append('username', username)
    data.append('password', password)

    try {
        const response = await API.signup(data)
        const result = await response.json()
        console.log(result)
        openToast('success', 'signup sucessfully')
        closeToast(4000)

        setAuthenticate("true") //constent api set authentication true
        LocalStorage.set('authentication', "true")

        // console.log('user Email', userEmail)
        setUser(username)
        LocalStorage.set('user', username)

    } catch (error) {
        console.log(error)
        if (error.response) {
            openToast('error', error.response.data.message)
            closeToast(4000)
        } else {
            openToast('error', error.message)
            closeToast(4000)
        }

        // set authentication
        setAuthenticate("false") //constent api set authentication false
        LocalStorage.set('authentication', "false")

        // setUser 
        setUser('')
        LocalStorage.set('user', '')

    }
}


// login with Google 
export const GoogleLogin = (setAuthenticate, setUser, openToast, closeToast) => useGoogleLogin({
    onSuccess: async (response) => {
        //   console.log('google response', response);

        const googleUserInfoEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';
        const accessToken = response.access_token;

        // Fetch user info from the Google API userinfo endpoint
        await axios
            .get(googleUserInfoEndpoint, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then((data) => {
                console.log('userinfo response', data);

                const userEmail = data.data.email; // Fetch the user's email from the userinfo response

                let googleLoginApi = apis.loginWithGoogle;

                var urlencoded = new URLSearchParams();
                urlencoded.append("accessToken", accessToken);

                var requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: urlencoded,
                    credentials: 'include',
                };


                fetch(googleLoginApi, requestOptions) // check  user's email in database
                    .then(res => res.json())
                    .then((data) => {
                        //   console.log('response', res.data)

                        if (data.payload.status === 'success') {
                            // set authentication
                            setAuthenticate("true") //constent api set authentication true
                            LocalStorage.set('authentication', "true")

                            // console.log('user Email', userEmail)
                            setUser(userEmail)
                            LocalStorage.set('user', userEmail)

                            // Set toast to success
                            openToast('success', 'Successfully logged in')
                            closeToast(4000)

                        } else {

                            // set authentication
                            setAuthenticate("false") //constent api set authentication false
                            LocalStorage.set('authentication', "false")


                            // setUser 
                            setUser('')
                            LocalStorage.set('user', '')

                            // set toast to failed to login  
                            openToast('error', data.errorMessage)
                            closeToast(6000)

                        }
                    })
                    .catch((err) => {
                        // setUser 
                        setUser('')
                        LocalStorage.set('user', '')

                        // set toast to failed to login  
                        openToast('error', err.message)
                        closeToast(6000)

                    });
            })
            .catch((err) => {
                console.log('Failed to fetch userinfo:', err);
                openToast('error', 'Failed to fetch user information')
                closeToast(4000)
            });
    },

    // On failure
    onError: (error) => {
        console.log('Login Failed:', error);
        openToast('error', error.message)
        closeToast(4000)
    }
});


// Google logout 
export const GoogleLogout = async (setAuthenticate) => {

    googleLogout(); //google logout 

    await fetch(apis.logout, {
        method: 'GET',
        credentials: 'include',
    }).then(response => response.json())
        .then(res => {
            if (res.payload.status == 'success') {
                setAuthenticate("false");
                logoutHelper();
            }
            else {
                setAuthenticate("false");
                logoutHelper();
                console.log('something went wrong')
            }

        })

};

