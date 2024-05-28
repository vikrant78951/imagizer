import React from 'react'
import { DarkParagraph } from '../typhography/Typography';
import { formatDateTime } from '../../helper/helper';
import { AnchorButton } from '../button/Button';
import { Checkbox } from '../forms/FormElements'

const EtaTableRow = ({ rowId, tableData, selectedCard, onRowSelect }) => {


    const isChecked = selectedCard.some((selectedRow) => selectedRow === tableData);

    // handle checkbox click 
    const checkboxHandler = (event) => {
        onRowSelect(tableData, event.target.checked);
    }
 
    return <tr data-rowid={rowId}>
        <td>
            {
                tableData.status === 'COMPLETED' && <form className="form horizontal-gap-layout">
                    <div className="form-row">
                        <Checkbox
                            id={`uploadedImages_at-${rowId}`}
                            name={`uploadedImages-${rowId}`}
                            label={false}
                            inputHandler={checkboxHandler}
                            autoFocus={false}
                            checked={isChecked}
                        />
                    </div>
                </form>

            }

        </td>
        <td><DarkParagraph size='xs' >{tableData.keyword}</DarkParagraph></td>
        <td>
            {
                tableData.status === 'COMPLETED' ?
                    <img className='images' src={tableData.imagePath} alt={tableData.keyword} />
                    : <AnchorButton
                        size='xs'
                        additionalClass='blue'
                        label='Shutterstock image'
                        link={tableData.url}
                        target="_blank"
                    />
            }
        </td>
        <td><DarkParagraph size='xs' >{tableData.initialRank}</DarkParagraph></td>
        <td><DarkParagraph size='xs' >{tableData.status}</DarkParagraph></td>
        <td><DarkParagraph size='xs' >{formatDateTime(tableData.queuedAt)}</DarkParagraph></td>
        <td><DarkParagraph size='xs' >{tableData.ETA}</DarkParagraph></td>
        <td><DarkParagraph size='xs' >{tableData.currentRank}</DarkParagraph></td>

    </tr>
}

export default EtaTableRow