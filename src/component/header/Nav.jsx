import React from 'react'
import { NavigationData } from '../../data/data'
import { NavLink } from 'react-router-dom'
import Dropdown from '../dropdown/Dropdown'


const nav = () => {
    return (
        <nav className="navbar">
            {
                NavigationData.map(links => {
                    const { id, title, link, dropdown, submenu, logo } = links;
                    return dropdown
                        ? <Dropdown
                            key={id}
                            submenu={submenu}
                            logo={logo}
                            title={title}
                            type='click'
                            callback={() => null
                            }
                        />
                        :
                        <NavLink
                            to={link}
                            className="navbar-link"
                            key={id}>
                            <span className="icon">{logo}</span>
                            <span className="txt">{title}</span>
                        </NavLink>
                })
            }

        </nav>
    )
}

export default nav