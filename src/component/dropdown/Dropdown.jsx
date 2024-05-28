import React, { useEffect } from 'react';
import './Dropdown.css';
import { NavLink } from 'react-router-dom';
import { closeAllDropdown } from '../../helper/helper';

const Dropdown = ({ title, submenu, logo, type, callback, additionalClass }) => {

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

        const tooltips = document.querySelectorAll('.tooltip-container');
        for (const tooltip of tooltips) {
            if (!tooltip.contains(e.target)) {
                tooltip.classList.remove('active');
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
        <div className={`dropdown    ${additionalClass ? additionalClass : ''} ${type === 'click' ? 'on-click' : 'on-hover'}`}>
            <span className={`navbar-link `} onClick={dropdownClick}>
                {logo && <span className="icon">{logo}</span>}
                <span className="txt">{title}</span>
            </span>
            <ul className="dropdown-content">
                <div className="dropdown-box">
                    {submenu.map((item, index) => (
                        <li key={`submenu-${index}`} onClick={callback ? callback : () => null}>
                            <NavLink to={item.link} className="navbar-link" key={item.id}>
                                <span className="icon">{item.logo}</span>
                                <span className="txt">{item.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </div>
            </ul>
        </div>
    );
};

export default Dropdown;




export const DropdownMenu = ({ title, submenu, logo, type, callback, additionalClass }) => {

    // handle dropdown 
    // const dropdownClick = (e) => {
    //     closeAllDropdown()
    //     const currentDropdown = e.target.parentNode;
    //     currentDropdown.classList.add('active')
    // }

    const dropdownClick = (e) => {
        const currentDropdown = e.target.parentNode;
        if (currentDropdown.classList.contains('active')) {
            currentDropdown.classList.remove('active');
        } else {
            closeAllDropdown();
            currentDropdown.classList.add('active');
        }
    }



    const handleDocumentClick = (e) => {
        const dropdowns = document.querySelectorAll('.dropdown');
        for (const dropdown of dropdowns) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        }

        const tooltips = document.querySelectorAll('.tooltip-container');
        for (const tooltip of tooltips) {
            if (!tooltip.contains(e.target)) {
                tooltip.classList.remove('active');
            }
        }


    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const clickHandler = (value) => {
        callback(value)
        closeAllDropdown();
    }

    return (
        <div className={`dropdown dropdown-menu ${additionalClass ? additionalClass : ''} on-click`}>
            <span className={`navbar-link`} onClick={dropdownClick}>
                {logo && <span className="icon">{logo}</span>}
                <span className="txt">{title}</span>
            </span>
            <ul className="dropdown-content">
                <div className="dropdown-box">
                    {submenu.map((item, index) => (
                        <li key={`submenu-${index}`} className="navbar-link" onClick={() => clickHandler(item.value)}>
                            {item.logo && <span className="icon">{item.logo}</span>}
                            <span className="txt">{item.title}</span>
                        </li>
                    ))}
                </div>
            </ul>
        </div>
    );
};