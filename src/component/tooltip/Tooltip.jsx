import React, { useEffect } from 'react';
import './Tooltip.css';

const Tooltip = ({ children, text, additionalClass, tooltip_position }) => {


    // tooltip hover listener 
    const tootipListener = () => {
        const tooltipContainer = document.querySelector('.tooltip-container');
        const tooltip = document.querySelector('.tooltip');

        tooltipContainer.addEventListener('mouseenter', (e) => { //add show class on hover
            let tooltipContainerPosition = tooltipContainer.getBoundingClientRect();
            let tooltipPosition = tooltip.getBoundingClientRect();
            tooltip.classList.add('show')
        })

        tooltipContainer.addEventListener('mouseout', (e) => { //add show class on hover
            let tooltipContainerPosition = tooltipContainer.getBoundingClientRect();
            let tooltipPosition = tooltip.getBoundingClientRect();
            tooltip.classList.remove('show')
        })

    }

    useEffect(() => {
        tootipListener();
    }, [])

    return (
        <div className={`tooltip-container ${additionalClass ? additionalClass : ''} ${tooltip_position ? tooltip_position : 'center'}`}>
            <div className="tooltip">{text}</div>
            {children}
        </div>
    );
};

export default Tooltip;
