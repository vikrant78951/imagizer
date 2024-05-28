import React from 'react'
import './Instruction.css'
import backgroundImage from '../../assets/img/instructionBackground.png'
import { Title } from '../typhography/Typography'
import { List } from '../List/List'
import { AiFillCheckCircle } from 'react-icons/ai'
import { SingleLineSeprator } from '../seprator/Seprator'
import { LoginInstruction } from '../../data/data'



const LoginInstructions = () => {

    return (
        <div className='login-instruction'
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
            }}
        >

            <div className="instruction-card">
                <Title size='s'>Instruction for Sign In</Title>
                <SingleLineSeprator />
                <List
                    list={LoginInstruction}
                    icon={<AiFillCheckCircle />}
                    color='black'
                />
            </div>

        </div>
    )
}

export default LoginInstructions
