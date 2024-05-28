import React, { useEffect, useState } from 'react'
import './SelectTeam.css'
import { domainList } from '../../data/data'
import { greenTick, downArrow } from '../../assets/icon/Icon'
import { LocalStorage } from '../../helper/helper'
import { useStateContext } from '../../contexts/ContextProvider'
import { apis } from '../../data/data'
import { closeAllDropdown, logoutHelper } from '../../helper/helper'

const SelectTeam = () => {
    const { team, setTeam, openToast, closeToast, setAuthenticate } = useStateContext();

    // initial team
    useEffect(() => {
        let preTeam = LocalStorage.get('team');
        if (preTeam) {
            setTeam(preTeam)
        } else {
            LocalStorage.set('team', 'All');
            setTeam('All')
        }
    }, [])


    const setDefaultDomain = async () => {
        try {
            LocalStorage.set('team', 'All');
            LocalStorage.set('domain', 'all');
            setTeam('All');
        } catch (error) {
            console.error(error);
        }
    }


    const teamClickHandeler = async ({ target }) => {
        let t = target.getAttribute('data-team');
        let d = target.getAttribute('data-domain');


        try {
            closeAllDropdown()
            LocalStorage.set('team', t);
            LocalStorage.set('domain', d);
            setTeam(t);
            openToast('success', 'Updating domain successful')
            closeToast(3000)
            
        } catch (error) {
            closeAllDropdown()

            console.error(error);
            openToast('error', error.message)
            closeToast(3000)
        }

    }

    useEffect(() => {
        if (team && team === 'All') {
            // console.log('setting default team')
            setDefaultDomain()
        }
    }, [])

    // handle dropdown 

    const dropdownClick = (e) => {
        closeAllDropdown()
        const currentDropdown = e.target.parentNode;
        currentDropdown.classList.add('active')
    }

    const handleDocumentClick = (e) => {
        const dropdowns = document.querySelectorAll('.dropdown');
        for (const dropdown of dropdowns) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (

        <div className={`dropdown select-dropdown select-team`} >
            <div className='dropdown-selector' onClick={dropdownClick}>
                <span className="txt">{team}</span>
                <span className="arrow">{downArrow}</span>
            </div>
            <ul className="dropdown-content">
                <div className="dropdown-box">
                    {
                        domainList.map((item, index) => (
                            <li className="navbar-link" key={index} data-team={item.label} data-domain={item.value} onClick={teamClickHandeler}>
                                <span className="txt">{item.label}</span>
                                {
                                    (team == item.label)
                                        ? <span className="checked">{greenTick}</span>
                                        : ''
                                }
                            </li>
                        ))
                    }
                </div>
            </ul>
        </div>
    )
}

export default SelectTeam