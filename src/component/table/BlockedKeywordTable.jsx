import React, { useEffect, useState } from 'react'
import { DarkParagraph, LightParagraph } from '../typhography/Typography'
import UnblockKeyword from '../blockKeywordBtn/UnblockKeyword'
import '../table/Table.css'

const BlockkeywordTable = ({ tableData, handleBlockStatusChange }) => {

    const [newTableData, setNewTableData] = useState([]);

    useEffect(() => {
        setNewTableData(tableData)
    }, [tableData])


    return (
        <div>
            <table className='custom-table'>
                <thead>
                    <tr>
                        <th>
                            <LightParagraph size='xs'>Blocked Keyword</LightParagraph>
                        </th>
                        <th>
                            <LightParagraph size='xs'>Admin</LightParagraph>
                        </th>
                        <th>
                            <LightParagraph size='xs'>Action</LightParagraph>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        newTableData.map((tableRow, index) => {
                            const { keyword, admin } = tableRow;
                            return (
                                <tr key={index}>
                                    <td>
                                        <DarkParagraph size='xs'>{keyword}</DarkParagraph>
                                    </td>
                                    <td>
                                        <DarkParagraph size='xs'>{admin}</DarkParagraph>
                                    </td>
                                    <td>
                                        <UnblockKeyword
                                            keyword={keyword}
                                            blockStatus={true}
                                            handleBlockStatusChange={handleBlockStatusChange}
                                            confirmation={true}
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>

        </div>
    )
}

export default BlockkeywordTable