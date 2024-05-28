import React from 'react'
import { DarkParagraph } from '../typhography/Typography';
import { Checkbox } from '../forms/FormElements'

const BulkMappingTableRow = ({ rowId, tableData, selectedCard, onRowSelect }) => {

    const isChecked = selectedCard.some((selectedRow) => selectedRow === tableData);
 
    // handle checkbox click 
    const checkboxHandler = (event) => {
        onRowSelect(tableData, event.target.checked);
    }





    return <tr data-rowid={rowId}>
        <td>
            {
                tableData.url && <form className="form horizontal-gap-layout">
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
                tableData.url ? <img className='images' src={tableData.url} alt={tableData.keyword} /> : 'No image'
            }
        </td>
        <td><DarkParagraph size='xs' >{tableData.ssid}</DarkParagraph></td>
        <td><DarkParagraph size='xs' >{tableData.status}</DarkParagraph></td>

    </tr>
}

export default BulkMappingTableRow