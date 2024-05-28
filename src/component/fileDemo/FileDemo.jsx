import React from 'react';
import './FileDemo.css'
import { AnchorButton } from '../button/Button';
import { LightParagraph, Title } from '../typhography/Typography';
import { demoFileIcon } from '../../assets/icon/Icon';

const FileDemo = ({ demoFile }) => {
    return (
        <div className="demo-file">
            <ul>
                <li>

                    <div className='icon'>
                        {demoFileIcon}
                    </div>

                    <div className='details'>
                        <Title size='xs'> Demo Files </Title>
                        <LightParagraph size='xs'>
                            You can download the attached example and use them as a starting point for your own file.                        </LightParagraph>
                    </div>

                </li>
                <li>
                    <AnchorButton
                        additionalClass='white'
                        size='m'
                        link={demoFile}
                        target='_blank'
                        label='Download File'
                        type="download"
                    />
                </li>
            </ul>
        </div >
    );
};

export default FileDemo;
