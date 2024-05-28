import React from 'react'
import './List.css'
import { Title, DarkParagraph } from '../typhography/Typography'
import { SingleLineSeprator } from '../seprator/Seprator'


export const List = ({ list, additionalClass, icon, color }) => {
    return (
        <ul className={`list ${color ? color : ''} ${additionalClass ? additionalClass : ''}`}>
            {list.map(item => (
                <li key={item.id}>
                    <span className="icon">{icon}</span>
                    <span className="txt">
                        <DarkParagraph size='s' >
                            {item.point}
                        </DarkParagraph>
                    </span>
                </li>
            ))}
        </ul>
    )
}


export const ListWithTitle = ({ list, additionalClass, icon, color }) => {
    return (
        <div className="list-with-title">
            {
                list.map((inst, index) => (
                    <div key={index}>
                        <Title size='xxs'>{inst.title}</Title>
                        <ul className={`list ${color ? color : ''} ${additionalClass ? additionalClass : ''}`}>
                            {inst.content.map((item, index) => (
                                <li key={index}>
                                    <span className="icon">{icon}</span>
                                    <span className="txt">
                                        <DarkParagraph size='s' >
                                            {item}
                                        </DarkParagraph>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        {(index !== list.length - 1) && <SingleLineSeprator />}

                    </div>
                ))
            }

        </div>

    )
}



