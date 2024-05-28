import React from 'react'
import { GoogleLogout } from '../../auth/Auth';
import { useStateContext } from '../../contexts/ContextProvider'
import { SecondaryButton } from '../button/Button'



const Logout = () => {

    const { setAuthenticate } = useStateContext();

    const logoutClickHandeler = () => {
        GoogleLogout(setAuthenticate);
    };

    return (
        <SecondaryButton
            size='s'
            action={logoutClickHandeler}
            label="Logout"
            additionalClass={'logout-btn'}
        />
    )
}

export default Logout