import React from 'react'
import './Header.css'
import Logo from '../logo/Logo'
import Nav from './Nav'
import SelectTeam from '../team/SelectTeam'
import Logout from '../logout/Logout'
const Header = () => {
    return (
        <>
            <header >
                <div className='wrapper'>
                    <div className="logo-container"> <Logo type="white" /></div>
                    <Nav />
                    <SelectTeam />
                    <Logout />
                </div>
            </header>
            <div className="header-mask"></div>
        </>
    )
}

export default Header